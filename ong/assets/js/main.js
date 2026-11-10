/**
 * UADEN GLOBAL - SEMINARIO INTERNACIONAL DE FUNDRAISING
 * Interactive Components & Animations Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initReasonsCarousel();
  initProgramTabs();
  initDiscountCalculator();
  initFaqAccordion();
  initCounters();
  initScrollReveal();
  initBrochureTracking();
});

/* ===================================================================
   1. NAVBAR & MOBILE MENU
   =================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const isOpen = navLinks?.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });

  // Close nav on click of link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
    });
  });
}

/* ===================================================================
   2. EVENT COUNTDOWN TIMER
   =================================================================== */
function initCountdown() {
  // Set target date to November 25, 2026 08:00:00 EST
  const targetDate = new Date('2026-11-25T08:00:00-05:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ===================================================================
   3. CAROUSEL: 15 RAZONES PARA PARTICIPAR
   =================================================================== */
function initReasonsCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayInterval = null;

  // Generate dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir a diapositiva ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function updateSlidePosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlidePosition();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 7000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  const container = document.querySelector('.carousel-container');
  container?.addEventListener('mouseenter', stopAutoplay);
  container?.addEventListener('mouseleave', startAutoplay);

  // Swipe support for touch
  let touchStartX = 0;
  let touchEndX = 0;

  container?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();
}

/* ===================================================================
   4. ACADEMIC PROGRAM TABS (MATUTINO / VESPERTINO)
   =================================================================== */
function initProgramTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. GROUP DISCOUNT & INVESTMENT CALCULATOR
   =================================================================== */
function initDiscountCalculator() {
  const qtyBtns = document.querySelectorAll('.calc-qty-btn');
  const priceDisplay = document.getElementById('calc-total-price');
  const pricePerPerson = document.getElementById('calc-per-person');
  const savingsDisplay = document.getElementById('calc-savings-badge');
  const quoteCtaBtn = document.getElementById('calc-quote-btn');

  if (!priceDisplay) return;

  // Base price per participant in Early Bird
  const BASE_PRICE = 149;
  const REGULAR_PRICE = 189;

  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      qtyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const qty = parseInt(btn.dataset.qty, 10);
      calculate(qty);
    });
  });

  function calculate(qty) {
    let discountPct = 0;
    if (qty === 2) discountPct = 0.10;
    else if (qty === 3) discountPct = 0.20;
    else if (qty >= 4) discountPct = 0.30;

    const unitPrice = BASE_PRICE * (1 - discountPct);
    const totalPrice = unitPrice * qty;
    const regularTotal = REGULAR_PRICE * qty;
    const totalSavings = regularTotal - totalPrice;

    priceDisplay.textContent = `$${Math.round(totalPrice)} USD`;
    if (pricePerPerson) {
      pricePerPerson.textContent = qty > 1 
        ? `($${unitPrice.toFixed(1)} USD por asistente | -${discountPct * 100}% Descuento)`
        : `Tarifa Early Bird Individual (Ahorro $40 USD vs tarifa regular)`;
    }

    if (savingsDisplay) {
      savingsDisplay.textContent = `Ahorro Total para su ONG: $${Math.round(totalSavings)} USD`;
    }

    if (quoteCtaBtn) {
      quoteCtaBtn.href = `https://wa.me/12232400531?text=Hola,%20deseo%20inscribir%20a%20un%20grupo%20de%20${qty}%20personas%20en%20el%20Seminario%20Internacional%20de%20Fundraising%20de%20UADEN`;
    }
  }

  // Initial calculation
  calculate(1);
}

/* ===================================================================
   6. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
      }
    });
  });
}

/* ===================================================================
   7. ANIMATED METRICS COUNTERS
   =================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target, 10);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        let count = 0;
        const duration = 2000;
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            counter.innerHTML = `${prefix}${target.toLocaleString()}<span class="accent">${suffix}</span>`;
            clearInterval(timer);
          } else {
            counter.innerHTML = `${prefix}${Math.floor(count).toLocaleString()}<span class="accent">${suffix}</span>`;
          }
        }, stepTime);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ===================================================================
   8. SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ===================================================================
   9. BROCHURE DOWNLOAD TRACKING & TOAST NOTIFICATION
   =================================================================== */
function initBrochureTracking() {
  const downloadButtons = document.querySelectorAll('.btn-download, a[download]');

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Descargando el Folleto Oficial del Seminario (PDF)...');
    });
  });

  function showToast(message) {
    let toast = document.querySelector('.custom-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'custom-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #0a2240;
        color: #ffffff;
        padding: 14px 28px;
        border-radius: 50px;
        border: 1px solid #00a8ce;
        font-family: var(--font-heading);
        font-size: 0.95rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 10000;
        transition: transform 0.4s ease, opacity 0.4s ease;
        opacity: 0;
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="bi bi-file-earmark-pdf-fill" style="color: #38c8ea; font-size: 1.2rem;"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 4000);
  }
}
