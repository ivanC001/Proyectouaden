/**
 * JORNADAS INTERNACIONALES: GESTIÓN PÚBLICA DE CRISIS, EMERGENCIAS Y CATÁSTROFES
 * UADEN GLOBAL - MAIN INTERACTIVE SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNavigation();
  initFaqAccordion();
  initLeadForm();
  initBackToTop();
  initModulesCarousel();
});

/**
 * 1. COUNTDOWN TIMER
 * Target: Nov 2, 2026, 18:00:00 (Houston Time / Central Time UTC-5)
 */
function initCountdown() {
  const targetDate = new Date('2026-11-02T18:00:00-05:00').getTime();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 2. NAVIGATION & MOBILE DRAWER
 */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section spy with mapped sections
  const sectionMap = {
    'inicio': '#inicio',
    'doble-titulacion': '#doble-titulacion',
    'por-que': '#pilares',
    'pilares': '#pilares',
    'ejes': '#pilares',
    'manual': '#pilares',
    'coordinadores': '#coordinadores',
    'metodologia': '#coordinadores',
    'audiencia': '#coordinadores',
    'inversion': '#inversion',
    'institucion': '#inversion',
    'faq': '#inversion',
    'contacto': '#contacto'
  };

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 220;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        const targetHref = sectionMap[id] || `#${id}`;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === targetHref) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/**
 * 3. FAQ ACCORDION
 */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const questionBtn = card.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      // Close all others
      faqCards.forEach(c => {
        c.classList.remove('active');
        const btn = c.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        card.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 4. LEAD FORM WITH WHATSAPP INTEGRATION
 */
function initLeadForm() {
  const form = document.getElementById('leadForm');
  const successBox = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const orgInput = document.getElementById('form-org');
    const participantsInput = document.getElementById('form-participants');
    const messageInput = document.getElementById('form-message');

    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, true);
      isValid = false;
    } else {
      setFieldError(emailInput, false);
    }

    // Validate phone
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
      setFieldError(phoneInput, true);
      isValid = false;
    } else {
      setFieldError(phoneInput, false);
    }

    if (!isValid) return;

    // Simulate submission and construct WhatsApp message
    const name = encodeURIComponent(nameInput.value.trim());
    const email = encodeURIComponent(emailInput.value.trim());
    const phone = encodeURIComponent(phoneInput.value.trim());
    const org = encodeURIComponent(orgInput.value.trim() || 'No especificada');
    const part = encodeURIComponent(participantsInput.value);
    const msg = encodeURIComponent(messageInput.value.trim() || 'Sin comentarios adicionales');

    const whatsappUrl = `https://wa.me/12232400531?text=Hola%20UADEN%20Global,%20deseo%20inscribirme%20en%20las%20Jornadas%20de%20Gesti%C3%B3n%20P%C3%BAblica%20de%20Crisis%20(2da%20Edici%C3%B3n%20-%20Promoci%C3%B3n%20Doble%20Titulaci%C3%B3n).%0A%0A*Nombre:*%20${name}%0A*Email:*%20${email}%0A*Tel:*%20${phone}%0A*Instituci%C3%B3n:*%20${org}%0A*Participantes:*%20${part}%0A*Mensaje:*%20${msg}`;

    // Hide form, show success
    form.style.display = 'none';
    if (successBox) {
      successBox.classList.add('show');
    }

    // Optionally redirect or open WhatsApp after small delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1200);
  });

  function setFieldError(input, hasError) {
    const parent = input.closest('.form-group');
    if (!parent) return;
    if (hasError) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
  }
}

/**
 * 5. BACK TO TOP
 */
function initBackToTop() {
  const topBtn = document.getElementById('backToTop');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 6. INTERACTIVE MODULES CAROUSEL
 */
function initModulesCarousel() {
  const carousel = document.getElementById('modulesCarousel');
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const counter = document.getElementById('carouselCounter');
  const progressBar = document.getElementById('carouselProgress');
  const dotsContainer = document.getElementById('carouselDots');

  if (!carousel || !track) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot-indicator')) : [];
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  const slideDuration = 6000; // 6 seconds per slide
  let startTime = null;
  let animFrameId = null;
  let isPaused = false;

  function updateSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;

    // Slide track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Active state on slides
    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Active state on dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update counter
    if (counter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(totalSlides).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    // Reset progress animation
    resetProgress();
  }

  function resetProgress() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    startTime = performance.now();
    startProgressLoop();
  }

  function startProgressLoop() {
    if (isPaused) return;

    function step(timestamp) {
      if (isPaused) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / slideDuration, 1);

      if (progressBar) {
        progressBar.style.width = `${progressRatio * 100}%`;
      }

      if (elapsed >= slideDuration) {
        updateSlide(currentIndex + 1);
      } else {
        animFrameId = requestAnimationFrame(step);
      }
    }

    animFrameId = requestAnimationFrame(step);
  }

  function pause() {
    isPaused = true;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function resume() {
    if (!isPaused) return;
    isPaused = false;
    let currentPct = 0;
    if (progressBar) {
      currentPct = parseFloat(progressBar.style.width) || 0;
    }
    startTime = performance.now() - (slideDuration * (currentPct / 100));
    startProgressLoop();
  }

  // Next / Prev listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
    });
  }

  // Dots listeners
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        updateSlide(targetIndex);
      }
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', resume);

  // Keyboard navigation when within carousel
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      updateSlide(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      updateSlide(currentIndex - 1);
    }
  });

  // Touch Swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pause();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateSlide(currentIndex + 1);
      } else {
        updateSlide(currentIndex - 1);
      }
    }
    resume();
  }, { passive: true });

  // Initialize first slide and progress
  updateSlide(0);
}

