document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const modal = document.querySelector('#disclaimerModal');

  // Set copyright year
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Header Scroll & Progress Bar
  function onScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Navigation Toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }

  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Animated Counter Stats with Smooth Easing
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * easeOut);
        
        el.textContent = target >= 1000 ? value.toLocaleString('es-ES') : value;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target >= 1000 ? target.toLocaleString('es-ES') : target;
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  // Modal Dialog Handlers
  const openModalBtn = document.querySelector('[data-modal-open]');
  const closeModalBtn = document.querySelector('[data-modal-close]');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => modal.showModal());
  }
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.close());
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }

  // Interactive 3D Card Hover Tilt Effect for Benefit Cards
  document.querySelectorAll('.benefit-card, .method-card, .hero-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Lead Form Handling & WhatsApp Redirect
  const leadForm = document.querySelector('#leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      const data = new FormData(leadForm);
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.innerHTML = 'Enviando Solicitud <i class="bi bi-arrow-repeat"></i>';

      const nombre = encodeURIComponent(data.get('nombre') || '');
      const pais = encodeURIComponent(data.get('pais') || '');
      const email = encodeURIComponent(data.get('email') || '');
      const telefono = encodeURIComponent(data.get('telefono') || '');
      const mensaje = encodeURIComponent(data.get('mensaje') || '');

      const text = `Hola, deseo información sobre el Diplomado Internacional para Real Estate.%0A%0ANombre: ${nombre}%0APaís: ${pais}%0ACorreo: ${email}%0AWhatsApp: ${telefono}%0AMensaje: ${mensaje}`;

      window.open(`https://wa.me/12232400531?text=${text}`, '_blank', 'noopener,noreferrer');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.innerHTML = originalText;
      }, 1000);
    });
  }
});
