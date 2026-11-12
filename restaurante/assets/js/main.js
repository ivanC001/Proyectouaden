/**
 * UADEN GLOBAL - Landing "Cómo Organizar y Dirigir un Restaurant"
 * Interactive Logic: Calculator, Tabs, Timer, Modal, FAQ, WhatsApp Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. STICKY NAVBAR & MOBILE MENU
  // -------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    const setPanel = (open) => {
      navLinks.classList.toggle('mobile-open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute(
        'aria-label',
        open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list', !open);
        icon.classList.toggle('bi-x-lg', open);
      }
    };

    mobileToggle.addEventListener('click', () => {
      setPanel(!navLinks.classList.contains('mobile-open'));
    });

    // Cerrar al elegir un destino
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setPanel(false));
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
        setPanel(false);
        mobileToggle.focus();
      }
    });

    // Cerrar al tocar fuera de la barra
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('mobile-open') &&
        !navbar.contains(e.target)
      ) {
        setPanel(false);
      }
    });

    // Si la pantalla se ensancha hasta mostrar la barra completa, el panel sobra
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navLinks.classList.contains('mobile-open')) {
        setPanel(false);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 1B. SECCIÓN ACTIVA EN EL ÍNDICE (SCROLL SPY)
  // -------------------------------------------------------------------------
  const spyTargets = [...document.querySelectorAll('.nav-link')]
    .map((link) => ({ link, section: link.hash && document.querySelector(link.hash) }))
    .filter((t) => t.section);

  if (spyTargets.length) {
    const markActive = (winner) => {
      spyTargets.forEach(({ link }) => {
        const on = link === winner;
        link.classList.toggle('active', on);
        if (on) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const updateSpy = () => {
      // La sección activa es la última cuyo borde superior ya cruzó
      // el 40% de la pantalla contando desde arriba.
      const line = window.scrollY + window.innerHeight * 0.4;
      let winner = null;
      spyTargets.forEach(({ link, section }) => {
        if (section.offsetTop <= line) winner = link;
      });

      // Al final de la página gana la última sección, aunque sea corta
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) winner = spyTargets[spyTargets.length - 1].link;

      markActive(winner);
    };

    // Throttle por tiempo: no depende del planificador de frames, que las
    // pestañas en segundo plano suspenden.
    let last = 0;
    let trailing;
    const onScroll = () => {
      const now = Date.now();
      if (now - last >= 100) {
        last = now;
        updateSpy();
      } else {
        clearTimeout(trailing);
        trailing = setTimeout(() => {
          last = Date.now();
          updateSpy();
        }, 100);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateSpy();
  }

  // -------------------------------------------------------------------------
  // 2. CURRICULUM TABS (BLOQUE 1 & BLOQUE 2)
  // -------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.curriculum-tab-btn');
  const tabPanels = document.querySelectorAll('.curriculum-content-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // El panel que acaba de abrirse contiene un carrusel que hasta ahora
      // medía cero: hay que dejar que se vuelva a medir.
      document.dispatchEvent(new CustomEvent('ui:layoutchange'));

      // aria-selected acompaña al estado visual
      tabBtns.forEach((b) => {
        b.setAttribute('aria-selected', String(b.classList.contains('active')));
      });
    });
  });

  // -------------------------------------------------------------------------
  // 3. INTERACTIVE GROUP DISCOUNT CALCULATOR
  // -------------------------------------------------------------------------
  const participantsInput = document.getElementById('calcParticipants');
  const btnMinus = document.getElementById('calcBtnMinus');
  const btnPlus = document.getElementById('calcBtnPlus');
  const calcTotalUSD = document.getElementById('calcTotalUSD');
  const calcDiscountBadge = document.getElementById('calcDiscountBadge');
  const calcSavingsText = document.getElementById('calcSavingsText');
  const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

  const BASE_PRICE = 149; // Early Bird base price

  function updateCalculator() {
    let count = parseInt(participantsInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 50) count = 50;
    participantsInput.value = count;

    let discountPercent = 0;
    if (count === 2) {
      discountPercent = 10;
    } else if (count === 3) {
      discountPercent = 20;
    } else if (count >= 4) {
      discountPercent = 30;
    }

    const pricePerPerson = BASE_PRICE * (1 - discountPercent / 100);
    const total = count * pricePerPerson;
    const regularTotal = count * BASE_PRICE;
    const totalSavings = regularTotal - total;

    calcTotalUSD.textContent = `$${Math.round(total)} USD`;

    if (discountPercent > 0) {
      calcDiscountBadge.textContent = `${discountPercent}% DE DESCUENTO GRUPAL`;
      calcDiscountBadge.style.display = 'inline-block';
      calcSavingsText.textContent = `Ahorro de $${Math.round(totalSavings)} USD ($${pricePerPerson.toFixed(1)} USD por asistente)`;
    } else {
      calcDiscountBadge.textContent = 'TARIFA INDIVIDUAL EARLY BIRD';
      calcDiscountBadge.style.display = 'inline-block';
      calcSavingsText.textContent = `Tarifa regular anticipada de $${BASE_PRICE} USD`;
    }

    // Update WhatsApp link with prefilled dynamic message
    const phone = '12232400531';
    const message = encodeURIComponent(
      `Hola UADEN Global, deseo inscribirme en el Seminario "Cómo Organizar y Dirigir un Restaurant". Somos un grupo de ${count} participante(s). Total con descuento: $${Math.round(total)} USD. Por favor indíquenme los pasos para formalizar el registro y medios de pago.`
    );
    calcWhatsappBtn.href = `https://wa.me/${phone}?text=${message}`;
  }

  if (participantsInput && btnMinus && btnPlus) {
    btnMinus.addEventListener('click', () => {
      let count = parseInt(participantsInput.value, 10);
      if (count > 1) {
        participantsInput.value = count - 1;
        updateCalculator();
      }
    });

    btnPlus.addEventListener('click', () => {
      let count = parseInt(participantsInput.value, 10);
      participantsInput.value = count + 1;
      updateCalculator();
    });

    participantsInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // -------------------------------------------------------------------------
  // 4. COUNTDOWN TIMER (EVENT & EARLY BIRD DEADLINE)
  // -------------------------------------------------------------------------
  // Seminar date: December 7, 2026 08:00:00 EST
  const targetDate = new Date('2026-12-07T08:00:00-05:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMinutes');
    const secsEl = document.getElementById('timerSeconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // -------------------------------------------------------------------------
  // 5. FAQ ACCORDION
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach((i) => i.classList.remove('active'));

        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 6. REGISTRATION MODAL
  // -------------------------------------------------------------------------
  const modalOverlay = document.getElementById('registrationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const registrationForm = document.getElementById('modalRegistrationForm');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = trigger.getAttribute('data-plan') || 'General';
      const planInput = document.getElementById('modalFormPlan');
      if (planInput) {
        planInput.value = planName;
      }
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Form submission handling -> Redirect to WhatsApp with full details
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const business = document.getElementById('formBusiness').value.trim();
      const plan = document.getElementById('modalFormPlan').value;
      const count = document.getElementById('formAttendees').value;

      const message = encodeURIComponent(
        `*SOLICITUD DE INSCRIPCIÓN - UADEN GLOBAL*\n\n` +
        `*Programa:* Cómo Organizar y Dirigir un Restaurant\n` +
        `*Nombre:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*WhatsApp:* ${phone}\n` +
        `*Restaurante / Empresa:* ${business}\n` +
        `*Plan Seleccionado:* ${plan}\n` +
        `*Número de Asistentes:* ${count}\n\n` +
        `Solicito información de cupo disponible y modalidades de pago habilitadas para mi país.`
      );

      const targetUrl = `https://wa.me/12232400531?text=${message}`;
      window.open(targetUrl, '_blank');
      closeModal();
    });
  }
});

/* ==========================================================================
   INTERACCIONES: revelado, carruseles, contadores y barra fija de reserva
   Todo degrada bien: si algo falla, el contenido queda visible y utilizable.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // REVELADO AL ENTRAR
  // Solo escondemos el contenido tras confirmar que hay con qué mostrarlo,
  // y aun así dejamos un plazo de seguridad que lo revela todo.
  // -------------------------------------------------------------------------
  const revealables = [...document.querySelectorAll('[data-reveal]')];

  if (revealables.length && !reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');

    const showAll = () => revealables.forEach((el) => el.classList.add('is-in'));

    // Red de seguridad: si el observador no responde, nada se queda oculto.
    const failsafe = setTimeout(showAll, 2500);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        clearTimeout(failsafe);
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const group = entry.target.parentElement;
          const peers = group
            ? [...group.children].filter((n) => n.hasAttribute('data-reveal'))
            : [];
          const index = peers.indexOf(entry.target);
          entry.target.style.setProperty(
            '--reveal-delay',
            (index > 0 ? Math.min(index, 5) * 70 : 0) + 'ms'
          );
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    revealables.forEach((el) => revealObserver.observe(el));

    // Lo que ya está en pantalla al cargar se muestra sin esperar scroll.
    requestAnimationFrame(() => {
      revealables.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // CARRUSELES
  // El desplazamiento es nativo con anclaje: dedo, rueda y teclado funcionan
  // sin JavaScript. Los botones y los puntos solo lo empujan.
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsBox = carousel.querySelector('.carousel-dots');
    if (!track) return;

    const slides = [...track.children];
    const pageCount = () => {
      const perPage = Math.max(1, Math.round(track.clientWidth / slideStep()));
      return Math.max(1, Math.ceil(slides.length / perPage));
    };
    const slideStep = () => {
      if (slides.length < 2) return track.clientWidth || 1;
      const a = slides[0].getBoundingClientRect().left;
      const b = slides[1].getBoundingClientRect().left;
      return Math.max(1, b - a);
    };

    // Puntos: uno por página visible. Si hay demasiadas páginas (una tarjeta
    // por pantalla en el móvil), los puntos se vuelven ruido: en su lugar se
    // muestra la posición en texto.
    const MAX_DOTS = 7;
    let dots = [];
    let counter = null;
    let builtFor = -1;

    const buildDots = () => {
      // Un carril dentro de un panel cerrado mide cero: cualquier cálculo
      // daría basura, así que conservamos los puntos que ya había.
      if (!dotsBox || !track.clientWidth) return;
      const total = pageCount();
      if (builtFor === total) return;
      builtFor = total;
      dotsBox.textContent = '';
      dots = [];
      counter = null;

      if (total > MAX_DOTS) {
        counter = document.createElement('p');
        counter.className = 'carousel-count';
        counter.setAttribute('aria-live', 'polite');
        dotsBox.appendChild(counter);
        return;
      }

      dots = Array.from({ length: total }, (_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Ir al grupo ' + (i + 1) + ' de ' + total);
        dot.addEventListener('click', () => {
          track.scrollTo({
            left: i * track.clientWidth,
            behavior: reduced ? 'auto' : 'smooth'
          });
        });
        dotsBox.appendChild(dot);
        return dot;
      });
    };

    const sync = () => {
      if (!track.clientWidth) return;
      const max = track.scrollWidth - track.clientWidth;
      // El carril tiene unos píxeles de aire lateral para que no se recorte la
      // sombra, así que en reposo no queda exactamente en cero.
      const EDGE = 8;
      if (prev) prev.disabled = track.scrollLeft <= EDGE;
      if (next) next.disabled = track.scrollLeft >= max - EDGE;

      const steps = (dots.length || builtFor) - 1;
      const page = max <= 0 || steps <= 0
        ? 0
        : Math.round((track.scrollLeft / max) * steps);

      if (dots.length) {
        dots.forEach((dot, i) => {
          if (i === page) {
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.removeAttribute('aria-current');
          }
        });
      }

      if (counter) {
        counter.textContent = (page + 1) + ' / ' + builtFor;
      }
    };

    const page = (dir) => {
      track.scrollBy({
        left: dir * Math.max(slideStep(), track.clientWidth - slideStep() * 0.15),
        behavior: reduced ? 'auto' : 'smooth'
      });
    };

    if (prev) prev.addEventListener('click', () => page(-1));
    if (next) next.addEventListener('click', () => page(1));

    // Flechas del teclado cuando el carril tiene el foco
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); page(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1); }
    });

    let scrollTick;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTick);
      scrollTick = setTimeout(sync, 60);
    }, { passive: true });

    const refresh = () => { buildDots(); sync(); };
    window.addEventListener('resize', refresh);
    document.addEventListener('ui:layoutchange', refresh);

    // El carril del segundo bloque nace dentro de un panel oculto: mide 0 de
    // ancho y los puntos saldrían mal. Al hacerse visible se vuelve a medir.
    if ('ResizeObserver' in window) {
      let lastWidth = -1;
      new ResizeObserver(() => {
        if (track.clientWidth !== lastWidth) {
          lastWidth = track.clientWidth;
          refresh();
        }
      }).observe(track);
    }

    refresh();
  });

  // -------------------------------------------------------------------------
  // CONTADORES
  // El número final ya está en el HTML: la animación solo lo recorre.
  // -------------------------------------------------------------------------
  const counters = [...document.querySelectorAll('[data-count-to]')];

  if (counters.length) {
    const run = (el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target = Number(el.dataset.countTo);
      const prefix = el.dataset.countPrefix || '';
      if (!Number.isFinite(target)) return;
      if (reduced) {
        el.textContent = prefix + target.toLocaleString('es-ES');
        return;
      }
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('es-ES');
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const countObserver = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) run(e.target); }),
        { threshold: 0.4 }
      );
      counters.forEach((el) => countObserver.observe(el));
      // Si el observador no responde, el número aparece igual.
      setTimeout(() => counters.forEach(run), 3000);
    } else {
      counters.forEach(run);
    }
  }

  // -------------------------------------------------------------------------
  // BARRA FIJA DE RESERVA (MÓVIL)
  // -------------------------------------------------------------------------
  const stickyCta = document.querySelector('.sticky-cta');
  const hero = document.getElementById('hero');

  if (stickyCta && hero) {
    const footer = document.querySelector('.site-footer');

    const apply = () => {
      const pastHero = window.scrollY > hero.offsetHeight * 0.75;
      const atFooter = footer
        ? window.scrollY + window.innerHeight > footer.offsetTop + 120
        : false;
      stickyCta.classList.toggle('is-up', pastHero && !atFooter);
    };

    // Throttle con llamada final: sin ella, el último evento de una ráfaga se
    // perdía y la barra quedaba en el estado anterior.
    let last = 0;
    let trailing;
    const update = () => {
      const now = Date.now();
      clearTimeout(trailing);
      if (now - last >= 80) {
        last = now;
        apply();
      } else {
        trailing = setTimeout(() => { last = Date.now(); apply(); }, 80);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    apply();
  }
});

// Una sola secuencia de iconos al entrar en pantalla; sin bucles ni contenido oculto.
document.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const strip = document.querySelector('.restaurant-reference .hero-value-strip');
  if (!strip) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    strip.querySelectorAll('.benefit-icon').forEach((icon, index) => {
      icon.animate([
        { clipPath: 'inset(0 100% 0 0 round 16px)', transform: 'rotate(-8deg)' },
        { clipPath: 'inset(0 0 0 0 round 16px)', transform: 'rotate(0)' }
      ], { duration: 550, delay: index * 85, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
    observer.disconnect();
  }, { threshold: 0.25 });
  observer.observe(strip);
});
