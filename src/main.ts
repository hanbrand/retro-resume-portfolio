import './styles/app.css';
import { initBoot } from './ui/boot';
import { initDesktop } from './ui/desktop';

const app = document.querySelector<HTMLDivElement>('#app')!;

const start = () => {
  // Clear app
  app.innerHTML = '';
  
  // Start boot sequence
  initBoot(() => {
    // When boot/login is done, load desktop
    initDesktop();
  });
};

// Auto start
start();
