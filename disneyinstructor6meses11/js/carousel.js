/* ==========================================================================
   CARRUSELES Y VISUALIZADORES INTERACTIVOS (CASOS & 15 RAZONES)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Inicializador Modular de Carruseles Avanzados
   */
  function setupAdvancedCarousel({ trackId, prevBtnId, nextBtnId, dotsId, cardSelector, autoplayDelay = 4500 }) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    let isHovered = false;

    const cards = track.querySelectorAll(cardSelector);
    const totalCards = cards.length;
    if (totalCards === 0) return;

    function getVisibleCards() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCards();
      return Math.max(0, totalCards - visible);
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      const numDots = maxIndex + 1;

      for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function updateCarousel() {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const firstCard = cards[0];
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 24; // 1.5rem
      const offset = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      }

      if (nextBtn) {
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.35' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
      }

      updateDots();
    }

    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // Bucle continuo suave
      }
      updateCarousel();
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = getMaxIndex();
      }
      updateCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    // Auto-Play inteligente con pausa al pasar el cursor
    function startAutoplay() {
      if (!autoplayDelay) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isHovered) {
          nextSlide();
        }
      }, autoplayDelay);
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

    const wrapper = track.parentElement;
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      wrapper.addEventListener('mouseleave', () => {
        isHovered = false;
      });
    }

    // Soporte táctil / swipe en pantallas móviles
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      isHovered = true;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      isHovered = false;
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        resetAutoplay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        resetAutoplay();
      }
    }, { passive: true });

    // Responsive resize
    window.addEventListener('resize', () => {
      renderDots();
      updateCarousel();
    });

    renderDots();
    updateCarousel();
    startAutoplay();
  }

  // 1. Inicializar Carrusel de Casos de Estudio (8 Casos de Clase Mundial)
  setupAdvancedCarousel({
    trackId: 'casesTrack',
    prevBtnId: 'casePrevBtn',
    nextBtnId: 'caseNextBtn',
    dotsId: 'casesDots',
    cardSelector: '.case-card',
    autoplayDelay: 5000
  });

  // 2. Inicializar Carrusel de 15 Razones de Valor Diferencial
  setupAdvancedCarousel({
    trackId: 'reasonsTrack',
    prevBtnId: 'reasonsPrevBtn',
    nextBtnId: 'reasonsNextBtn',
    dotsId: 'reasonsDots',
    cardSelector: '.reason-card',
    autoplayDelay: 4200
  });

  // 3. Tabs del Toolkit Profesional (115+ Horas de Contenido)
  const tabBtns = document.querySelectorAll('.toolkit-tab-btn');
  const tabPanes = document.querySelectorAll('.toolkit-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

});