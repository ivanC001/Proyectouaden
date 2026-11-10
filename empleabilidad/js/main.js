/* ============================================================================
   EMPLEABILIDAD 360° · Interacciones
   ----------------------------------------------------------------------------
   Módulos (cada uno se inicializa de forma independiente y tolera
   la ausencia de su HTML):
     1. headerScroll   — fondo sólido de la cabecera al hacer scroll
     2. mobileNav      — menú hamburguesa accesible
     3. revealOnScroll — animaciones de entrada con IntersectionObserver
     4. countUp        — contadores de los datos de misión del hero
     5. planGrid       — genera el calendario de 28 días y su animación
     6. accordion      — temario de 12 módulos (un panel abierto a la vez)
     7. enrollForm     — validación en línea del formulario de inscripción
     8. yearStamp      — año actual en el pie de página

   Principios:
     - Sin dependencias externas.
     - `prefers-reduced-motion` desactiva todo movimiento no esencial.
     - Lecturas y escrituras de DOM sin intercalar (evita layout thrashing).
   ========================================================================== */

import { initModuleExplorer } from './module-explorer.js';

(() => {
  'use strict';

  /** Preferencia del usuario: true si pidió reducir el movimiento. */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --------------------------------------------------------------------------
     1. CABECERA · Gana fondo sólido tras 24px de scroll.
        El listener es pasivo y se coalesce con requestAnimationFrame.
  ------------------------------------------------------------------------- */
  function headerScroll() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    let ticking = false;

    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update(); // estado correcto si la página carga ya desplazada (#ancla)
  }

  /* --------------------------------------------------------------------------
     2. MENÚ MÓVIL · aria-expanded sincronizado; se cierra con Escape,
        al elegir un enlace o al pasar a viewport de escritorio.
  ------------------------------------------------------------------------- */
  function mobileNav() {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-nav-toggle]');
    if (!header || !toggle) return;

    const setOpen = (open) => {
      header.classList.toggle('is-menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('is-menu-open'));
    });

    // Escape cierra y devuelve el foco al botón
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Elegir un destino cierra el menú
    header.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Si el viewport crece a escritorio, el estado abierto deja de tener sentido
    window.matchMedia('(min-width: 56rem)').addEventListener('change', (mq) => {
      if (mq.matches) setOpen(false);
    });
  }

  /* --------------------------------------------------------------------------
     2b. NAVEGACIÓN ACTIVA · Señala la sección que el usuario está leyendo.
  ------------------------------------------------------------------------- */
  function activeSectionNav() {
    const links = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
    const items = links
      .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
      .filter((item) => item.section);
    if (!items.length) return;

    let ticking = false;
    const update = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.38, 260);
      let current = null;
      items.forEach((item) => {
        if (item.section.offsetTop <= marker) current = item;
      });
      items.forEach((item) => {
        const active = current !== null && item === current;
        item.link.classList.toggle('is-active', active);
        if (active) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* --------------------------------------------------------------------------
     3. ANIMACIONES DE ENTRADA · Observa [data-reveal] y aplica .is-revealed
        una sola vez. Con movimiento reducido, revela todo de inmediato
        (el CSS ya muestra los estados finales, esto solo limpia clases).
  ------------------------------------------------------------------------- */
  function revealOnScroll() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    /** Elementos que todavía esperan su animación de entrada. */
    const pending = new Set(targets);

    const reveal = (el) => {
      el.classList.add('is-revealed');
      pending.delete(el);
    };

    // El margen superior enorme cuenta como «visible» todo lo que quede por
    // encima del viewport: si un enlace ancla salta media página, las
    // secciones sobrepasadas se revelan igual (nunca quedan en blanco).
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target); // animar una sola vez
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -2% 0px' });

    targets.forEach((el) => observer.observe(el));

    let throttled = false;

    const sweep = () => {
      const limit = window.innerHeight * 0.98;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          observer.unobserve(el);
        }
      });
      if (!pending.size) window.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
      if (throttled) return;
      throttled = true;
      window.setTimeout(() => {
        throttled = false;
        sweep();
      }, 80);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.setTimeout(sweep, 400);
    window.setTimeout(sweep, 1500);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && pending.size) sweep();
    });
  }

  /* --------------------------------------------------------------------------
     4. CONTADORES · Los [data-countup] cuentan de 0 al valor final la
        primera vez que entran en pantalla (900ms, ease-out).
        El HTML ya trae el número final: sin JS o con movimiento
        reducido no hay cambio alguno.
  ------------------------------------------------------------------------- */
  function countUp() {
    const counters = document.querySelectorAll('[data-countup]');
    if (!counters.length) return;
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const DURATION = 900;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const end = parseInt(el.dataset.countup, 10);
      if (!Number.isFinite(end)) return;

      let start = null;
      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / DURATION, 1);
        el.textContent = String(Math.round(end * easeOut(progress)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     5. CALENDARIO DE 28 DÍAS · Genera las celdas (día 1–28) con su fase
        semanal y dispara el llenado en onda al entrar en pantalla.
        La grilla es decorativa (aria-hidden en el HTML): la información
        real vive en las tarjetas de fase.
  ------------------------------------------------------------------------- */
  function planGrid() {
    const grid = document.querySelector('[data-plan-grid]');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    for (let day = 1; day <= 28; day += 1) {
      const cell = document.createElement('span');
      const phase = Math.ceil(day / 7);            // semana 1–4

      cell.className = `day day--p${phase}`;
      if (day === 28) cell.classList.add('day--final');
      cell.style.setProperty('--i', String(day)); // retraso de la onda (CSS)
      cell.textContent = String(day).padStart(2, '0');

      fragment.appendChild(cell);
    }

    grid.appendChild(fragment);

    // El llenado en onda arranca cuando la grilla es visible
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      grid.classList.add('is-visible');
      return;
    }

    // Misma red de seguridad que las animaciones de entrada: si el observer
    // pierde entregas, un chequeo en scroll evita que la grilla quede oculta.
    const show = () => {
      grid.classList.add('is-visible');
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) show();
      });
    }, { threshold: 0.3 });

    let throttled = false;

    const onScroll = () => {
      if (throttled) return;
      throttled = true;
      window.setTimeout(() => {
        throttled = false;
        if (grid.getBoundingClientRect().top < window.innerHeight) show();
      }, 120);
    };

    observer.observe(grid);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     6. ACORDEÓN DEL TEMARIO · Un módulo abierto a la vez. El estado vive
        en aria-expanded (fuente de verdad) y la clase .is-open anima el
        panel vía CSS. `inert` saca del orden de tabulación el contenido
        de los paneles cerrados.
  ------------------------------------------------------------------------- */
  function accordion() {
    const root = document.querySelector('[data-accordion]');
    if (!root) return;

    const modules = Array.from(root.querySelectorAll('.module'));

    const setState = (module, open) => {
      const trigger = module.querySelector('.module__trigger');
      const panel = module.querySelector('.module__panel');
      if (!trigger || !panel) return;

      module.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.inert = !open;
    };

    modules.forEach((module) => {
      const trigger = module.querySelector('.module__trigger');
      if (!trigger) return;

      // Estado inicial: respeta el aria-expanded escrito en el HTML
      setState(module, trigger.getAttribute('aria-expanded') === 'true');

      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

        // Cierra el resto para mantener la lectura enfocada en un módulo
        modules.forEach((other) => {
          if (other !== module) setState(other, false);
        });
        setState(module, willOpen);
      });
    });

    // Soporta tanto la carga inicial como enlaces elegidos después de cargar.
    const followHash = () => {
      const hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1));
      const linkedModule = hashTarget && hashTarget.closest('.module');
      if (linkedModule && root.contains(linkedModule)) {
        modules.forEach((other) => setState(other, other === linkedModule));
      }
    };
    followHash();
    window.addEventListener('hashchange', followHash);
  }

  /* --------------------------------------------------------------------------
     7. FORMULARIO DE INSCRIPCIÓN · Validación en línea: errores junto al
        campo, foco al primer error y estado anunciado por aria-live.
  ------------------------------------------------------------------------- */
  function enrollForm() {
    const form = document.querySelector('[data-form]');
    if (!form) return;

    const status = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('[data-form-submit]');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /** Muestra u oculta el error de un campo y sincroniza los atributos ARIA. */
    const setFieldError = (input, errorEl, show) => {
      input.closest('.form-field').classList.toggle('has-error', show);
      errorEl.hidden = !show;
      input.setAttribute('aria-invalid', String(show));
      if (show) {
        input.setAttribute('aria-describedby', errorEl.id);
      } else {
        input.removeAttribute('aria-describedby');
      }
    };

    const validators = [
      {
        input: form.querySelector('#campo-nombre'),
        error: form.querySelector('#error-nombre'),
        isValid: (value) => value.trim().length >= 2,
      },
      {
        input: form.querySelector('#campo-email'),
        error: form.querySelector('#error-email'),
        isValid: (value) => EMAIL_RE.test(value.trim()),
      },
    ].filter((v) => v.input && v.error);

    // Revalida al salir del campo y limpia el error al corregir
    validators.forEach(({ input, error, isValid }) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
          setFieldError(input, error, !isValid(input.value));
        }
      });
      input.addEventListener('input', () => {
        if (isValid(input.value)) setFieldError(input, error, false);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let firstInvalid = null;
      validators.forEach(({ input, error, isValid }) => {
        const valid = isValid(input.value);
        setFieldError(input, error, !valid);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const nombreVal = form.querySelector('#campo-nombre').value.trim();
      const emailVal = form.querySelector('#campo-email').value.trim();

      submitBtn.disabled = true;
      status.textContent = 'Abriendo WhatsApp para completar tu inscripción...';

      // Continúa en la misma pestaña para evitar bloqueos de ventanas emergentes.
      const waMsg = encodeURIComponent(
        `¡Hola UADEN Global! Quiero inscribirme en Empleabilidad 360°.\n` +
        `Nombre: ${nombreVal}\n` +
        `Correo: ${emailVal}\n` +
        `Deseo confirmar mi lugar y recibir más información.`
      );
      const waUrl = `https://wa.me/12232400531?text=${waMsg}`;
      window.location.assign(waUrl);
    });
  }

  /* --------------------------------------------------------------------------
     8. AÑO DEL PIE DE PÁGINA
  ------------------------------------------------------------------------- */
  function yearStamp() {
    const el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* Bandas decorativas: una entrada por sección, sin bucles permanentes. */
  function diagonalMotion() {
    const sections = document.querySelectorAll('main > section, .site-footer');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('has-entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });

    sections.forEach((section) => observer.observe(section));
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) observer.disconnect();
    });
  }

  /* --------------------------------------------------------------------------
     10. CARRUSEL · Testimonios y Casos de Éxito 360°
        Rota solo (7 s) siguiendo el patrón de carrusel del W3C:
        - se pausa con el puntero encima, con el foco dentro o con la
          pestaña oculta, y nunca arranca con movimiento reducido;
        - cualquier navegación manual (flechas, puntos, swipe, teclado)
          lo detiene: la persona tomó el control y puede reanudarlo
          con el botón pausa/reproducir;
        - mientras rota, aria-live queda en «off» para no interrumpir al
          lector de pantalla en cada cambio; al pausarse vuelve a «polite».
  ------------------------------------------------------------------------- */
  function initCarousel() {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');
    const toggleBtn = document.querySelector('[data-carousel-toggle]');
    const dots = Array.from(document.querySelectorAll('.carousel__dot'));
    if (!slides.length || !track) return;

    const AUTOPLAY_MS = 7000;
    let currentIndex = 0;
    let timer = null;
    let stopped = reducedMotion.matches;   // decisión de la persona o del sistema
    let hovered = false;
    let focused = false;

    const goTo = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === currentIndex);
        slide.inert = i !== currentIndex;
        slide.setAttribute('aria-hidden', String(i !== currentIndex));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
        dot.setAttribute('aria-pressed', String(i === currentIndex));
      });
    };

    /** Arranca o detiene el temporizador según el estado combinado. */
    const sync = () => {
      const shouldRun = !stopped && !hovered && !focused && !document.hidden;

      if (shouldRun && timer === null) {
        timer = window.setInterval(() => goTo(currentIndex + 1), AUTOPLAY_MS);
        track.setAttribute('aria-live', 'off');
      } else if (!shouldRun && timer !== null) {
        window.clearInterval(timer);
        timer = null;
        track.setAttribute('aria-live', 'polite');
      }

      if (toggleBtn) {
        toggleBtn.classList.toggle('is-paused', stopped);
        toggleBtn.setAttribute('aria-label', stopped
          ? 'Reanudar el avance automático'
          : 'Pausar el avance automático');
      }
    };

    /** Navegación iniciada por la persona: detiene el avance automático. */
    const manual = (index) => {
      stopped = true;
      goTo(index);
      sync();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => manual(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => manual(currentIndex + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => manual(i)));

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        stopped = !stopped;
        sync();
      });
    }

    // Flechas del teclado con el foco dentro del carrusel o sus controles
    carousel.closest('.showcase')?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') manual(currentIndex - 1);
      if (event.key === 'ArrowRight') manual(currentIndex + 1);
    });

    // Pausas de cortesía: lectura con el puntero o navegación con teclado
    carousel.addEventListener('mouseenter', () => { hovered = true; sync(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; sync(); });
    carousel.addEventListener('focusin', () => { focused = true; sync(); });
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) { focused = false; sync(); }
    });

    // Pestaña en segundo plano: no tiene sentido seguir rotando
    document.addEventListener('visibilitychange', sync);

    // Si el sistema pasa a movimiento reducido, el avance queda detenido
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) { stopped = true; sync(); }
    });

    // Soporte para gestos táctiles (swipe): también es navegación manual
    let touchStartX = 0;
    let touchStartY = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      const vertical = touchStartY - e.changedTouches[0].screenY;
      if (Math.abs(diff) > 60 && Math.abs(diff) > Math.abs(vertical) * 2) {
        manual(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });

    carousel.closest('.showcase')?.classList.add('showcase--ready');
    track.setAttribute('aria-atomic', 'true');
    goTo(0);
    sync();
  }

  /* --------------------------------------------------------------------------
     Arranque
  ------------------------------------------------------------------------- */
  headerScroll();
  mobileNav();
  activeSectionNav();
  revealOnScroll();
  countUp();
  planGrid();
  accordion();
  initModuleExplorer(document.querySelector('[data-module-explorer]'));
  enrollForm();
  yearStamp();
  diagonalMotion();
  initCarousel();
  // No se activa en el <head>: si falla un import o el arranque, el HTML sigue
  // mostrando los textos y el temario completo mediante su modo sin JavaScript.
  document.documentElement.classList.replace('no-js', 'js');
})();
