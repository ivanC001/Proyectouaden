/**
 * UADEN GLOBAL — Municípios 2030
 * Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const { translations, reasonsData, modulesData } = window.UADEN_I18N;
  
  // State: Default is Portuguese ('pt'), optional Spanish ('es')
  let currentLang = 'pt';

  // Check URL parameter (?lang=es or ?lang=pt) or pathname or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const storedLang = localStorage.getItem('uaden_lang');

  if (langParam === 'es' || langParam === 'pt') {
    currentLang = langParam;
  } else if (window.location.pathname.includes('-es') || document.documentElement.lang.startsWith('es')) {
    currentLang = 'es';
  } else if (window.location.pathname.includes('-pt')) {
    currentLang = 'pt';
  } else if (storedLang === 'es' || storedLang === 'pt') {
    currentLang = storedLang;
  }

  // Initialize
  setLanguage(currentLang);
  initModulesAccordion();
  initFormHandler();
  initSmoothScroll();

  // Language buttons event listener
  document.querySelectorAll('[data-set-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = btn.getAttribute('data-set-lang');
      setLanguage(selected);
    });
  });

  /**
   * Set and apply language
   */
  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('uaden_lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'es';

    // Update active state on language switcher buttons
    document.querySelectorAll('[data-set-lang]').forEach(b => {
      if (b.getAttribute('data-set-lang') === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Update text for all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        input.placeholder = translations[lang][key];
      }
    });

    // Update WhatsApp links with language appropriate message
    updateWhatsAppLinks(lang);

    // Re-render dynamic components
    renderModules(lang);
    renderReasons(lang);
  }

  /**
   * Update WhatsApp links across the page
   */
  function updateWhatsAppLinks(lang) {
    const ptMessage = encodeURIComponent("Olá, gostaria de informações sobre o Programa Executivo Municípios 2030.");
    const esMessage = encodeURIComponent("Hola, quisiera recibir información sobre el Programa Ejecutivo Municipios 2030.");
    const msg = lang === 'pt' ? ptMessage : esMessage;
    const waUrl = `https://wa.me/5511914285660?text=${msg}`;

    document.querySelectorAll('.wa-direct-link').forEach(link => {
      link.href = waUrl;
    });

    const ptPixMsg = encodeURIComponent("Olá, sou funcionário municipal / estudante e gostaria de garantir minha inscrição especial com desconto (2x R$ 390 ou R$ 690 à vista no PIX).");
    const esPixMsg = encodeURIComponent("Hola, soy funcionario municipal / estudiante y deseo asegurar mi inscripción especial con descuento (2x R$ 390 o R$ 690 al contado por PIX).");
    const pixMsg = lang === 'pt' ? ptPixMsg : esPixMsg;
    const pixWaUrl = `https://wa.me/5511914285660?text=${pixMsg}`;

    document.querySelectorAll('.wa-pix-link').forEach(link => {
      link.href = pixWaUrl;
    });
  }

  /**
   * Render the 8 Modules Accordion
   */
  function renderModules(lang) {
    const container = document.getElementById('modules-container');
    if (!container) return;

    const list = modulesData[lang] || modulesData['pt'];
    container.innerHTML = '';

    list.forEach((mod, index) => {
      const isFirst = index === 0;
      const item = document.createElement('div');
      item.className = 'module-accordion-item';

      item.innerHTML = `
        <button type="button" class="module-accordion-button ${isFirst ? 'active' : ''}" data-target="#mod-body-${index}">
          <div>
            <span class="module-badge">Módulo ${mod.num}</span>
            <span class="module-title-text">${mod.title}</span>
          </div>
          <i class="bi ${isFirst ? 'bi-dash-lg' : 'bi-plus-lg'}"></i>
        </button>
        <div id="mod-body-${index}" class="module-accordion-collapse ${isFirst ? 'show' : ''}">
          <ul class="module-topics-list">
            ${mod.topics.map(topic => `
              <li><i class="bi bi-check-square-fill"></i> <span>${topic}</span></li>
            `).join('')}
          </ul>
        </div>
      `;
      container.appendChild(item);
    });

    // Attach click events
    container.querySelectorAll('.module-accordion-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const collapse = document.querySelector(targetId);
        const icon = btn.querySelector('i');
        const isShown = collapse.classList.contains('show');

        // Close others or toggle this
        collapse.classList.toggle('show');
        btn.classList.toggle('active');
        
        if (collapse.classList.contains('show')) {
          icon.className = 'bi bi-dash-lg';
        } else {
          icon.className = 'bi bi-plus-lg';
        }
      });
    });
  }

  /**
   * Render 25 Reasons Grid
   */
  function renderReasons(lang) {
    const container = document.getElementById('reasons-grid-container');
    if (!container) return;

    const list = reasonsData[lang] || reasonsData['pt'];
    container.innerHTML = '';

    list.forEach((reason, index) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mb-3';
      col.innerHTML = `
        <div class="reason-grid-item">
          <span class="reason-num">${(index + 1).toString().padStart(2, '0')}</span>
          <p class="reason-text">${reason}</p>
        </div>
      `;
      container.appendChild(col);
    });
  }

  /**
   * Form submission & brochure direct download + WhatsApp integration
   */
  function initFormHandler() {
    const form = document.getElementById('lead-enroll-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('lead-name')?.value.trim() || '';
      const email = document.getElementById('lead-email')?.value.trim() || '';
      const phone = document.getElementById('lead-phone')?.value.trim() || '';
      const role = document.getElementById('lead-role')?.value.trim() || '';
      const city = document.getElementById('lead-city')?.value.trim() || '';

      // Build structured WhatsApp message in active language
      let messageText = '';
      if (currentLang === 'pt') {
        messageText = `Olá, equipe UADEN Global! Gostaria de me inscrever no Programa Executivo Municípios 2030 e receber o folheto oficial de 18 páginas.\n\n` +
          `📋 *DADOS DE INSCRIÇÃO:*\n` +
          `• *Nome Completo:* ${name}\n` +
          `• *E-mail:* ${email}\n` +
          `• *WhatsApp:* ${phone}\n` +
          `• *Cargo / Função:* ${role}\n` +
          `• *Município / Estado:* ${city}\n\n` +
          `Solicito a confirmação da minha vaga e orientações para participação.`;
      } else {
        messageText = `¡Hola, equipo de UADEN Global! Quisiera inscribirme en el Programa Ejecutivo Municipios 2030 y recibir el folleto oficial de 18 páginas.\n\n` +
          `📋 *DATOS DE INSCRIPCIÓN:*\n` +
          `• *Nombre Completo:* ${name}\n` +
          `• *E-mail:* ${email}\n` +
          `• *WhatsApp:* ${phone}\n` +
          `• *Cargo / Función:* ${role}\n` +
          `• *Municipio / Estado:* ${city}\n\n` +
          `Solicito la confirmación de mi plaza y las orientaciones para mi participación.`;
      }

      const waUrl = `https://wa.me/5511914285660?text=${encodeURIComponent(messageText)}`;

      // 1. Immediately link/open WhatsApp in new window/tab with filled message
      window.open(waUrl, '_blank');

      // 2. Trigger automatic download of official PDF brochure
      const link = document.createElement('a');
      link.href = 'assets/pdf/FOLLETO_MUNICIPIOS_BRASIL_actualizado.pdf';
      link.download = 'Municipios-2030-Folheto-UADEN.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 3. Update modal WhatsApp button for fallback / direct re-click
      const waBtn = document.getElementById('modal-wa-btn');
      if (waBtn) {
        waBtn.href = waUrl;
        waBtn.innerHTML = `<i class="bi bi-whatsapp"></i> ${currentLang === 'pt' ? 'Continuar no WhatsApp com seus dados' : 'Continuar en WhatsApp con sus datos'}`;
      }

      // 4. Show bootstrap confirmation modal
      const modalEl = document.getElementById('downloadSuccessModal');
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }

      form.reset();
    });
  }

  /**
   * Initialize accordion initial state
   */
  function initModulesAccordion() {
    // handled by renderModules
  }

  /**
   * Smooth navigation scrolling
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile navbar if open
          const navbarCollapse = document.getElementById('mainNavbarContent');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      });
    });
  }
});
