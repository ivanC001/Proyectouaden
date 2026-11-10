/**
 * RIQUEZA CON CONOCIMIENTO — UADEN Global & Anglo Consultores
 * Cuenta regresiva, modal de registro, carrusel multimedia, calendario y entradas en escena.
 */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Número comercial al que llegan los registros */
  const WA_NUMBER = '5511930331168';
  const waLink = (text) => 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');

  /* ----------------------------------------------------------------------
     1. Cuenta regresiva sincronizada — Miércoles 14 de octubre, 15:00 Chicago
     ---------------------------------------------------------------------- */
  const target = new Date('2026-10-14T15:00:00-05:00').getTime();
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const left = target - Date.now();

    const d = left <= 0 ? '00' : pad(Math.floor(left / 86400000));
    const h = left <= 0 ? '00' : pad(Math.floor((left % 86400000) / 3600000));
    const m = left <= 0 ? '00' : pad(Math.floor((left % 3600000) / 60000));
    const s = left <= 0 ? '00' : pad(Math.floor((left % 60000) / 1000));

    document.querySelectorAll('.countdown-days, #days').forEach((el) => { el.textContent = d; });
    document.querySelectorAll('.countdown-hours, #hours').forEach((el) => { el.textContent = h; });
    document.querySelectorAll('.countdown-minutes, #minutes').forEach((el) => { el.textContent = m; });
    document.querySelectorAll('.countdown-seconds, #seconds').forEach((el) => { el.textContent = s; });
  }

  tick();
  setInterval(tick, 1000);

  /* ----------------------------------------------------------------------
     2. Modal de Registro Emergente
     ---------------------------------------------------------------------- */
  const modalRegistro = document.getElementById('modalRegistro');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalRegistroBtn = document.getElementById('closeModalRegistroBtn');
  const modalTriggers = document.querySelectorAll('.btn-modal-trigger, [data-modal="registro"]');
  let lastFocusedElement = null;

  function openModalRegistro() {
    if (!modalRegistro) return;
    lastFocusedElement = document.activeElement;
    modalRegistro.hidden = false;
    requestAnimationFrame(() => {
      modalRegistro.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';

    // Pone foco en el primer campo del formulario
    const firstInput = modalRegistro.querySelector('#fullName');
    if (firstInput) {
      window.setTimeout(() => firstInput.focus(), 120);
    } else if (closeModalRegistroBtn) {
      closeModalRegistroBtn.focus();
    }
  }

  function closeModalRegistro() {
    if (!modalRegistro) return;
    modalRegistro.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      modalRegistro.hidden = true;
    }, 280);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModalRegistro();
    });
  });

  if (closeModalRegistroBtn) {
    closeModalRegistroBtn.addEventListener('click', closeModalRegistro);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModalRegistro);
  }

  if (modalRegistro) {
    modalRegistro.addEventListener('click', (event) => {
      if (event.target === modalRegistro) {
        closeModalRegistro();
      }
    });
  }

  // Soporte para skip-link que abre el modal
  const skipLink = document.getElementById('skipLink');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModalRegistro();
    });
  }

  /* ----------------------------------------------------------------------
     3. Carrusel Multimedia Interactivo ("Dónde ocurre el trabajo")
     ---------------------------------------------------------------------- */
  const carousel = document.getElementById('entornoCarousel');
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const counterEl = document.getElementById('carouselCounter');

  if (carousel && carouselTrack) {
    const slides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoplayTimer = null;

    // Generar botones de puntos (dots)
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Ir a diapositiva ${idx + 1} de ${totalSlides}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

    function updateSlide() {
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, idx) => {
        const isActive = idx === currentSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (counterEl) {
        counterEl.textContent = `${pad(currentSlide + 1)} / ${pad(totalSlides)}`;
      }
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateSlide();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    // Navegación con teclado dentro del carrusel
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      }
    });

    // Soporte táctil / swipe en móviles
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        nextSlide();
        resetAutoplay();
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
        resetAutoplay();
      }
    }

    // Autoplay automático
    function startAutoplay() {
      if (reducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 4800);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    updateSlide();
    startAutoplay();
  }

  /* ----------------------------------------------------------------------
     4. Preguntas frecuentes (Acordeón)
     ---------------------------------------------------------------------- */
  const questions = Array.from(document.querySelectorAll('.qa-q'));

  function closeAnswer(btn) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel || btn.getAttribute('aria-expanded') !== 'true') return;
    btn.setAttribute('aria-expanded', 'false');

    if (reducedMotion) { panel.hidden = true; return; }

    panel.style.height = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
      panel.style.transition = 'height 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease';
      panel.style.opacity = '0';
      panel.style.height = '0px';
    });
    window.setTimeout(() => {
      panel.hidden = true;
      panel.style.cssText = '';
    }, 300);
  }

  function openAnswer(btn) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.setAttribute('aria-expanded', 'true');
    panel.hidden = false;

    if (reducedMotion) return;

    const full = panel.scrollHeight;
    panel.style.height = '0px';
    panel.style.opacity = '0';
    requestAnimationFrame(() => {
      panel.style.transition = 'height 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
      panel.style.height = full + 'px';
      panel.style.opacity = '1';
    });
    window.setTimeout(() => { panel.style.cssText = ''; }, 360);
  }

  questions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      questions.forEach(closeAnswer);
      if (!isOpen) openAnswer(btn);
    });
  });

  /* ----------------------------------------------------------------------
     5. Cabecera fija y barra flotante
     ---------------------------------------------------------------------- */
  const masthead = document.getElementById('masthead');
  const dock = document.getElementById('dock');
  const cover = document.getElementById('inicio');

  function onScroll() {
    if (masthead) masthead.classList.toggle('is-stuck', window.scrollY > 24);

    if (dock && cover) {
      const passed = cover.getBoundingClientRect().bottom < 0;
      dock.classList.toggle('is-visible', passed);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     6. Entradas en escena (IntersectionObserver)
     ---------------------------------------------------------------------- */
  const revealables = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealables.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------------------
     7. Procesamiento del Formulario y Modal de Confirmación
     ---------------------------------------------------------------------- */
  const form = document.getElementById('registrationForm');
  const sheet = document.getElementById('confirmationModal');
  const sheetClose = document.getElementById('closeModalBtn');
  const registeredName = document.getElementById('registeredName');
  const formError = document.getElementById('formError');

  function showError(message, field) {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
    document.querySelectorAll('.field.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
    if (field) {
      field.closest('.field').classList.add('is-invalid');
      field.focus();
    }
  }

  function clearError() {
    if (formError) { formError.hidden = true; formError.textContent = ''; }
    document.querySelectorAll('.field.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
  }

  function openSheet() {
    if (!sheet) return;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    if (sheetClose) sheetClose.focus();
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(() => { sheet.hidden = true; }, 280);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  if (form) {
    form.addEventListener('input', clearError);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const field = document.getElementById('knowledgeField');

      if (!fullName.value.trim()) {
        showError('Escribe tu nombre completo para reservar el lugar.', fullName);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        showError('Revisa el correo: ahí enviamos el enlace de acceso.', email);
        return;
      }
      if (phone.value.replace(/\D/g, '').length < 7) {
        showError('Agrega un teléfono válido para el recordatorio.', phone);
        return;
      }

      clearError();

      /* El registro viaja por WhatsApp: se arma el mensaje y se abre el chat */
      const profileLabel = field.options[field.selectedIndex].text;
      const message = [
        'Hola, quiero reservar mi lugar en la sesión *Riqueza con Conocimiento* (miércoles 14 de octubre, 15:00 Chicago).',
        '',
        'Nombre: ' + fullName.value.trim(),
        'Correo: ' + email.value.trim(),
        'Teléfono: ' + phone.value.trim(),
        'Perfil: ' + profileLabel
      ].join('\n');

      const url = waLink(message);

      /* Se abre en el mismo gesto del clic */
      const opened = window.open(url, '_blank', 'noopener');
      if (!opened) window.location.href = url;

      const label = form.querySelector('.action-label');
      if (label) label.textContent = 'Abriendo WhatsApp…';

      if (registeredName) {
        const first = fullName.value.trim().split(/\s+/)[0];
        registeredName.textContent = first ? first : 'te esperamos';
      }

      /* Enlace de respaldo en la confirmación */
      const waFallback = document.getElementById('btnWhatsApp');
      if (waFallback) waFallback.href = url;

      try {
        localStorage.setItem('uaden_registro', JSON.stringify({
          fullName: fullName.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          profile: field.value,
          savedAt: new Date().toISOString()
        }));
      } catch (e) { /* almacenamiento no disponible */ }

      // Cierra modal de registro y abre la hoja de confirmación con calendarios
      closeModalRegistro();
      window.setTimeout(() => {
        openSheet();
      }, 350);

      window.setTimeout(() => {
        if (label) label.textContent = 'Confirmar y reservar por WhatsApp';
      }, 2200);
    });
  }

  if (sheetClose) sheetClose.addEventListener('click', closeSheet);

  if (sheet) {
    sheet.addEventListener('click', (event) => {
      if (event.target === sheet) closeSheet();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modalRegistro && !modalRegistro.hidden && modalRegistro.classList.contains('is-open')) {
        closeModalRegistro();
      } else if (sheet && !sheet.hidden && sheet.classList.contains('is-open')) {
        closeSheet();
      }
    }
  });

  /* ----------------------------------------------------------------------
     8. Enlaces directos de WhatsApp
     ---------------------------------------------------------------------- */
  const waIntro = {
    hero:    "Hola, quiero más información sobre la sesión *Riqueza con Conocimiento* (14 de octubre).",
    directo: "Hola, vengo del sitio de *Riqueza con Conocimiento* y quiero reservar mi lugar en la sesión del 14 de octubre.",
    cierre:  "Hola, quiero reservar mi lugar en *Riqueza con Conocimiento* (14 de octubre, 15:00 Chicago).",
    dock:    "Hola, quiero información sobre la sesión *Riqueza con Conocimiento*.",
    pie:     "Hola, quiero información sobre la sesión *Riqueza con Conocimiento*."
  };

  document.querySelectorAll("[data-wa]").forEach((el) => {
    const intro = waIntro[el.dataset.wa];
    if (intro) el.href = waLink(intro);
  });

  /* ----------------------------------------------------------------------
     9. Calendario (.ics y Google Calendar)
     ---------------------------------------------------------------------- */
  const session = {
    title: 'Riqueza con Conocimiento · Sesión magistral (UADEN Global & Anglo Consultores)',
    description: 'Sesión en vivo sobre cómo convertir conocimiento y consultoría en un modelo de negocio escalable, con los casos de UADEN Global y Anglo Consultores.',
    location: 'Transmisión privada en línea (el enlace llega por correo)',
    start: '20261014T200000Z',
    end: '20261014T220000Z'
  };

  const googleBtn = document.getElementById('btnGoogleCal');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
        + '&text=' + encodeURIComponent(session.title)
        + '&dates=' + session.start + '/' + session.end
        + '&details=' + encodeURIComponent(session.description)
        + '&location=' + encodeURIComponent(session.location);
      window.open(url, '_blank', 'noopener');
    });
  }

  const icsBtn = document.getElementById('btnIcsCal');
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//UADEN Global//Riqueza con Conocimiento//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:riqueza-con-conocimiento-2026-10-14@uaden.global',
        'SUMMARY:' + session.title,
        'DESCRIPTION:' + session.description,
        'LOCATION:' + session.location,
        'DTSTART:' + session.start,
        'DTEND:' + session.end,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Riqueza-con-Conocimiento.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
});
