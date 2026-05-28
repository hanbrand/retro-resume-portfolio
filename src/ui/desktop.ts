import { windowManager } from './windowManager';
import { taskbar } from './taskbar';
import { startMenu } from './startMenu';
import { desktopIcons } from '../data/content';

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
      document
        .querySelectorAll('.desktop-icon')
        .forEach((el) => el.classList.remove('selected'));
      iconEl.classList.add('selected');
      iconEl.focus();
    });

    iconEl.addEventListener('dblclick', () => {
      windowManager.open(icon.component);
    });

    // Touch: single tap opens (no native dblclick on most mobile)
    iconEl.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        e.stopPropagation();
        windowManager.open(icon.component);
      }
    });

    iconEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        windowManager.open(icon.component);
      }
    });

    iconsContainer.appendChild(iconEl);
  });

  desktop.addEventListener('click', () => {
    document
      .querySelectorAll('.desktop-icon')
      .forEach((el) => el.classList.remove('selected'));
  });

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
