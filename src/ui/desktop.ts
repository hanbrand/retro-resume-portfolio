import { windowManager } from './windowManager';
import { taskbar } from './taskbar';
import { startMenu } from './startMenu';
import { desktopIcons } from '../data/content';

type IconPosition = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  selectedStartPositions: Map<string, IconPosition>;
  hasMoved: boolean;
};

type SelectionState = {
  pointerId: number;
  startX: number;
  startY: number;
  box: HTMLElement;
  hasMoved: boolean;
};

const ICON_POSITION_KEY = 'xpDesktop.iconPositions.v1';
const ICON_WIDTH = 80;
const ICON_HEIGHT = 84;
const ICON_GAP = 14;

const canUseDesktopInteractions = () =>
  window.matchMedia('(pointer: fine) and (min-width: 761px)').matches;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const rectsIntersect = (a: DOMRect, b: DOMRect) =>
  a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;

export const initDesktop = () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  // Reset the app shell exactly once. Previous versions cleared twice,
  // which detached the taskbar + start menu after they were mounted.
  app.innerHTML = '';

  // Desktop surface (wallpaper + icons)
  const desktop = document.createElement('div');
  desktop.id = 'desktop';

  const iconsContainer = document.createElement('div');
  iconsContainer.id = 'desktop-icons';

  const iconElements = new Map<string, HTMLElement>();
  const iconPositions = new Map<string, IconPosition>();
  const selectedIconIds = new Set<string>();
  const isInteractiveDesktop = canUseDesktopInteractions();
  let dragState: DragState | null = null;
  let selectionState: SelectionState | null = null;
  let suppressNextClick = false;

  if (isInteractiveDesktop) {
    desktop.classList.add('desktop-interactive');
  }

  const loadSavedPositions = () => {
    if (!isInteractiveDesktop) return {};

    try {
      const raw = window.localStorage.getItem(ICON_POSITION_KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw) as Record<string, IconPosition>;
      if (!parsed || typeof parsed !== 'object') return {};
      return parsed;
    } catch {
      return {};
    }
  };

  const savedPositions = loadSavedPositions();

  const getDesktopBounds = () => {
    const rect = desktop.getBoundingClientRect();
    const fallbackHeight = Math.max(ICON_HEIGHT, window.innerHeight - 30);

    return {
      width: Math.max(rect.width || window.innerWidth, ICON_WIDTH),
      height: Math.max(rect.height || fallbackHeight, ICON_HEIGHT)
    };
  };

  const getDefaultPosition = (index: number) => {
    const bounds = getDesktopBounds();
    const usableHeight = Math.max(ICON_HEIGHT, bounds.height - 20);
    const rowHeight = ICON_HEIGHT + ICON_GAP;
    const rowsPerColumn = Math.max(1, Math.floor(usableHeight / rowHeight));
    const column = Math.floor(index / rowsPerColumn);
    const row = index % rowsPerColumn;

    return {
      x: 10 + column * (ICON_WIDTH + ICON_GAP),
      y: 10 + row * rowHeight
    };
  };

  const clampPosition = (position: IconPosition) => {
    const bounds = getDesktopBounds();
    return {
      x: clamp(position.x, 0, Math.max(0, bounds.width - ICON_WIDTH)),
      y: clamp(position.y, 0, Math.max(0, bounds.height - ICON_HEIGHT))
    };
  };

  const applyIconPosition = (id: string) => {
    const iconEl = iconElements.get(id);
    const position = iconPositions.get(id);
    if (!iconEl || !position) return;

    iconEl.style.left = `${position.x}px`;
    iconEl.style.top = `${position.y}px`;
  };

  const savePositions = () => {
    if (!isInteractiveDesktop) return;

    const payload = Array.from(iconPositions.entries()).reduce<Record<string, IconPosition>>(
      (acc, [id, position]) => {
        acc[id] = position;
        return acc;
      },
      {}
    );

    window.localStorage.setItem(ICON_POSITION_KEY, JSON.stringify(payload));
  };

  const syncSelectionClasses = () => {
    iconElements.forEach((iconEl, id) => {
      iconEl.classList.toggle('selected', selectedIconIds.has(id));
    });
  };

  const clearSelection = () => {
    selectedIconIds.clear();
    syncSelectionClasses();
  };

  const selectOnly = (id: string) => {
    selectedIconIds.clear();
    selectedIconIds.add(id);
    syncSelectionClasses();
  };

  const toggleSelection = (id: string) => {
    if (selectedIconIds.has(id)) selectedIconIds.delete(id);
    else selectedIconIds.add(id);
    syncSelectionClasses();
  };

  const openIcon = (component: string) => {
    clearSelection();
    windowManager.open(component);
  };

  const beginIconDrag = (iconId: string, e: PointerEvent) => {
    if (!isInteractiveDesktop || e.button !== 0 || e.pointerType === 'touch') return;

    if (e.ctrlKey || e.metaKey) {
      toggleSelection(iconId);
    } else if (!selectedIconIds.has(iconId)) {
      selectOnly(iconId);
    }

    const selectedStartPositions = new Map<string, IconPosition>();
    selectedIconIds.forEach((id) => {
      const position = iconPositions.get(id);
      if (position) selectedStartPositions.set(id, { ...position });
    });

    dragState = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      selectedStartPositions,
      hasMoved: false
    };
  };

  const updateIconDrag = (e: PointerEvent) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (!dragState.hasMoved && Math.hypot(dx, dy) < 4) return;

    dragState.hasMoved = true;
    desktop.classList.add('desktop-dragging');

    dragState.selectedStartPositions.forEach((startPosition, id) => {
      iconPositions.set(id, clampPosition({
        x: startPosition.x + dx,
        y: startPosition.y + dy
      }));
      applyIconPosition(id);
    });
  };

  const endIconDrag = (e: PointerEvent) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;

    if (dragState.hasMoved) {
      savePositions();
      suppressNextClick = true;
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }

    desktop.classList.remove('desktop-dragging');
    dragState = null;
  };

  const updateSelectionBox = (e: PointerEvent) => {
    if (!selectionState || e.pointerId !== selectionState.pointerId) return;

    const desktopRect = desktop.getBoundingClientRect();
    const currentX = e.clientX - desktopRect.left;
    const currentY = e.clientY - desktopRect.top;
    const left = Math.min(selectionState.startX, currentX);
    const top = Math.min(selectionState.startY, currentY);
    const width = Math.abs(currentX - selectionState.startX);
    const height = Math.abs(currentY - selectionState.startY);

    selectionState.hasMoved = selectionState.hasMoved || width > 4 || height > 4;
    selectionState.box.style.left = `${left}px`;
    selectionState.box.style.top = `${top}px`;
    selectionState.box.style.width = `${width}px`;
    selectionState.box.style.height = `${height}px`;

    const boxRect = selectionState.box.getBoundingClientRect();
    selectedIconIds.clear();
    iconElements.forEach((iconEl, id) => {
      if (rectsIntersect(boxRect, iconEl.getBoundingClientRect())) {
        selectedIconIds.add(id);
      }
    });
    syncSelectionClasses();
  };

  const endSelectionBox = (e: PointerEvent) => {
    if (!selectionState || e.pointerId !== selectionState.pointerId) return;

    if (!selectionState.hasMoved) clearSelection();
    else suppressNextClick = true;

    selectionState.box.remove();
    selectionState = null;
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  };

  const beginSelectionBox = (e: PointerEvent) => {
    if (!isInteractiveDesktop || e.button !== 0 || e.pointerType === 'touch') return;
    if ((e.target as HTMLElement).closest('.desktop-icon, .xp-window')) return;

    const desktopRect = desktop.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'desktop-selection-box';
    box.style.left = `${e.clientX - desktopRect.left}px`;
    box.style.top = `${e.clientY - desktopRect.top}px`;
    desktop.appendChild(box);

    clearSelection();
    selectionState = {
      pointerId: e.pointerId,
      startX: e.clientX - desktopRect.left,
      startY: e.clientY - desktopRect.top,
      box,
      hasMoved: false
    };

    try { desktop.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  };

  desktopIcons.forEach((icon) => {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.dataset.id = icon.id;
    iconEl.tabIndex = 0;
    iconEl.innerHTML = `
      <img src="${icon.icon}" alt="${icon.title}" />
      <span>${icon.title}</span>
    `;

    iconEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (suppressNextClick) return;
      if (e.ctrlKey || e.metaKey) toggleSelection(icon.id);
      else selectOnly(icon.id);
      iconEl.focus();
    });

    iconEl.addEventListener('dblclick', () => {
      if (!dragState) openIcon(icon.component);
    });

    // Touch: single tap opens (no native dblclick on most mobile)
    iconEl.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        e.stopPropagation();
        openIcon(icon.component);
      }
    });

    iconEl.addEventListener('pointerdown', (e) => {
      beginIconDrag(icon.id, e);
      if (dragState?.pointerId === e.pointerId) {
        try { iconEl.setPointerCapture(e.pointerId); } catch {}
        e.preventDefault();
        e.stopPropagation();
      }
    });

    iconEl.addEventListener('pointermove', updateIconDrag);
    iconEl.addEventListener('pointerup', (e) => {
      endIconDrag(e);
      try { iconEl.releasePointerCapture(e.pointerId); } catch {}
    });
    iconEl.addEventListener('pointercancel', (e) => {
      endIconDrag(e);
      try { iconEl.releasePointerCapture(e.pointerId); } catch {}
    });

    iconEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openIcon(icon.component);
      }
    });

    if (isInteractiveDesktop) {
      const defaultPosition = getDefaultPosition(iconElements.size);
      const savedPosition = savedPositions[icon.id];
      const nextPosition = savedPosition
        ? clampPosition(savedPosition)
        : clampPosition(defaultPosition);

      iconEl.classList.add('positioned');
      iconPositions.set(icon.id, nextPosition);
      iconElements.set(icon.id, iconEl);
      applyIconPosition(icon.id);
    } else {
      iconElements.set(icon.id, iconEl);
    }

    iconsContainer.appendChild(iconEl);
  });

  desktop.addEventListener('pointerdown', beginSelectionBox);
  desktop.addEventListener('pointermove', (e) => {
    updateIconDrag(e);
    updateSelectionBox(e);
  });
  desktop.addEventListener('pointerup', (e) => {
    endIconDrag(e);
    endSelectionBox(e);
    try { desktop.releasePointerCapture(e.pointerId); } catch {}
  });
  desktop.addEventListener('pointercancel', (e) => {
    endIconDrag(e);
    endSelectionBox(e);
    try { desktop.releasePointerCapture(e.pointerId); } catch {}
  });

  desktop.addEventListener('click', (e) => {
    if (suppressNextClick) return;
    if ((e.target as HTMLElement).closest('.desktop-icon, .xp-window')) return;
    clearSelection();
  });

  if (isInteractiveDesktop) {
    const handleResize = () => {
      if (!desktop.isConnected) {
        window.removeEventListener('resize', handleResize);
        return;
      }

      iconPositions.forEach((position, id) => {
        iconPositions.set(id, clampPosition(position));
        applyIconPosition(id);
      });
      savePositions();
    };

    window.addEventListener('resize', handleResize);
  }

  desktop.appendChild(iconsContainer);

  // Mount order matters:
  // 1) desktop (background layer)
  // 2) window manager root inside desktop
  // 3) start menu (above desktop, below taskbar visually but anchored to taskbar)
  // 4) taskbar (always on top)
  app.appendChild(desktop);
  windowManager.init(desktop);
  startMenu.init(app);
  taskbar.init(app);
};
