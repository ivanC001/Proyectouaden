'use strict';

/* ============================================================
   DISNEY DIPLOMADO — main.js
   ============================================================ */

// ── 1. Selector de código de país ──────────────────────────
(function initPhoneSelector() {
  const countrySelect = document.getElementById('country-code');
  const phoneInput = document.getElementById('telefono');
  const hiddenPrefix = document.getElementById('full-phone-prefix');

  if (!countrySelect || !phoneInput || !hiddenPrefix) return;

  function updatePrefix() {
    const code = countrySelect.value;
    hiddenPrefix.value = code;
    phoneInput.placeholder = `${code} número`;
  }

  countrySelect.addEventListener('change', updatePrefix);
  updatePrefix();
})();

// ── 2. Validación y envío del formulario ───────────────────
(function initForm() {
  const form = document.getElementById('form-diplomado');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellidos = form.apellidos.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const prefix = document.getElementById('full-phone-prefix').value;

    if (!nombre || !apellidos || !email || !telefono) {
      alert('Por favor completa todos los campos.');
      return;
    }

    console.log('Formulario enviado:', { nombre, apellidos, email, telefono: `${prefix} ${telefono}` });

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ ¡Enviado! Te contactamos pronto.';
    btn.disabled = true;
    btn.style.backgroundImage = 'none';
    btn.style.backgroundColor = '#27ae60';
    btn.style.animation = 'none';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.backgroundImage = '';
      btn.style.backgroundColor = '';
      btn.style.animation = '';
      form.reset();
      document.getElementById('full-phone-prefix').value = '+1';
      document.getElementById('telefono').placeholder = '+1 número';
    }, 4000);
  });
})();

// ── 3. Polvo de Estrellas — Fairy Dust ────────────────────
// Canvas fijo sobre el Hero que genera partículas blancas/doradas
// flotando suavemente hacia arriba.
(function initFairyDust() {
  // Insertamos el canvas dentro del hero
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'fairy-canvas';
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '2',       // sobre el overlay, bajo el contenido
    mixBlendMode: 'screen',
  });
  // Insert before hero-content so it stays behind text
  const heroContent = hero.querySelector('.hero-content');
  hero.insertBefore(canvas, heroContent);

  const ctx = canvas.getContext('2d');
  const COLORS = [
    'rgba(255,255,255,',   // blanco
    'rgba(212,175,55,',    // dorado --disney-gold
    'rgba(255,105,180,',   // rosado --pixie-pink
  ];
  const PARTICLE_COUNT = 60;
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = hero.clientWidth;
    H = canvas.height = hero.clientHeight;
  }

  function randomParticle(fromBottom = true) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: fromBottom ? H + Math.random() * 80 : Math.random() * H,
      r: Math.random() * 2.2 + 0.5,
      speed: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.35,
      // Opacity is fixed — particles don't fade; they respawn at the bottom
      opacity: Math.random() * 0.5 + 0.35,
      color,
    };
  }

  function init() {
    resize();
    // Scatter particles across the full hero height on load
    particles = Array.from({ length: PARTICLE_COUNT }, () => randomParticle(false));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += -p.speed;   // float upward
      p.x += p.drift;    // gentle horizontal sway

      // Respawn at the bottom once the particle exits the top
      if (p.y < -10) {
        particles[i] = randomParticle(true);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;
      ctx.shadowColor = `${p.color}0.8)`;
      ctx.shadowBlur = p.r * 3;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById('scrollToTop');

    // Mostrar/Ocultar botón según el scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = "1";
            scrollTopBtn.style.visibility = "visible";
            scrollTopBtn.style.transform = "scale(1)";
        } else {
            scrollTopBtn.style.opacity = "0";
            scrollTopBtn.style.visibility = "hidden";
            scrollTopBtn.style.transform = "scale(0)";
        }
    });

    // Función de scroll suave al inicio
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
































































(function() {
    const navInner = document.querySelector('.nav-inner');
    const mainNav = document.getElementById('main-nav');
    
    if (navInner && mainNav && !document.getElementById('menu-toggle')) {
        // Crear botón
        const btn = document.createElement('button');
        btn.id = 'menu-toggle';
        btn.className = 'mobile-nav-toggle';
        btn.innerHTML = '<span></span><span></span><span></span>';
        
        // Insertarlo
        navInner.appendChild(btn);

        // Funcionalidad
        btn.onclick = () => mainNav.classList.toggle('mobile-open');

        // Cerrar al clickear links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = () => mainNav.classList.remove('mobile-open');
        });
    }
})();

const toggleBtn = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');

if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        nav.classList.toggle('mobile-open');
        console.log("Menu toggle clickeado. Clase actual: " + nav.className);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');

    if (btn && nav) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evita que el clic se "pierda" en el fondo
            nav.classList.toggle('mobile-open');
            console.log("Estado del menú: " + nav.classList.contains('mobile-open'));
        };
    }
});

// Coloca esto al final de tu archivo .js
(function() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');

    if (btn && nav) {
        // Usamos 'touchstart' además de 'click' para celulares viejos/Safari
        const toggleMenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            nav.classList.toggle('mobile-open');
            // Añadimos la clase al body también por si acaso
            document.body.classList.toggle('menu-active');
        };

        btn.addEventListener('click', toggleMenu);
        btn.addEventListener('touchstart', toggleMenu, {passive: false});
    }
})();































// Coloca esto al final de tus scripts
document.addEventListener('click', function(e) {
    // Si el usuario toca algo que sea (o esté dentro de) un link de WhatsApp
    const waLink = e.target.closest('a[href*="wa.me"]');
    
    if (waLink) {
        console.log("Detectado clic forzado en WhatsApp");
        // No usamos preventDefault para que el navegador haga su trabajo
        // Pero si el link está "muerto", lo revivimos:
        window.open(waLink.href, '_blank');
    }
}, true); // El 'true' hace que este evento se ejecute antes que cualquier otro
































document.getElementById('form-diplomado').addEventListener('submit', function(event) {
    // 1. Obtenemos los campos
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    // 2. Verificamos si alguno está vacío
    if (nombre === "" || apellidos === "" || email === "" || telefono === "") {
        // DETENEMOS el envío del formulario
        event.preventDefault(); 
        
        alert("Por favor completa todos los campos.");
        return false; // Salimos de la función
    }

    // Si llega aquí, es porque los campos NO están vacíos
    console.log("Formulario válido. Enviando...");
    
    // Si estás usando un mensaje de "Enviado con éxito" manual (AJAX), 
    // pon aquí tu lógica de envío. 
});





















