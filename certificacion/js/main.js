/* ==========================================================================
   MUNICIPAL PRO™ - Interactive Logic & UI Controller (Enhanced Edition)
   Carousels, Social Proof Toasts, Tabs, Modal & Countdown Timer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navMore = document.getElementById('navMore');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Cerrar navegación' : 'Abrir navegación');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x-lg');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir navegación');
        if (navMore) navMore.open = false;
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('bi-list');
          icon.classList.remove('bi-x-lg');
        }
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir navegación');
        if (navMore) navMore.open = false;
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('bi-list');
          icon.classList.remove('bi-x-lg');
        }
        mobileToggle.focus();
      }
    });
  }

  // Countdown Timer
  function initCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 18);
    targetDate.setHours(23, 59, 59);

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minsEl = document.getElementById('mins');
      const secsEl = document.getElementById('secs');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  initCountdown();

  // Interactive Carousel Controller
  function initCarousels() {
    const track = document.getElementById('expertTrack');
    const prevBtn = document.getElementById('prevExpert');
    const nextBtn = document.getElementById('nextExpert');
    const dotsContainer = document.getElementById('expertDots');

    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;

    // Create pagination dots dynamically
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 24; // 1.5rem gap
      const amountToMove = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${amountToMove}px)`;

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      const maxIndex = slides.length - (window.innerWidth < 768 ? 1 : 3);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIndex = slides.length - (window.innerWidth < 768 ? 1 : 3);
        if (currentIndex < maxIndex) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateCarousel();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          const maxIndex = slides.length - (window.innerWidth < 768 ? 1 : 3);
          currentIndex = maxIndex;
        }
        updateCarousel();
      });
    }

    // Auto-slide every 5 seconds
    let interval = setInterval(() => {
      if (nextBtn) nextBtn.click();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(interval));
    track.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        if (nextBtn) nextBtn.click();
      }, 5000);
    });
  }

  initCarousels();

  // Social Proof Toast Notification Popup
  function initSocialProof() {
    const toast = document.getElementById('socialProofToast');
    const toastText = document.getElementById('toastMessage');
    if (!toast || !toastText) return;

    const registrations = [
         "<strong>Lic. Roberto M.</strong> de México acaba de reservar su cupo.",
          "<strong>Dra. Sofía G.</strong> de Argentina se unió a MUNICIPAL PRO™.",
          "<strong>Ing. Carlos T.</strong> de Colombia completó su pre-inscripción.",
          "<strong>Dra. Elena V.</strong> de Chile confirmó su asistencia al Campus Live.",
          "<strong>Dr. Fernando P.</strong> de Perú reservó su plaza profesional.",
          "<strong>Lic. Mariana R.</strong> de Ecuador solicitó información sobre la certificación.",
          "<strong>Mg. Andrés L.</strong> de Guatemala inició su proceso de inscripción.",
          "<strong>Dra. Valeria C.</strong> de Uruguay confirmó su participación.",
          "<strong>Ing. Sebastián M.</strong> de Panamá reservó su lugar en el programa.",
          "<strong>Lic. Andrea F.</strong> de Costa Rica se registró para recibir información.",
          "<strong>Dr. Mauricio G.</strong> de Bolivia completó su pre-registro.",
          "<strong>Mg. Patricia S.</strong> de República Dominicana solicitó acceso al brochure.",
          "<strong>Ing. Daniel R.</strong> de Paraguay confirmó su interés en MUNICIPAL PRO™.",
          "<strong>Lic. Camila T.</strong> de Honduras reservó su cupo internacional.",
          "<strong>Dr. Ricardo A.</strong> de México inició su proceso de inscripción.",
          "<strong>Mg. Fernanda B.</strong> de Colombia solicitó información sobre el Campus Digital.",
          "<strong>Ing. Jorge V.</strong> de Perú confirmó su participación en las jornadas intensivas.",
          "<strong>Lic. Natalia P.</strong> de Argentina reservó su plaza profesional.",
          "<strong>Dra. Gabriela M.</strong> de Chile se registró para la certificación.",
          "<strong>Ing. Alejandro C.</strong> de Ecuador completó su pre-inscripción.",
          "<strong>Lic. Sergio D.</strong> de México solicitó información sobre fechas y horarios.",
          "<strong>Mg. Paola H.</strong> de Colombia confirmó su participación en MUNICIPAL PRO™.",
          "<strong>Dr. Javier E.</strong> de Guatemala reservó su lugar.",
          "<strong>Lic. Ana Lucía R.</strong> de Guatemala solicitó información sobre la certificación oficial.",
          "<strong>Ing. Martín S.</strong> de Uruguay inició su registro.",
          "<strong>Dra. Claudia V.</strong> de Ecuador confirmó su interés en el Campus Live.",
          "<strong>Lic. Felipe N.</strong> de Chile completó su solicitud de información.",
          "<strong>Mg. Verónica T.</strong> de Panamá reservó su plaza.",
          "<strong>Dr. Luis C.</strong> de Bolivia solicitó información sobre MUNICIPAL 2030 Digital Campus.",
          "<strong>Ing. Mariana P.</strong> de Costa Rica se unió al proceso de admisión.",
          "<strong>Lic. Diego A.</strong> de Argentina confirmó su asistencia.",
          "<strong>Dra. Lorena G.</strong> de México reservó su cupo profesional.",
          "<strong>Mg. Carlos F.</strong> de EEUU solicitó detalles sobre el Implementation Day.",
          "<strong>Ing. Carolina M.</strong> de Colombia completó su pre-inscripción.",
          "<strong>Lic. Andrés V.</strong> de Chile solicitó información sobre los 73 expertos internacionales.",
          "<strong>Dra. Silvia P.</strong> de Ecuador confirmó su interés en la certificación.",
          "<strong>Mg. Roberto C.</strong> de Guatemala reservó su plaza internacional.",
          "<strong>Lic. Gabriela L.</strong> de Paraguay inició su proceso de registro.",
          "<strong>Ing. Fernando R.</strong> de México solicitó información sobre el programa completo.",
          "<strong>Dra. Mónica S.</strong> de Perú confirmó su participación en MUNICIPAL PRO™."
      
    ];

    let idx = 0;

    function showToast() {
      toastText.innerHTML = registrations[idx];
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);

      idx = (idx + 1) % registrations.length;
    }

    // First trigger after 4 seconds, then repeat every 14 seconds
    setTimeout(showToast, 4000);
    setInterval(showToast, 14000);
  }

  initSocialProof();

  // FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Modal Dialog Handlers
  const modal = document.getElementById('registerModal');
  const openModalBtns = document.querySelectorAll('.trigger-modal');
  const closeModalBtn = document.getElementById('closeModal');
  const registerForm = document.getElementById('registerForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;

      alert(`¡Muchas gracias ${name}! Tu solicitud de pre-inscripción para MUNICIPAL PRO™ ha sido procesada exitosamente. Nos comunicaremos a ${email} para confirmar tu cupo.`);
      if (modal) modal.classList.remove('open');
      registerForm.reset();
    });
  }
});
