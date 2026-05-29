import { initBoot } from './boot';
import { initDesktop } from './desktop';
import { windowManager } from './windowManager';
import { desktopIcons } from '../data/content';

export class StartMenu {
  private element: HTMLElement | null = null;
  private isOpen = false;

  init(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'start-menu';
    this.element.className = 'hidden';

    const launcherItems = desktopIcons
      .map(
        (i) => `
           <div class="start-item" data-app="${i.component}">
             <img src="${i.icon}" alt="" /> ${i.title}
           </div>`
      )
      .join('');

    this.element.innerHTML = `
      <div class="start-header">
        <div class="user-frame"><img src="/assets/user/me.jpg" alt="Brandon Han" /></div>
        <span class="user-name">Brandon Han</span>
      </div>
      <div class="start-body">
        <div class="start-left">
           ${launcherItems}
        </div>
        <div class="start-right">
           <div class="start-item"><a href="mailto:brandonh4n@gmail.com">E-mail Brandon</a></div>
           <div class="start-item"><a href="https://www.thehanbrand.dev" target="_blank" rel="noopener">My Website</a></div>
           <div class="start-item"><a href="https://github.com/hanbrand" target="_blank" rel="noopener">GitHub</a></div>
           <div class="start-item"><a href="https://www.linkedin.com/in/brandonh4n" target="_blank" rel="noopener">LinkedIn</a></div>
           <div class="separator"></div>
           <div class="start-item"><a href="/assets/resume/Brandon-Han-Resume-2026.pdf" target="_blank" rel="noopener">Open Resume PDF</a></div>
           <div class="start-item"><a href="/assets/resume/Brandon-Han-Resume-2026.pdf" download="Brandon-Han-Resume-2026.pdf">Download Resume</a></div>
        </div>
      </div>
      <div class="start-footer">
        <div class="footer-btn" id="logoff-btn">
          <span class="footer-icon" aria-hidden="true">&#128274;</span> Log Off
        </div>
        <div class="footer-btn" id="shutdown-btn">
          <span class="footer-icon" aria-hidden="true">&#9211;</span> Turn Off Computer
        </div>
      </div>
    `;

    // App launchers
    this.element.querySelectorAll<HTMLElement>('.start-item[data-app]').forEach((item) => {
      item.addEventListener('click', () => {
        const appId = item.dataset.app;
        if (appId) {
          windowManager.open(appId);
          this.close();
        }
      });
    });

    // Click handlers
    this.element.querySelector('#logoff-btn')?.addEventListener('click', () => {
       this.close();
       // Simulate logoff
       const app = document.querySelector<HTMLDivElement>('#app')!;
       app.innerHTML = '';
       initBoot(() => initDesktop());
    });
    
    this.element.querySelector('#shutdown-btn')?.addEventListener('click', () => {
       this.close();
       location.reload(); // Simple reboot
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.element?.contains(e.target as Node) && !(e.target as HTMLElement).closest('.start-button')) {
        this.close();
      }
    });

    container.appendChild(this.element);
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.element?.classList.remove('hidden');
    this.isOpen = true;
    if (this.element) this.element.style.zIndex = '10000';
    document.body.classList.add('start-open');
  }

  close() {
    this.element?.classList.add('hidden');
    this.isOpen = false;
    document.body.classList.remove('start-open');
  }
}

export const startMenu = new StartMenu();
