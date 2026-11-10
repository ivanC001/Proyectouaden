/**
 * UADEN GLOBAL - GESTIÓN INTEGRAL DE CRISIS, EMERGENCIAS Y CATÁSTROFES
 * Interactive Scripts & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.setAttribute('aria-expanded', 'false');

    const closeNavigation = () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('bi-x-lg');
        icon.classList.add('bi-list');
      }
    };

    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('bi-list');
          icon.classList.add('bi-x-lg');
        } else {
          icon.classList.remove('bi-x-lg');
          icon.classList.add('bi-list');
        }
      }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('open') && !event.target.closest('.site-header')) {
        closeNavigation();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNavigation();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1180) closeNavigation();
    });
  }

  // 2. Sticky Header scroll effect
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // Keep the current section visible in the navigation while scrolling.
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const trackedSections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!current) return;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.35] });

    trackedSections.forEach(section => sectionObserver.observe(section));
  }

  // Shared crisis atmosphere for every content section. CSS handles the
  // animation; markup stays decorative and invisible to assistive technology.
  document.querySelectorAll('main .section, body > .section').forEach((section, index) => {
    if (section.querySelector(':scope > .section-atmosphere')) return;

    const atmosphere = document.createElement('div');
    const moods = ['smoke', 'fire', 'lightning', 'embers'];
    const flames = Array.from({ length: 18 }, (_, flameIndex) => {
      const x = (flameIndex * 17 + 5) % 100;
      const scale = (0.55 + (flameIndex % 6) * 0.13).toFixed(2);
      const delay = (-0.18 * (flameIndex % 8)).toFixed(2);
      const duration = (1.35 + (flameIndex % 5) * 0.18).toFixed(2);
      return `<i style="--x:${x}%;--scale:${scale};--delay:${delay}s;--duration:${duration}s"></i>`;
    }).join('');
    const embers = Array.from({ length: 26 }, (_, emberIndex) => {
      const x = (emberIndex * 29 + 3) % 100;
      const drift = ((emberIndex % 7) - 3) * 13;
      const delay = (-0.37 * (emberIndex % 12)).toFixed(2);
      const duration = (4.2 + (emberIndex % 7) * 0.55).toFixed(2);
      const size = 2 + (emberIndex % 4);
      return `<i style="--x:${x}%;--drift:${drift}px;--delay:${delay}s;--duration:${duration}s;--size:${size}px"></i>`;
    }).join('');
    atmosphere.className = `section-atmosphere atmosphere-${moods[index % moods.length]}`;
    atmosphere.setAttribute('aria-hidden', 'true');
    atmosphere.innerHTML = `
      <span class="atmo-smoke atmo-smoke-a"></span>
      <span class="atmo-smoke atmo-smoke-b"></span>
      <span class="atmo-lightning atmo-lightning-a"></span>
      <span class="atmo-lightning atmo-lightning-b"></span>
      <span class="atmo-fire-zone"><span class="atmo-flames">${flames}</span></span>
      <span class="atmo-ember-field">${embers}</span>
    `;
    section.prepend(atmosphere);
  });

  // Reveal the new editorial image panels only when they enter the viewport.
  // The content remains visible without JavaScript and motion is disabled for
  // visitors who prefer a reduced-motion experience.
  const editorialVisuals = document.querySelectorAll(
    '.hero-response-visual, .reality-crisis-poster, .module-context-image, .crisis-role-figure, .investment-visual-band, .contact-rescue-visual'
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reducedMotion) {
    const visualObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visual-active');
        visualObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    editorialVisuals.forEach((visual) => visualObserver.observe(visual));
  } else {
    editorialVisuals.forEach((visual) => visual.classList.add('visual-active'));
  }

  // 3. Academic Modules Tab Switcher
  const moduleTabs = document.querySelectorAll('.module-tab-btn');
  const moduleContents = document.querySelectorAll('.module-content-card');

  moduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetModule = tab.getAttribute('data-target');

      moduleTabs.forEach(t => t.classList.remove('active'));
      moduleContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetCard = document.getElementById(targetModule);
      if (targetCard) {
        targetCard.classList.add('active');
      }
    });
  });

  // 5. Interactive Group & Municipal Discount Calculator
  const participantsInput = document.getElementById('calcParticipants');
  const btnMinus = document.getElementById('calcMinus');
  const btnPlus = document.getElementById('calcPlus');
  const calcSubtotal = document.getElementById('calcSubtotal');
  const calcDiscountPercent = document.getElementById('calcDiscountPercent');
  const calcDiscountSavings = document.getElementById('calcDiscountSavings');
  const calcTotal = document.getElementById('calcTotal');
  const calcPricePerPerson = document.getElementById('calcPricePerPerson');
  const tierBoxes = document.querySelectorAll('.discount-tier-box');

  const BASE_PRICE = 349; // Early Bird Price in USD

  const calculatePricing = (qty) => {
    qty = Math.max(1, parseInt(qty) || 1);
    if (participantsInput) participantsInput.value = qty;

    let discountRate = 0;
    if (qty === 2) {
      discountRate = 0.10;
    } else if (qty === 3) {
      discountRate = 0.20;
    } else if (qty >= 4) {
      discountRate = 0.30;
    }

    const subtotal = qty * BASE_PRICE;
    const discountAmount = subtotal * discountRate;
    const total = subtotal - discountAmount;
    const finalPerPerson = total / qty;

    if (calcSubtotal) calcSubtotal.textContent = `$${subtotal.toLocaleString()} USD`;
    if (calcDiscountPercent) calcDiscountPercent.textContent = discountRate > 0 ? `${(discountRate * 100).toFixed(0)}%` : '0%';
    if (calcDiscountSavings) calcDiscountSavings.textContent = discountAmount > 0 ? `-$${discountAmount.toFixed(0)} USD` : '$0 USD';
    if (calcTotal) calcTotal.textContent = `$${total.toFixed(0)} USD`;
    if (calcPricePerPerson) calcPricePerPerson.textContent = `$${finalPerPerson.toFixed(0)} USD`;

    // Highlight active tier box
    tierBoxes.forEach(box => {
      const min = parseInt(box.getAttribute('data-min'));
      const max = parseInt(box.getAttribute('data-max'));
      if (qty >= min && qty <= max) {
        box.classList.add('active');
      } else {
        box.classList.remove('active');
      }
    });
  };

  if (btnMinus && btnPlus && participantsInput) {
    btnMinus.addEventListener('click', () => {
      let current = parseInt(participantsInput.value) || 1;
      if (current > 1) {
        calculatePricing(current - 1);
      }
    });

    btnPlus.addEventListener('click', () => {
      let current = parseInt(participantsInput.value) || 1;
      calculatePricing(current + 1);
    });

    participantsInput.addEventListener('input', (e) => {
      calculatePricing(e.target.value);
    });

    // Initial calculation
    calculatePricing(1);
  }

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          content.style.maxHeight = null;
        }
      });
    }
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstFaq = faqItems[0];
    firstFaq.classList.add('active');
    const firstContent = firstFaq.querySelector('.faq-content');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  // 7. WhatsApp Contact & Form Handlers
  const WHATSAPP_NUMBER = '12232400531'; // +1 223 240 0531

  const handleLeadSubmit = (e, formId) => {
    e.preventDefault();
    const form = document.getElementById(formId);
    if (!form) return;

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const institution = form.querySelector('[name="institution"]')?.value || '';
    const position = form.querySelector('[name="position"]')?.value || '';
    const country = form.querySelector('[name="country"]')?.value || '';
    const notes = form.querySelector('[name="notes"]')?.value || '';

    const message = `🏛️ *CONSULTA / INSCRIPCIÓN - SEMINARIO GESTIÓN DE CRISIS UADEN GLOBAL (2da Edición)*\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `🏢 *Institución/Municipio:* ${institution}\n` +
      `💼 *Cargo:* ${position}\n` +
      `🌍 *País:* ${country}\n` +
      `📱 *WhatsApp/Teléfono:* ${phone}\n` +
      `📧 *Email:* ${email}\n` +
      (notes ? `💬 *Consulta/Mensaje:* ${notes}\n\n` : '\n') +
      `Deseo recibir información detallada sobre cupos institucionales, descuento Early Bird y medios de pago.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show feedback
    alert(`¡Gracias ${name}! Te hemos redirigido a WhatsApp con tu asesor de UADEN Global para confirmar tu inscripción.`);
    form.reset();

    // Close modal if open
    closeAllModals();
  };

  const contactForm = document.getElementById('contactFullForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleLeadSubmit(e, 'contactFullForm'));
  }

  const modalForm = document.getElementById('modalRegisterForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleLeadSubmit(e, 'modalRegisterForm'));
  }

  // 8. Modal Management
  const modalBackdrop = document.getElementById('registerModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal="registerModal"]');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn, .modal-backdrop');

  const openModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeAllModals = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === modalBackdrop || e.target.closest('.modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // 9. Interactive Dynamic Quote calculation button in pricing calculator
  const btnQuoteWhatsApp = document.getElementById('btnQuoteWhatsApp');
  if (btnQuoteWhatsApp && participantsInput) {
    btnQuoteWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      const qty = participantsInput.value || 1;
      const total = calcTotal ? calcTotal.textContent : '$349 USD';
      const savings = calcDiscountSavings ? calcDiscountSavings.textContent : '$0 USD';

      const message = `🏛️ *SOLICITUD DE COTIZACIÓN MUNICIPAL / GRUPAL - UADEN GLOBAL*\n\n` +
        `📊 *Cantidad de participantes:* ${qty} personas\n` +
        `💰 *Inversión Total Estimada:* ${total}\n` +
        `🎁 *Ahorro por descuento institucional:* ${savings}\n\n` +
        `Por favor envíenme la cotización formal en PDF y la factura proforma para tramitar el pago institucional de nuestro municipio/organización.`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    });
  }

  // 10. ADVANCED ATMOSPHERIC CRISIS FX & DISASTER ENGINE
  const initCrisisAtmosphereFX = () => {
    // Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // ------------------------------------------------------------------------
    // 10.1 HERO ENGINE: Torrential Storm, Concentric Water Ripples & Lightning
    // ------------------------------------------------------------------------
    const heroCanvas = document.getElementById('crisisFxCanvas');
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      if (ctx) {
        let width = 0;
        let height = 0;
        let isHeroRunning = true;
        let heroAnimId = null;

        const resizeHero = () => {
          const parent = heroCanvas.parentElement;
          if (!parent) return;
          width = heroCanvas.width = parent.offsetWidth;
          height = heroCanvas.height = parent.offsetHeight;
        };
        resizeHero();
        window.addEventListener('resize', resizeHero);

        // Water level line in hero (bottom 10-15% of hero)
        const getWaterLine = () => height - Math.min(100, height * 0.14);

        // Raindrops (Intense Torrential Rain)
        const RAIN_COUNT = Math.min(150, Math.floor(window.innerWidth / 9));
        const raindrops = [];
        const ripples = [];
        const splashes = [];

        // Lightning State
        let lightningAlpha = 0;
        let nextLightningTime = Date.now() + 4000 + Math.random() * 6000;

        const triggerLightning = () => {
          lightningAlpha = 0.45;
          setTimeout(() => { lightningAlpha = 0.15; }, 50);
          setTimeout(() => { lightningAlpha = 0.6; }, 100);
          setTimeout(() => { lightningAlpha = 0.2; }, 160);
          nextLightningTime = Date.now() + 7000 + Math.random() * 8000;
        };

        class IntenseRaindrop {
          constructor() {
            this.reset(true);
          }
          reset(initial = false) {
            this.x = Math.random() * (width + 350) - 150;
            this.y = initial ? Math.random() * height : -40;
            this.len = Math.random() * 28 + 18;
            this.layer = Math.random(); // 0 (far) to 1 (near)
            this.vx = -3.5 - Math.random() * 3.0; // wind drift
            this.vy = 18 + this.layer * 14; // fast torrential speed
            this.alpha = 0.15 + this.layer * 0.35;
            this.thickness = 0.75 + this.layer * 1.3;
          }
          update() {
            this.x += this.vx;
            this.y += this.vy;

            const waterY = getWaterLine() + Math.random() * 60;
            if (this.y >= waterY) {
              // Create concentric ripple upon hitting water surface
              createWaterRipple(this.x, this.y, this.layer);
              if (this.layer > 0.4 && Math.random() < 0.6) {
                createWaterSplash(this.x, this.y, this.layer);
              }
              this.reset(false);
            }
          }
          draw() {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(224, 242, 254, ${Math.min(1, this.alpha + lightningAlpha * 0.5)})`;
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.vx * 1.8, this.y + this.len);
            ctx.stroke();
          }
        }

        class WaterRipple {
          constructor(x, y, intensity) {
            this.x = x;
            this.y = y;
            this.radius = 2 + Math.random() * 3;
            this.maxRadius = 18 + intensity * 26;
            this.growthRate = 0.7 + intensity * 0.9;
            this.alpha = 0.6 + intensity * 0.3;
            this.decay = 0.022 - intensity * 0.008;
            this.lineWidth = 1.0 + intensity * 1.0;
            this.aspect = 0.34; // elliptical perspective for water surface
          }
          update() {
            this.radius += this.growthRate;
            this.alpha -= this.decay;
          }
          draw() {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.beginPath();
            // Elliptical concentric ring
            ctx.ellipse(this.x, this.y, this.radius, this.radius * this.aspect, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, this.alpha + lightningAlpha * 0.3)})`;
            ctx.lineWidth = Math.max(0.5, this.lineWidth * (1 - this.radius / this.maxRadius));
            ctx.stroke();

            // Inner secondary wave ring
            if (this.radius > 8) {
              ctx.beginPath();
              ctx.ellipse(this.x, this.y, this.radius * 0.55, this.radius * 0.55 * this.aspect, 0, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, this.alpha * 0.55)})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
            ctx.restore();
          }
        }

        class WaterSplashDroplet {
          constructor(x, y, intensity) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI - Math.PI; // upward arc
            const speed = 2.0 + intensity * 3.5;
            this.vx = Math.cos(angle) * speed * 0.8 - 0.8;
            this.vy = Math.sin(angle) * speed;
            this.radius = Math.random() * 1.4 + 0.6;
            this.alpha = 0.7;
            this.decay = 0.05 + Math.random() * 0.04;
          }
          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.28; // gravity
            this.alpha -= this.decay;
          }
          draw() {
            if (this.alpha <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0, this.alpha)})`;
            ctx.fill();
          }
        }

        const createWaterRipple = (x, y, intensity) => {
          if (ripples.length > 90) return;
          ripples.push(new WaterRipple(x, y, intensity));
        };

        const createWaterSplash = (x, y, intensity) => {
          if (splashes.length > 80) return;
          const count = Math.floor(Math.random() * 3) + 2;
          for (let i = 0; i < count; i++) {
            splashes.push(new WaterSplashDroplet(x, y, intensity));
          }
        };

        // Initialize rain particles
        for (let i = 0; i < RAIN_COUNT; i++) {
          raindrops.push(new IntenseRaindrop());
        }

        // Embers & Floating Disaster Particles
        const EMBER_COUNT = Math.min(35, Math.floor(window.innerWidth / 35));
        const embers = [];
        const EMBER_COLORS = [
          { r: 245, g: 158, b: 11 },  // Gold
          { r: 239, g: 68, b: 68 },   // Red emergency
          { r: 251, g: 191, b: 36 },  // Amber light
          { r: 6, g: 182, b: 212 }    // Cyan tactical
        ];

        class DisasterEmber {
          constructor() {
            this.reset(true);
          }
          reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 15;
            this.radius = Math.random() * 2.2 + 0.8;
            this.baseAlpha = Math.random() * 0.45 + 0.2;
            this.alpha = this.baseAlpha;
            this.vy = Math.random() * 1.1 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.6 - 0.4;
            this.swaySpeed = Math.random() * 0.03 + 0.01;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
          }
          update(time) {
            this.y -= this.vy;
            this.x += Math.sin(time * this.swaySpeed + this.swayOffset) * 0.7 + this.vx;
            if (this.y < -20 || this.x < -30 || this.x > width + 30) {
              this.reset(false);
            }
          }
          draw() {
            ctx.save();
            const { r, g, b } = this.color;
            if (this.radius > 1.4) {
              const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2.8);
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.alpha})`);
              gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.35})`);
              gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
            ctx.fill();
            ctx.restore();
          }
        }

        for (let i = 0; i < EMBER_COUNT; i++) {
          embers.push(new DisasterEmber());
        }

        // Hero Render Loop
        const renderHeroLoop = (time) => {
          if (!isHeroRunning) return;

          // Lightning timer
          if (Date.now() > nextLightningTime) {
            triggerLightning();
          }
          if (lightningAlpha > 0) {
            lightningAlpha *= 0.88;
            if (lightningAlpha < 0.01) lightningAlpha = 0;
          }

          ctx.clearRect(0, 0, width, height);

          // Lightning sky flash illumination
          if (lightningAlpha > 0.02) {
            ctx.fillStyle = `rgba(224, 242, 254, ${lightningAlpha * 0.25})`;
            ctx.fillRect(0, 0, width, height);
          }

          // 1. Draw Ripples on water surface
          for (let i = ripples.length - 1; i >= 0; i--) {
            const rip = ripples[i];
            rip.update();
            rip.draw();
            if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
              ripples.splice(i, 1);
            }
          }

          // 2. Draw Splashes
          for (let i = splashes.length - 1; i >= 0; i--) {
            const sp = splashes[i];
            sp.update();
            sp.draw();
            if (sp.alpha <= 0) {
              splashes.splice(i, 1);
            }
          }

          // 3. Draw Torrential Rain
          for (let r of raindrops) {
            r.update();
            r.draw();
          }

          // 4. Draw Floating Embers
          for (let e of embers) {
            e.update(time * 0.001);
            e.draw();
          }

          heroAnimId = requestAnimationFrame(renderHeroLoop);
        };

        // Hero Observer
        const heroObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!isHeroRunning) {
                isHeroRunning = true;
                heroAnimId = requestAnimationFrame(renderHeroLoop);
              }
            } else {
              isHeroRunning = false;
              if (heroAnimId) {
                cancelAnimationFrame(heroAnimId);
                heroAnimId = null;
              }
            }
          });
        }, { threshold: 0.02 });

        const heroEl = document.getElementById('hero');
        if (heroEl) heroObserver.observe(heroEl);
        heroAnimId = requestAnimationFrame(renderHeroLoop);
      }
    }

    // ------------------------------------------------------------------------
    // 10.2 SECTION 4 (PROGRAMA / WILDFIRE & DISASTER EMBER FX)
    // ------------------------------------------------------------------------
    const initSectionCanvas = (canvasId, type) => {
      const cvs = document.getElementById(canvasId);
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      let w = 0;
      let h = 0;
      let isRunning = false;
      let animId = null;

      const resize = () => {
        const p = cvs.parentElement;
        if (!p) return;
        w = cvs.width = p.offsetWidth;
        h = cvs.height = p.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const items = [];
      const count = type === 'fire' ? 45 : 30;

      for (let i = 0; i < count; i++) {
        items.push({
          x: Math.random() * (w || 1000),
          y: Math.random() * (h || 600),
          radius: Math.random() * 2.4 + 0.8,
          alpha: Math.random() * 0.5 + 0.2,
          vy: Math.random() * 1.2 + 0.4,
          vx: (Math.random() - 0.5) * 0.8,
          sway: Math.random() * Math.PI * 2,
          color: type === 'fire' 
            ? (Math.random() > 0.4 ? { r: 239, g: 68, b: 68 } : { r: 245, g: 158, b: 11 })
            : { r: 6, g: 182, b: 212 }
        });
      }

      const loop = (t) => {
        if (!isRunning) return;
        ctx.clearRect(0, 0, w, h);

        for (let it of items) {
          it.y -= it.vy;
          it.x += Math.sin(t * 0.001 + it.sway) * 0.5 + it.vx;

          if (it.y < -10) {
            it.y = h + 10;
            it.x = Math.random() * w;
          }

          ctx.beginPath();
          ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${it.color.r}, ${it.color.g}, ${it.color.b}, ${it.alpha})`;
          ctx.fill();
        }

        animId = requestAnimationFrame(loop);
      };

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            if (!isRunning) {
              isRunning = true;
              animId = requestAnimationFrame(loop);
            }
          } else {
            isRunning = false;
            if (animId) cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.05 });

      const sec = cvs.closest('section');
      if (sec) obs.observe(sec);
    };

    initSectionCanvas('programaFxCanvas', 'fire');
    initSectionCanvas('modulosFxCanvas', 'tactical');
    initSectionCanvas('contactoFxCanvas', 'tactical');
  };

  initCrisisAtmosphereFX();
});
