export const initBoot = (onComplete: () => void) => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  // Clear app
  app.innerHTML = '';

  // Container for boot/login
  const bootContainer = document.createElement('div');
  bootContainer.id = 'boot-container';
  bootContainer.style.width = '100%';
  bootContainer.style.height = '100%';
  bootContainer.style.background = '#000';
  bootContainer.style.display = 'flex';
  bootContainer.style.flexDirection = 'column';
  bootContainer.style.alignItems = 'center';
  bootContainer.style.justifyContent = 'center';
  app.appendChild(bootContainer);

  // 1. Boot Logo Screen
  const renderBootScreen = () => {
    bootContainer.innerHTML = `
      <div class="boot-screen">
        <img src="/assets/boot/boot-wordmark.webp" alt="Windows XP" class="boot-logo" />
        <div class="loading-bar-container">
          <img src="/assets/boot/loading.webp" alt="Loading..." class="loading-bar" />
        </div>
      </div>
    `;
    
    // Auto transition after 3s
    setTimeout(() => {
      renderLoginScreen();
    }, 3000);
  };

  // Preload startup sound during boot so the chime is ready the moment
  // the user clicks their account on the login screen.
  const startupSound = new Audio('/assets/sounds/windows-xp-startup.mp3');
  startupSound.preload = 'auto';
  startupSound.volume = 0.85;

  // 2. Login Screen
  const renderLoginScreen = () => {
    // Blue background for login
    bootContainer.style.background = '#00309C'; // XP Login Blue
    bootContainer.style.transition = 'background 0.5s';

    // Split layout: Left (Logo), Right (User)
    bootContainer.innerHTML = `
      <div class="login-screen">
        <div class="login-left">
           <img src="/assets/boot/boot-wordmark.webp" alt="Windows XP" class="login-logo" />
           <div class="login-divider"></div>
        </div>
        <div class="login-right">
          <div class="user-account" role="button" tabindex="0">
            <div class="user-icon-frame">
              <img src="/assets/user/me.jpg" alt="Brandon Han" class="user-icon" />
            </div>
            <div class="user-details">
              <span class="user-name">Brandon Han</span>
              <span class="user-status">ML / AI Engineer</span>
            </div>
          </div>
        </div>
      </div>
      <div class="login-footer">
        <div class="footer-action">
           <img src="/assets/desktop/start-button.webp" style="filter: grayscale(1); width: 20px; height: 20px; display: none;" /> 
           <!-- Placeholder for turn off computer -->
           <span>Turn off computer</span>
        </div>
      </div>
    `;

    // Add click handler
    const userBtn = bootContainer.querySelector('.user-account') as HTMLElement;
    
    let loggingIn = false;
    const handleLogin = () => {
       if (loggingIn) return;
       loggingIn = true;

       // Kick off the Windows XP startup chime. Browsers require a user
       // gesture to play audio, and this click counts as one.
       try {
         startupSound.currentTime = 0;
         const playPromise = startupSound.play();
         if (playPromise && typeof playPromise.catch === 'function') {
           playPromise.catch(() => { /* ignore autoplay failures */ });
         }
       } catch { /* no-op */ }

       // Visually acknowledge the click, then fade to desktop on a beat
       // that matches the chime's intro.
       userBtn.style.pointerEvents = 'none';
       userBtn.classList.add('logging-in');
       bootContainer.style.transition = 'opacity 0.8s ease-out, background 0.5s';
       bootContainer.style.opacity = '0';

       setTimeout(() => {
         onComplete(); // callback to load desktop
       }, 1200);
    };

    userBtn.onclick = handleLogin;
    userBtn.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleLogin();
    };
  };

  renderBootScreen();
};
