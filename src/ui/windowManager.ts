import { apps } from '../data/content';
import { taskbar } from './taskbar';

interface WindowState {
  id: string;
  element: HTMLElement;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

class WindowManager {
  private windows: WindowState[] = [];
  private baseZIndex = 100;
  private activeZIndex = 1000;
  private desktopContainer: HTMLElement | null = null;

  init(container: HTMLElement) {
    this.desktopContainer = container;
    
    // Listen for taskbar clicks
    document.addEventListener('taskbar-window-click', (e: any) => {
      const id = e.detail.id;
      const win = this.windows.find(w => w.id === id);
      if (win) {
        if (win.minimized) {
          this.restore(id);
        } else if (win.element.classList.contains('active')) {
          this.minimize(id);
        } else {
          this.focus(id);
        }
      }
    });
  }

  open(appId: string) {
    if (!this.desktopContainer) return;

    // Check if already open
    const existing = this.windows.find(w => w.id === appId);
    if (existing) {
      this.focus(appId);
      if (existing.minimized) this.restore(appId);
      return;
    }

    const appData = apps[appId as keyof typeof apps];
    if (!appData) return;

    const iconPath = appData.icon || `/assets/icons/${appId.replace('-window', '')}.webp`;

    const winEl = document.createElement('div');
    winEl.className = 'xp-window';
    winEl.id = `window-${appId}`;
    winEl.style.zIndex = this.baseZIndex.toString();

    const offset = this.windows.length * 30;
    const startTop = Math.max(8, Math.min(100 + offset, window.innerHeight - 240));
    const startLeft = Math.max(8, Math.min(100 + offset, window.innerWidth - 240));
    winEl.style.top = `${startTop}px`;
    winEl.style.left = `${startLeft}px`;

    winEl.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">
          <img src="${iconPath}" onerror="this.style.display='none'" class="title-icon" />
          ${appData.title}
        </div>
        <div class="title-bar-controls">
          <button class="control-btn minimize" aria-label="Minimize">_</button>
          <button class="control-btn maximize" aria-label="Maximize">□</button>
          <button class="control-btn close" aria-label="Close">X</button>
        </div>
      </div>
      <div class="window-body">
        ${appData.content}
      </div>
    `;

    // Event Listeners
    const closeBtn = winEl.querySelector('.close') as HTMLElement;
    closeBtn.onclick = (e) => { e.stopPropagation(); this.close(appId); };

    const minBtn = winEl.querySelector('.minimize') as HTMLElement;
    minBtn.onclick = (e) => { e.stopPropagation(); this.minimize(appId); };
    
    const maxBtn = winEl.querySelector('.maximize') as HTMLElement;
    maxBtn.onclick = (e) => { e.stopPropagation(); this.maximize(appId); };

    winEl.addEventListener('mousedown', () => this.focus(appId));

    // Dragging
    const titleBar = winEl.querySelector('.title-bar') as HTMLElement;
    this.makeDraggable(winEl, titleBar);

    this.desktopContainer.appendChild(winEl);
    
    this.windows.push({
      id: appId,
      element: winEl,
      minimized: false,
      maximized: false,
      zIndex: this.baseZIndex
    });

    taskbar.addWindow(appId, appData.title, iconPath, true);

    this.wireAppBehaviors(appId, winEl);

    this.focus(appId);
  }

  private wireAppBehaviors(appId: string, winEl: HTMLElement) {
    if (appId === 'fun-window') {
      const lightbox = winEl.querySelector('[data-lightbox]') as HTMLElement | null;
      const lightboxImg = lightbox?.querySelector('img') as HTMLImageElement | null;
      const closeBtn = lightbox?.querySelector('.lightbox-close') as HTMLElement | null;

      const openLightbox = (src: string) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
      };
      const closeLightbox = () => lightbox?.classList.add('hidden');

      winEl.querySelectorAll<HTMLElement>('.dog-tile').forEach((tile) => {
        tile.addEventListener('click', () => {
          const src = tile.dataset.src;
          if (src) openLightbox(src);
        });
        tile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const src = tile.dataset.src;
            if (src) openLightbox(src);
          }
        });
      });

      closeBtn?.addEventListener('click', closeLightbox);
      lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    if (appId === 'contact-window') {
      const form = winEl.querySelector<HTMLFormElement>('[data-contact-form]');
      const status = winEl.querySelector<HTMLElement>('[data-contact-status]');
      const submitButton = winEl.querySelector<HTMLButtonElement>('[data-contact-submit]');

      const setStatus = (message: string, type: 'idle' | 'error' | 'success' = 'idle') => {
        if (!status) return;
        status.textContent = message;
        status.dataset.state = type;
      };

      form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();
        const company = String(formData.get('company') || '').trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setStatus('Please enter a valid email address.', 'error');
          return;
        }
        if (!message) {
          setStatus('Please write a message first.', 'error');
          return;
        }

        submitButton?.setAttribute('disabled', 'true');
        setStatus('Sending...', 'idle');

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message, company })
          });
          const result = await response.json().catch(() => null);

          if (!response.ok || !result?.ok) {
            throw new Error(result?.message || 'Message could not be sent right now.');
          }

          form.reset();
          setStatus('Message sent. Thanks for reaching out!', 'success');
        } catch (error) {
          setStatus(
            error instanceof Error ? error.message : 'Message could not be sent right now.',
            'error'
          );
        } finally {
          submitButton?.removeAttribute('disabled');
        }
      });
    }
  }

  close(id: string) {
    const win = this.windows.find(w => w.id === id);
    if (win && win.element.parentNode) {
      win.element.parentNode.removeChild(win.element);
      this.windows = this.windows.filter(w => w.id !== id);
      taskbar.removeWindow(id);
    }
  }

  minimize(id: string) {
    const win = this.windows.find(w => w.id === id);
    if (win) {
      win.minimized = true;
      win.element.style.display = 'none';
      taskbar.setActive(''); // None active
    }
  }

  restore(id: string) {
    const win = this.windows.find(w => w.id === id);
    if (win) {
      win.minimized = false;
      win.element.style.display = 'flex';
      this.focus(id);
    }
  }
  
  maximize(id: string) {
    const win = this.windows.find(w => w.id === id);
    if (win) {
      if (win.maximized) {
        win.element.classList.remove('maximized');
        win.maximized = false;
      } else {
         win.element.classList.add('maximized');
         win.maximized = true;
      }
    }
  }

  focus(id: string) {
    // Reset all z-indexes
    this.windows.forEach(w => {
      w.element.style.zIndex = this.baseZIndex.toString();
      w.element.classList.remove('active');
    });

    // Bring target to front
    const win = this.windows.find(w => w.id === id);
    if (win) {
      win.element.style.zIndex = this.activeZIndex.toString();
      win.element.classList.add('active');
      taskbar.setActive(id);
    }
  }

  makeDraggable(element: HTMLElement, handle: HTMLElement) {
    let isDragging = false;
    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (element.classList.contains('maximized')) return;
      if ((e.target as HTMLElement).closest('.control-btn')) return;

      isDragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = element.offsetLeft;
      initialTop = element.offsetTop;

      try { handle.setPointerCapture(e.pointerId); } catch {}
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== activePointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const taskbarHeight = 30;
      const maxLeft = window.innerWidth - 40;
      const maxTop = window.innerHeight - taskbarHeight - 20;
      const nextLeft = Math.max(-element.offsetWidth + 60, Math.min(initialLeft + dx, maxLeft));
      const nextTop = Math.max(0, Math.min(initialTop + dy, maxTop));

      element.style.left = `${nextLeft}px`;
      element.style.top = `${nextTop}px`;
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      try { handle.releasePointerCapture(e.pointerId); } catch {}
    };

    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  }
}

export const windowManager = new WindowManager();
