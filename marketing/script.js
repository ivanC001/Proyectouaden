document.documentElement.classList.add('has-reveal');

// Professional reveal animations
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -45px' });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Mobile Menu Toggle
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav__links');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Module Data for Tabs
const modules = [
  ['01', 'Estrategia y consumidor', [
    'Psicología y comportamiento del consumidor',
    'Branding con propósito y posicionamiento 360°',
    'Neuromarketing y storytelling',
    'Segmentación y propuesta de valor',
    'Customer journey, pricing y marketing mix'
  ]],
  ['02', 'Marketing comercial y gestión', [
    'Venta consultiva y plan de marketing',
    'Activaciones, merchandising y marketing de guerrilla',
    'Alianzas estratégicas y pitch comercial',
    'Investigación de mercados y modelos de penetración',
    'CRM, gestión de marca y liderazgo comercial'
  ]],
  ['03', 'Marketing digital y conversión', [
    'Estrategia digital, SEO y copywriting',
    'Redes sociales, Instagram, TikTok y YouTube',
    'Facebook Ads, Google Ads y email marketing',
    'Embudo de conversión, leads y e-commerce',
    'Remarketing, growth hacking y analítica digital'
  ]],
  ['04', 'Tecnología, datos y automatización', [
    'SEO técnico para no programadores',
    'CRM, email marketing y retargeting creativo',
    'Publicidad programática y estrategia multicanal',
    'Optimización de conversión (CRO) y medición de ROI',
    'Inteligencia artificial aplicada a procesos de marketing'
  ]],
  ['05', 'Nuevas oportunidades digitales', [
    'Productos digitales y marketing para emprendedores',
    'Comunidades, podcasts y plataformas de audio',
    'Analytics 4, Scrum y neuromarketing digital',
    'Shopify, agencias y experiencias de usuario',
    'Landing pages, Web 3.0 y salud de marca digital'
  ]],
  ['06', 'Especialización vertical', [
    'Elige entre 24 sectores e industrias',
    'Aplica el marketing a consumidores y procesos específicos',
    'Trabaja necesidades, problemas y oportunidades reales',
    'Recibe orientación de un mentor de especialización',
    'Convierte el conocimiento general en aplicación sectorial'
  ]]
];

// Interactive Module Tabs
const panel = document.querySelector('.tab-panel');
if (panel) {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = Number(tab.dataset.tab);
      const [number, title, topics] = modules[index];
      
      document.querySelectorAll('.tab').forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const numEl = panel.querySelector('.tab-panel__number');
      const tagEl = panel.querySelector('small');
      const titleEl = panel.querySelector('h3');
      const listEl = panel.querySelector('ul');

      if (numEl) numEl.textContent = number;
      if (tagEl) tagEl.textContent = `ÁREA FORMATIVA ${number}`;
      if (titleEl) titleEl.textContent = title;
      if (listEl) {
        listEl.innerHTML = topics.map((topic) => `<li>✓ ${topic}</li>`).join('');
      }
    });
  });
}

// Benefits Carousel Controls & Interactivity
const track = document.querySelector('.benefits__carousel-track');
const prevBtn = document.querySelector('.carousel-arrow--prev');
const nextBtn = document.querySelector('.carousel-arrow--next');
const dots = document.querySelectorAll('.carousel-dots .dot');

if (track) {
  const getCardWidth = () => {
    const card = track.querySelector('.benefit--card');
    return card ? card.offsetWidth + 24 : 320;
  };

  const updateDots = () => {
    const scrollPos = track.scrollLeft;
    const cardWidth = getCardWidth();
    const activeIndex = Math.round(scrollPos / cardWidth);

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      track.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
    });
  });

  track.addEventListener('scroll', updateDots);

  // Auto-scroll loop every 4.5 seconds
  let autoScrollTimer = setInterval(() => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    }
  }, 4500);

  // Pause auto-scroll on hover or touch
  track.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
  track.addEventListener('touchstart', () => clearInterval(autoScrollTimer));
}

// Accordion Interactivity
document.querySelectorAll('.accordion__item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.accordion__item');
    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion__item').forEach((entry) => {
      entry.classList.remove('open');
      const btn = entry.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const icon = entry.querySelector('i');
      if (icon) icon.textContent = '+';
    });

    if (!wasOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      const icon = button.querySelector('i');
      if (icon) icon.textContent = '−';
    }
  });
});

// Download Feedback Toast
const downloadButtons = document.querySelectorAll('a[download]');
downloadButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('📥 Descargando folleto actualizado...');
  });
});

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 100;
      background: #06344f;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(-20px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
  }, 3500);
}
