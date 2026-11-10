/* ==========================================================================
   DISNEY MAGICAL INTERACTION - STARDUST, MASCOT MENU & EASTER EGGS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Stardust / Pixie Dust Cursor Magic Effect
  let lastSparkleTime = 0;
  const sparkles = ['✨', '⭐', '✦', '🌟', '💫', '💛', '🪄'];
  const colors = ['#d4af37', '#0284c7', '#b8860b', '#7c3aed', '#e11d48', '#0ea5e9'];

  function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 65) return; // Throttle to maintain 60fps performance
    lastSparkleTime = now;

    const el = document.createElement('span');
    el.className = 'magic-sparkle-particle';
    el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.textShadow = '0 0 8px rgba(212, 175, 55, 0.6), 0 2px 5px rgba(11, 25, 44, 0.25)';

    // Random trajectory
    const dx = (Math.random() - 0.5) * 60;
    const dy = -25 - Math.random() * 35;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(el);

    setTimeout(() => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 1200);
  }

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    // Only spawn occasionally on move to keep it elegant and subtle
    if (Math.random() < 0.35) {
      createSparkle(e.clientX, e.clientY);
    }
  });

  // Touch listener for mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && Math.random() < 0.4) {
      createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // 2. Floating Disney Mascot Trigger Menu
  const triggerBtn = document.getElementById('disneyMascotTrigger');
  const mascotsMenu = document.getElementById('disneyMascotsMenu');

  if (triggerBtn && mascotsMenu) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mascotsMenu.classList.toggle('active');
      burstConfetti(triggerBtn.getBoundingClientRect());
    });

    document.addEventListener('click', (e) => {
      if (!triggerBtn.contains(e.target) && !mascotsMenu.contains(e.target)) {
        mascotsMenu.classList.remove('active');
      }
    });
  }

  // 3. Stardust Burst on Character Click
  function burstConfetti(rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'magic-sparkle-particle';
        el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        el.style.left = `${centerX}px`;
        el.style.top = `${centerY}px`;
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (i / 14) * 2 * Math.PI;
        const dist = 40 + Math.random() * 50;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 20;

        el.style.setProperty('--dx', `${dx}px`);
        el.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(el);

        setTimeout(() => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }, 1200);
      }, i * 35);
    }
  }

  // Attach burst effect to character bubbles and cards
  const characterBubbles = document.querySelectorAll('.disney-mascot-bubble, .disney-character-card');
  characterBubbles.forEach((el) => {
    el.addEventListener('click', () => {
      burstConfetti(el.getBoundingClientRect());
    });
  });
});