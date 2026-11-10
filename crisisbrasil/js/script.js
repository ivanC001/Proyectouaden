/**
 * GESTÃO PÚBLICA DE CRISES, EMERGÊNCIAS E CATÁSTROFES
 * UADEN GLOBAL - Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initGroupCalculator();
  initFaqAccordion();
  initMobileMenu();
  initPhoneMask();
  initLeadForm();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. Live Countdown Timer
   -------------------------------------------------------------------------- */
function initCountdown() {
  // Set target date: December 7, 2026 at 19:00 (Brasília Time)
  const targetDate = new Date('2026-12-07T19:00:00-03:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    let diff = targetDate - now;

    // If already passed in test environment, set a realistic upcoming date (30 days from now)
    if (diff <= 0) {
      diff = 28 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 32 * 60 * 1000;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. Group Pricing & Discount Calculator
   -------------------------------------------------------------------------- */
function initGroupCalculator() {
  const countEl = document.getElementById('participant-count');
  const minusBtn = document.getElementById('btn-minus');
  const plusBtn = document.getElementById('btn-plus');
  const discountTagEl = document.getElementById('discount-badge-calc');
  const totalEl = document.getElementById('calc-total-val');
  const perPersonEl = document.getElementById('calc-per-person');
  const economyEl = document.getElementById('calc-economy');
  const numInput = document.getElementById('form-participants');

  if (!countEl || !minusBtn || !plusBtn) return;

  const basePrice = 690; // Price with promotional discount
  let count = 2; // Default to 2 for group demonstration

  function recalculate() {
    let discountPct = 0;
    if (count === 1) {
      discountPct = 0;
    } else if (count === 2) {
      discountPct = 0.10; // 10%
    } else if (count === 3) {
      discountPct = 0.20; // 20%
    } else {
      discountPct = 0.30; // 30% for 4 or more
    }

    const grossTotal = count * basePrice;
    const discountAmount = grossTotal * discountPct;
    const netTotal = grossTotal - discountAmount;
    const pricePerPerson = netTotal / count;

    countEl.textContent = count;
    if (numInput) numInput.value = count;

    if (discountPct > 0) {
      discountTagEl.textContent = `${Math.round(discountPct * 100)}% de Desconto`;
      discountTagEl.style.display = 'inline-block';
    } else {
      discountTagEl.textContent = 'Individual';
    }

    totalEl.textContent = `R$ ${Math.round(netTotal).toLocaleString('pt-BR')}`;
    perPersonEl.textContent = `R$ ${Math.round(pricePerPerson).toLocaleString('pt-BR')} / pessoa`;

    if (economyEl) {
      if (discountAmount > 0) {
        economyEl.textContent = `Economia de R$ ${Math.round(discountAmount).toLocaleString('pt-BR')}`;
        economyEl.style.display = 'block';
      } else {
        economyEl.style.display = 'none';
      }
    }
  }

  plusBtn.addEventListener('click', () => {
    if (count < 25) {
      count++;
      recalculate();
    }
  });

  minusBtn.addEventListener('click', () => {
    if (count > 1) {
      count--;
      recalculate();
    }
  });

  recalculate();
}

/* --------------------------------------------------------------------------
   3. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('navbar-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    toggleBtn.innerHTML = isExpanded
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  // Close when clicking on any nav link
  const links = navMenu.querySelectorAll('.nav-link');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   5. Telephone / WhatsApp Brazilian Format Mask
   -------------------------------------------------------------------------- */
function initPhoneMask() {
  const phoneInput = document.getElementById('form-whatsapp');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);

    if (val.length > 6) {
      val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    e.target.value = val;
  });
}

/* --------------------------------------------------------------------------
   6. Registration Lead Form Submission (Direct to Official WhatsApp)
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.getElementById('lead-registration-form');
  const alertSuccess = document.getElementById('form-success-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const phone = document.getElementById('form-whatsapp')?.value.trim() || '';
    const org = document.getElementById('form-org')?.value.trim() || '';
    const role = document.getElementById('form-role')?.value.trim() || '';
    const participants = document.getElementById('form-participants')?.value || '1';

    if (!name || !email || !phone) {
      alert('Por favor, preencha os campos obrigatórios (Nome, E-mail e WhatsApp).');
      return;
    }

    // Build WhatsApp message for official number +55 22 99246-8472
    const message = `Olá, UADEN Global! Gostaria de me inscrever no curso GESTÃO PÚBLICA DE CRISES, EMERGÊNCIAS E CATÁSTROFES com a condição promocional (R$ 690).\n\n*Dados de Inscrição:*\n- *Nome:* ${name}\n- *E-mail:* ${email}\n- *WhatsApp:* ${phone}\n- *Órgão/Instituição:* ${org || 'Não informado'}\n- *Cargo/Função:* ${role || 'Não informado'}\n- *Número de Participantes:* ${participants}\n\nPor favor, confirmem minha vaga e enviem os dados de pagamento (PIX / Cartão).`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/5522992468472?text=${encodedMsg}`;

    if (alertSuccess) {
      alertSuccess.style.display = 'block';
    }

    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   7. Scroll Spy & Smooth Active Nav State
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
