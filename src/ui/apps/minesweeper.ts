type PresetKey = 'beginner' | 'intermediate' | 'expert';
type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

type MineCell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

const PRESETS: Record<PresetKey, { label: string; cols: number; rows: number; mines: number }> = {
  beginner: { label: 'Beginner', cols: 9, rows: 9, mines: 10 },
  intermediate: { label: 'Intermediate', cols: 16, rows: 16, mines: 40 },
  expert: { label: 'Expert', cols: 30, rows: 16, mines: 99 }
};

const padCounter = (value: number) => String(clamp(value, -99, 999)).padStart(3, '0');

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export const mountMinesweeper = (root: HTMLElement) => {
  const host = root.querySelector<HTMLElement>('[data-minesweeper-app]') || root;
  const abort = new AbortController();

  host.innerHTML = `
    <div class="mine-shell">
      <div class="mine-menu">
        ${Object.entries(PRESETS)
          .map(([key, preset]) => `<button type="button" class="xp-button mine-preset" data-preset="${key}">${preset.label}</button>`)
          .join('')}
        <button type="button" class="xp-button mine-flag-mode" data-flag-mode>Flag mode</button>
      </div>
      <div class="mine-panel">
        <div class="mine-counter" data-counter>010</div>
        <button type="button" class="mine-smiley" data-reset aria-label="Reset Minesweeper">:)</button>
        <div class="mine-counter" data-timer>000</div>
      </div>
      <div class="mine-board-wrap">
        <div class="mine-board" data-board aria-label="Minesweeper board"></div>
      </div>
    </div>
  `;

  const boardEl = host.querySelector<HTMLElement>('[data-board]');
  const counterEl = host.querySelector<HTMLElement>('[data-counter]');
  const timerEl = host.querySelector<HTMLElement>('[data-timer]');
  const resetButton = host.querySelector<HTMLButtonElement>('[data-reset]');
  const flagModeButton = host.querySelector<HTMLButtonElement>('[data-flag-mode]');
  if (!boardEl || !counterEl || !timerEl || !resetButton || !flagModeButton) {
    return () => abort.abort();
  }

  const boardNode = boardEl;
  const counterNode = counterEl;
  const timerNode = timerEl;
  const resetNode = resetButton;
  const flagModeNode = flagModeButton;

  let presetKey: PresetKey = 'beginner';
  let preset = PRESETS[presetKey];
  let board: MineCell[] = [];
  let generated = false;
  let status: GameStatus = 'ready';
  let elapsed = 0;
  let timerId: number | null = null;
  let flagMode = false;

  const indexFor = (col: number, row: number) => row * preset.cols + col;

  const coordsFor = (index: number) => ({
    col: index % preset.cols,
    row: Math.floor(index / preset.cols)
  });

  const neighborsFor = (index: number) => {
    const { col, row } = coordsFor(index);
    const neighbors: number[] = [];

    for (let y = row - 1; y <= row + 1; y += 1) {
      for (let x = col - 1; x <= col + 1; x += 1) {
        if (x === col && y === row) continue;
        if (x < 0 || y < 0 || x >= preset.cols || y >= preset.rows) continue;
        neighbors.push(indexFor(x, y));
      }
    }

    return neighbors;
  };

  const stopTimer = () => {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
  };

  const startTimer = () => {
    if (timerId !== null || status !== 'playing') return;

    timerId = window.setInterval(() => {
      elapsed = clamp(elapsed + 1, 0, 999);
      timerNode.textContent = padCounter(elapsed);
      if (elapsed >= 999) stopTimer();
    }, 1000);
  };

  const createEmptyBoard = () =>
    Array.from({ length: preset.cols * preset.rows }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0
    }));

  const placeMines = (safeIndex: number) => {
    const safeIndexes = new Set([safeIndex, ...neighborsFor(safeIndex)]);
    const candidates = board
      .map((_, index) => index)
      .filter((index) => !safeIndexes.has(index));

    for (let i = candidates.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    candidates.slice(0, preset.mines).forEach((index) => {
      board[index].mine = true;
    });

    board.forEach((cell, index) => {
      cell.adjacent = neighborsFor(index).filter((neighbor) => board[neighbor].mine).length;
    });

    generated = true;
  };

  const revealMines = () => {
    board.forEach((cell) => {
      if (cell.mine) cell.revealed = true;
    });
  };

  const countFlags = () => board.filter((cell) => cell.flagged).length;

  const checkWin = () => {
    const hiddenSafeCells = board.some((cell) => !cell.mine && !cell.revealed);
    if (hiddenSafeCells) return;

    status = 'won';
    stopTimer();
    board.forEach((cell) => {
      if (cell.mine) cell.flagged = true;
    });
  };

  const revealCell = (index: number) => {
    const cell = board[index];
    if (!cell || cell.flagged || cell.revealed || status === 'won' || status === 'lost') return;

    if (!generated) {
      placeMines(index);
      status = 'playing';
      startTimer();
    }

    if (cell.mine) {
      cell.revealed = true;
      status = 'lost';
      revealMines();
      stopTimer();
      render();
      return;
    }

    const queue = [index];
    const visited = new Set<number>();

    while (queue.length) {
      const currentIndex = queue.shift();
      if (currentIndex === undefined || visited.has(currentIndex)) continue;
      visited.add(currentIndex);

      const current = board[currentIndex];
      if (!current || current.flagged || current.revealed) continue;

      current.revealed = true;
      if (current.adjacent === 0) {
        neighborsFor(currentIndex).forEach((neighbor) => {
          if (!visited.has(neighbor)) queue.push(neighbor);
        });
      }
    }

    checkWin();
    render();
  };

  const toggleFlag = (index: number) => {
    const cell = board[index];
    if (!cell || cell.revealed || status === 'won' || status === 'lost') return;

    cell.flagged = !cell.flagged;
    render();
  };

  const chordCell = (index: number) => {
    const cell = board[index];
    if (!cell || !cell.revealed || cell.adjacent === 0 || status === 'won' || status === 'lost') return;

    const neighbors = neighborsFor(index);
    const flags = neighbors.filter((neighbor) => board[neighbor].flagged).length;
    if (flags !== cell.adjacent) return;

    neighbors.forEach((neighbor) => {
      if (!board[neighbor].flagged && !board[neighbor].revealed) revealCell(neighbor);
    });
  };

  const resetGame = (nextPresetKey = presetKey) => {
    presetKey = nextPresetKey;
    preset = PRESETS[presetKey];
    board = createEmptyBoard();
    generated = false;
    status = 'ready';
    elapsed = 0;
    stopTimer();
    render();
  };

  const cellContent = (cell: MineCell) => {
    if (!cell.revealed) return cell.flagged ? 'F' : '';
    if (cell.mine) return '*';
    return cell.adjacent > 0 ? String(cell.adjacent) : '';
  };

  const cellLabel = (cell: MineCell, index: number) => {
    const { col, row } = coordsFor(index);
    if (cell.flagged) return `Flagged cell ${col + 1}, ${row + 1}`;
    if (!cell.revealed) return `Hidden cell ${col + 1}, ${row + 1}`;
    if (cell.mine) return `Mine at ${col + 1}, ${row + 1}`;
    return `Revealed ${cell.adjacent || 'empty'} at ${col + 1}, ${row + 1}`;
  };

  function render() {
    const remainingMines = preset.mines - countFlags();
    counterNode.textContent = padCounter(remainingMines);
    timerNode.textContent = padCounter(elapsed);
    resetNode.textContent = status === 'lost' ? ':(' : status === 'won' ? 'B)' : ':)';
    flagModeNode.classList.toggle('active', flagMode);

    host.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
      button.classList.toggle('active', button.dataset.preset === presetKey);
    });

    boardNode.style.gridTemplateColumns = `repeat(${preset.cols}, var(--mine-cell-size))`;
    boardNode.innerHTML = board
      .map((cell, index) => {
        const classes = [
          'mine-cell',
          cell.revealed ? 'revealed' : '',
          cell.flagged ? 'flagged' : '',
          cell.mine && cell.revealed ? 'mine' : '',
          cell.revealed && cell.adjacent > 0 ? `n${cell.adjacent}` : ''
        ]
          .filter(Boolean)
          .join(' ');

        return `<button type="button" class="${classes}" data-index="${index}" aria-label="${cellLabel(cell, index)}">${cellContent(cell)}</button>`;
      })
      .join('');
  }

  const handleBoardClick = (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.mine-cell');
    if (!button?.dataset.index) return;

    const index = Number(button.dataset.index);
    const cell = board[index];
    if (!cell) return;

    if (flagMode && !cell.revealed) {
      toggleFlag(index);
      return;
    }

    if (cell.revealed) chordCell(index);
    else revealCell(index);
  };

  const handleContextMenu = (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.mine-cell');
    if (!button?.dataset.index) return;

    event.preventDefault();
    toggleFlag(Number(button.dataset.index));
  };

  const handleHostClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const presetButton = target.closest<HTMLButtonElement>('[data-preset]');

    if (presetButton?.dataset.preset) {
      resetGame(presetButton.dataset.preset as PresetKey);
    }

    if (target.closest('[data-reset]')) {
      resetGame();
    }

    if (target.closest('[data-flag-mode]')) {
      flagMode = !flagMode;
      render();
    }
  };

  boardNode.addEventListener('click', handleBoardClick, { signal: abort.signal });
  boardNode.addEventListener('contextmenu', handleContextMenu, { signal: abort.signal });
  host.addEventListener('click', handleHostClick, { signal: abort.signal });

  resetGame();

  return () => {
    stopTimer();
    abort.abort();
  };
};
