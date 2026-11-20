(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
      navigation.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120) closeMenu();
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollProgress = document.querySelector('[data-scroll-progress]');
  let scrollFrame = 0;

  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
    scrollFrame = 0;
  };

  if (scrollProgress) {
    updateScrollProgress();
    window.addEventListener('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    }, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
  }

  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  revealItems.forEach((item, index) => item.style.setProperty('--i', index % 4));

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  const carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const toggleButton = carousel.querySelector('[data-carousel-toggle]');
    const toggleIcon = toggleButton?.querySelector('i');
    const currentLabel = carousel.querySelector('[data-carousel-current]');
    const status = carousel.querySelector('[data-carousel-status]');
    let currentSlide = 0;
    let autoplayTimer = 0;
    let userPaused = false;
    let carouselVisible = true;
    let touchStartX = 0;

    const stopAutoplay = () => {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
    };

    const scheduleAutoplay = () => {
      stopAutoplay();
      if (reducedMotion || userPaused || !carouselVisible || document.hidden || slides.length < 2) return;
      autoplayTimer = window.setTimeout(() => {
        showSlide(currentSlide + 1, false);
      }, 6500);
    };

    const showSlide = (requestedIndex, announce = true) => {
      if (!slides.length) return;
      currentSlide = (requestedIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const active = index === currentSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      if (currentLabel) currentLabel.textContent = String(currentSlide + 1).padStart(2, '0');
      if (announce && status) status.textContent = `Imagen ${currentSlide + 1} de ${slides.length}`;
      scheduleAutoplay();
    };

    const syncPauseControl = () => {
      if (!toggleButton || !toggleIcon) return;
      toggleButton.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
      toggleIcon.className = userPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill';
    };

    previousButton?.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));
    toggleButton?.addEventListener('click', () => {
      userPaused = !userPaused;
      syncPauseControl();
      if (userPaused) stopAutoplay();
      else scheduleAutoplay();
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', scheduleAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) scheduleAutoplay();
    });
    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0]?.clientX || 0;
      stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', (event) => {
      const distance = (event.changedTouches[0]?.clientX || 0) - touchStartX;
      if (Math.abs(distance) > 48) showSlide(currentSlide + (distance < 0 ? 1 : -1));
      else scheduleAutoplay();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const carouselObserver = new IntersectionObserver(([entry]) => {
        carouselVisible = entry.isIntersecting;
        if (carouselVisible) scheduleAutoplay();
        else stopAutoplay();
      }, { threshold: 0.15 });
      carouselObserver.observe(carousel);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else scheduleAutoplay();
    });

    syncPauseControl();
    scheduleAutoplay();
  }

  const modules = [...document.querySelectorAll('.module')];
  const moduleImage = document.querySelector('#module-image');
  const moduleCaption = document.querySelector('#module-caption');

  const showModuleImage = (module, index) => {
    if (!moduleImage || !moduleCaption) return;
    const source = module.dataset.image;
    const alt = module.dataset.alt;
    const title = module.querySelector('summary')?.textContent.trim().replace(/^\d+\s*/, '') || '';

    const commit = () => {
      moduleImage.src = source;
      moduleImage.alt = alt;
      moduleCaption.textContent = `Módulo ${index + 1}: ${title}.`;
      const revealImage = () => moduleImage.classList.remove('is-switching');
      moduleImage.addEventListener('load', revealImage, { once: true });
      moduleImage.addEventListener('error', revealImage, { once: true });
      window.setTimeout(revealImage, 900);
    };

    if (reducedMotion) {
      commit();
      moduleImage.classList.remove('is-switching');
      return;
    }

    moduleImage.classList.add('is-switching');
    window.setTimeout(commit, 120);
  };

  modules.forEach((module, index) => {
    module.addEventListener('toggle', () => {
      if (!module.open) return;
      modules.forEach((other) => {
        if (other !== module) other.open = false;
      });
      showModuleImage(module, index);
    });
  });

  const countdown = document.querySelector('[data-countdown]');

  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const days = countdown.querySelector('[data-days]');
    const hours = countdown.querySelector('[data-hours]');
    const minutes = countdown.querySelector('[data-minutes]');

    const updateCountdown = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        countdown.textContent = 'La tarifa early bird ha finalizado. Consulta la disponibilidad actual.';
        return false;
      }

      const totalMinutes = Math.floor(distance / 60000);
      days.textContent = String(Math.floor(totalMinutes / 1440)).padStart(2, '0');
      hours.textContent = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, '0');
      minutes.textContent = String(totalMinutes % 60).padStart(2, '0');
      return true;
    };

    updateCountdown();
    const countdownTimer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(countdownTimer);
    }, 60000);
  }

  const trackedSections = [...document.querySelectorAll('main section[id]')];
  const trackedLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

  if ('IntersectionObserver' in window && trackedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      trackedLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.2, 0.6] });

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }
})();
