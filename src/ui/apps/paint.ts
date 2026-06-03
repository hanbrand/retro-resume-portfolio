type PaintTool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rectangle' | 'ellipse' | 'fill';

type CanvasPoint = {
  x: number;
  y: number;
};

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const MAX_UNDO_STATES = 10;

const TOOL_LABELS: Record<PaintTool, string> = {
  pencil: 'Pencil',
  brush: 'Brush',
  eraser: 'Eraser',
  line: 'Line',
  rectangle: 'Rectangle',
  ellipse: 'Ellipse',
  fill: 'Fill'
};

const COLORS = [
  '#000000',
  '#7f7f7f',
  '#880015',
  '#ed1c24',
  '#ff7f27',
  '#fff200',
  '#22b14c',
  '#00a2e8',
  '#3f48cc',
  '#a349a4',
  '#ffffff',
  '#c3c3c3'
];

const hexToRgba = (hex: string) => {
  const normalized = hex.replace('#', '');
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: 255
  };
};

export const mountPaint = (root: HTMLElement) => {
  const host = root.querySelector<HTMLElement>('[data-paint-app]') || root;
  const abort = new AbortController();

  host.innerHTML = `
    <div class="paint-shell">
      <div class="paint-toolbar" aria-label="Paint tools">
        <div class="paint-tool-group" data-tool-buttons>
          ${Object.entries(TOOL_LABELS)
            .map(([tool, label]) => `<button type="button" class="xp-button paint-tool" data-tool="${tool}">${label}</button>`)
            .join('')}
        </div>
        <div class="paint-tool-group paint-sizes" aria-label="Brush size">
          <label>Size</label>
          <input type="range" min="1" max="18" value="3" data-size />
        </div>
        <div class="paint-tool-group paint-actions">
          <button type="button" class="xp-button" data-action="undo">Undo</button>
          <button type="button" class="xp-button" data-action="redo">Redo</button>
          <button type="button" class="xp-button" data-action="clear">Clear</button>
          <button type="button" class="xp-button" data-action="download">Save</button>
        </div>
        <div class="paint-swatches" aria-label="Paint colors">
          ${COLORS.map((color) => `<button type="button" class="paint-swatch" data-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join('')}
        </div>
      </div>
      <div class="paint-canvas-wrap">
        <canvas class="paint-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" aria-label="Paint canvas"></canvas>
      </div>
    </div>
  `;

  const canvas = host.querySelector<HTMLCanvasElement>('.paint-canvas');
  const sizeInput = host.querySelector<HTMLInputElement>('[data-size]');
  if (!canvas || !sizeInput) return () => abort.abort();

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return () => abort.abort();

  let activeTool: PaintTool = 'pencil';
  let activeColor = '#000000';
  let brushSize = Number(sizeInput.value);
  let pointerId: number | null = null;
  let lastPoint: CanvasPoint | null = null;
  let shapeStart: CanvasPoint | null = null;
  let shapeSnapshot: ImageData | null = null;
  let undoStack: ImageData[] = [];
  let redoStack: ImageData[] = [];

  const getPoint = (event: PointerEvent): CanvasPoint => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const capture = () => ctx.getImageData(0, 0, canvas.width, canvas.height);

  const refreshButtons = () => {
    host.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((button) => {
      button.classList.toggle('active', button.dataset.tool === activeTool);
    });
    host.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((button) => {
      button.classList.toggle('active', button.dataset.color === activeColor);
    });

    const undoButton = host.querySelector<HTMLButtonElement>('[data-action="undo"]');
    const redoButton = host.querySelector<HTMLButtonElement>('[data-action="redo"]');
    if (undoButton) undoButton.disabled = undoStack.length === 0;
    if (redoButton) redoButton.disabled = redoStack.length === 0;
  };

  const pushUndo = () => {
    undoStack.push(capture());
    if (undoStack.length > MAX_UNDO_STATES) undoStack = undoStack.slice(-MAX_UNDO_STATES);
    redoStack = [];
    refreshButtons();
  };

  const restore = (imageData: ImageData) => {
    ctx.putImageData(imageData, 0, 0);
    refreshButtons();
  };

  const clearCanvas = () => {
    pushUndo();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const setStrokeStyle = () => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : activeColor;
    ctx.fillStyle = activeColor;
    ctx.lineWidth = activeTool === 'brush' ? brushSize * 2 : brushSize;
  };

  const drawLineTo = (point: CanvasPoint) => {
    if (!lastPoint) return;
    setStrokeStyle();
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
  };

  const drawShapePreview = (point: CanvasPoint) => {
    if (!shapeStart || !shapeSnapshot) return;

    ctx.putImageData(shapeSnapshot, 0, 0);
    setStrokeStyle();
    ctx.beginPath();

    const width = point.x - shapeStart.x;
    const height = point.y - shapeStart.y;

    if (activeTool === 'line') {
      ctx.moveTo(shapeStart.x, shapeStart.y);
      ctx.lineTo(point.x, point.y);
    }

    if (activeTool === 'rectangle') {
      ctx.rect(shapeStart.x, shapeStart.y, width, height);
    }

    if (activeTool === 'ellipse') {
      ctx.ellipse(
        shapeStart.x + width / 2,
        shapeStart.y + height / 2,
        Math.abs(width / 2),
        Math.abs(height / 2),
        0,
        0,
        Math.PI * 2
      );
    }

    ctx.stroke();
  };

  const fillAt = (point: CanvasPoint) => {
    const imageData = capture();
    const data = imageData.data;
    const startX = Math.floor(point.x);
    const startY = Math.floor(point.y);
    const targetIndex = (startY * canvas.width + startX) * 4;
    const target = [
      data[targetIndex],
      data[targetIndex + 1],
      data[targetIndex + 2],
      data[targetIndex + 3]
    ];
    const replacement = hexToRgba(activeColor);

    if (
      target[0] === replacement.r &&
      target[1] === replacement.g &&
      target[2] === replacement.b &&
      target[3] === replacement.a
    ) {
      return;
    }

    pushUndo();
    const stack: CanvasPoint[] = [{ x: startX, y: startY }];

    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      if (current.x < 0 || current.y < 0 || current.x >= canvas.width || current.y >= canvas.height) continue;

      const index = (current.y * canvas.width + current.x) * 4;
      if (
        data[index] !== target[0] ||
        data[index + 1] !== target[1] ||
        data[index + 2] !== target[2] ||
        data[index + 3] !== target[3]
      ) {
        continue;
      }

      data[index] = replacement.r;
      data[index + 1] = replacement.g;
      data[index + 2] = replacement.b;
      data[index + 3] = replacement.a;

      stack.push(
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      );
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;

    const point = getPoint(event);
    pointerId = event.pointerId;
    try { canvas.setPointerCapture(event.pointerId); } catch {}

    if (activeTool === 'fill') {
      fillAt(point);
      pointerId = null;
      return;
    }

    pushUndo();
    lastPoint = point;
    shapeStart = point;
    shapeSnapshot = capture();

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      drawLineTo(point);
    }

    event.preventDefault();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;

    const point = getPoint(event);
    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      drawLineTo(point);
    } else {
      drawShapePreview(point);
    }

    event.preventDefault();
  };

  const endPointer = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;

    if (shapeStart && shapeSnapshot && activeTool !== 'pencil' && activeTool !== 'brush' && activeTool !== 'eraser') {
      drawShapePreview(getPoint(event));
    }

    pointerId = null;
    lastPoint = null;
    shapeStart = null;
    shapeSnapshot = null;
    try { canvas.releasePointerCapture(event.pointerId); } catch {}
  };

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const toolButton = target.closest<HTMLButtonElement>('[data-tool]');
    const colorButton = target.closest<HTMLButtonElement>('[data-color]');
    const actionButton = target.closest<HTMLButtonElement>('[data-action]');

    if (toolButton?.dataset.tool) {
      activeTool = toolButton.dataset.tool as PaintTool;
      refreshButtons();
    }

    if (colorButton?.dataset.color) {
      activeColor = colorButton.dataset.color;
      refreshButtons();
    }

    if (actionButton?.dataset.action === 'undo' && undoStack.length) {
      redoStack.push(capture());
      const previous = undoStack.pop();
      if (previous) restore(previous);
    }

    if (actionButton?.dataset.action === 'redo' && redoStack.length) {
      undoStack.push(capture());
      const next = redoStack.pop();
      if (next) restore(next);
    }

    if (actionButton?.dataset.action === 'clear') {
      clearCanvas();
    }

    if (actionButton?.dataset.action === 'download') {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'xp-paint.png';
      link.click();
    }
  };

  const handleSizeInput = () => {
    brushSize = Number(sizeInput.value);
  };

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  host.addEventListener('click', handleClick, { signal: abort.signal });
  sizeInput.addEventListener('input', handleSizeInput, { signal: abort.signal });
  canvas.addEventListener('pointerdown', onPointerDown, { signal: abort.signal });
  canvas.addEventListener('pointermove', onPointerMove, { signal: abort.signal });
  canvas.addEventListener('pointerup', endPointer, { signal: abort.signal });
  canvas.addEventListener('pointercancel', endPointer, { signal: abort.signal });

  refreshButtons();

  return () => abort.abort();
};
