import { startMenu } from './startMenu';

export class Taskbar {
  private element: HTMLElement | null = null;
  private windowsContainer: HTMLElement | null = null;
  private clockInterval: number | null = null;

  init(container: HTMLElement) {
    // Guard against re-init (e.g. log-off cycle)
    if (this.element && this.element.isConnected) return;

    const bar = document.createElement('div');
    bar.id = 'taskbar';
    this.element = bar;

    // Start button (uses authentic XP bitmap)
    const startBtn = document.createElement('button');
    startBtn.className = 'start-button';
    startBtn.type = 'button';
    startBtn.setAttribute('aria-label', 'Start');
    startBtn.innerHTML = `
      <img src="/assets/desktop/start-button.webp" alt="" class="start-button-image"
           draggable="false" decoding="async" />
    `;
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.toggle();
    });

    // Open windows strip
    const windowsContainer = document.createElement('div');
    windowsContainer.className = 'taskbar-windows';
    this.windowsContainer = windowsContainer;

    // System tray with live clock
    const tray = document.createElement('div');
    tray.className = 'system-tray';
    const clock = document.createElement('span');
    clock.id = 'clock';
    tray.appendChild(clock);
    this.updateClock(clock);
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = window.setInterval(() => this.updateClock(clock), 1000);

    bar.append(startBtn, windowsContainer, tray);
    container.appendChild(bar);
  }

  private updateClock(el: HTMLElement) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  addWindow(id: string, title: string, icon: string, active: boolean) {
    if (!this.windowsContainer) return;

    const btn = document.createElement('div');
    btn.className = `taskbar-item${active ? ' active' : ''}`;
    btn.dataset.id = id;
    btn.innerHTML = `
      <img src="${icon}" alt="" onerror="this.style.display='none'" />
      <span>${title}</span>
    `;

    btn.onclick = () => {
      document.dispatchEvent(
        new CustomEvent('taskbar-window-click', { detail: { id } })
      );
    };

    this.windowsContainer.appendChild(btn);
  }

  removeWindow(id: string) {
    this.windowsContainer
      ?.querySelector(`.taskbar-item[data-id="${id}"]`)
      ?.remove();
  }

  setActive(id: string) {
    this.windowsContainer
      ?.querySelectorAll<HTMLElement>('.taskbar-item')
      .forEach((el) => {
        el.classList.toggle('active', el.dataset.id === id);
      });
  }
}

export const taskbar = new Taskbar();
