/* ==========================================================================
   MAIN JAVASCRIPT - INTERACTIVIDAD, CUENTA REGRESIVA Y FAQ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cuenta Regresiva al 11 de Noviembre 2026 (Promoción Pronto Pago e Inicio Oficial)
  function initCountdown() {
    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (!daysEl) return;

    // Fecha límite: 11 de Noviembre 2026
    let targetDate = new Date('2026-11-11T23:59:59');
    if (isNaN(targetDate.getTime()) || targetDate.getTime() < new Date().getTime()) {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 35);
      targetDate.setHours(23, 59, 59);
    }

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // 2. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 5. FAQ Accordion & Live Filter Search
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faqSearch');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 6. Lead Capture Modal
  const modal = document.getElementById('leadModal');
  const modalOpenBtns = document.querySelectorAll('.open-lead-modal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const leadForm = document.getElementById('leadForm');

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando solicitud...';

      setTimeout(() => {
        leadForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 64px; height: 64px; background: rgba(0, 180, 216, 0.2); border: 1px solid #48cae4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; color: #90e0ef;">
              <i class="bi bi-check-lg"></i>
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem; color: #fff;">¡Solicitud de Admisión Recibida!</h3>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
              Un asesor académico sénior de UADEN Global se comunicará contigo en menos de 24 horas para guiarte en el proceso de matrícula y validar tu beneficio de Pronto Pago.
            </p>
            <a href="https://api.whatsapp.com/send?phone=12232400531&text=Hola,%20acabo%20de%20solicitar%20admisión%20a%20la%20Certificación%20de%20Instructores%20Disney%20de%20UADEN%20Global." target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="bi bi-whatsapp"></i> Chatear de inmediato con Asesor
            </a>
          </div>
        `;
      }, 1200);
    });
  }

  // 7. Animated Number Counters (Stats Bar)
  const counterElements = document.querySelectorAll('.stat-number[data-counter]');
  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * target);

        const formattedNumber = currentVal >= 1000 
          ? currentVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : currentVal;

        el.textContent = `${prefix}${formattedNumber}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          const finalFormatted = target >= 1000 
            ? target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : target;
          el.textContent = `${prefix}${finalFormatted}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(el => animateCounter(el));
    }
  }
});