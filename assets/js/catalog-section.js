Aquí tienes la solución definitiva. El problema del diseño anterior era que la caja del modal era blanca y plana, lo que rompía por completo la estética, aplastaba el libro y cortaba los textos.

Este código recrea **al 100% el diseño de la primera imagen**: el fondo azul corporativo con ondas, el libro en 3D con la lámina amarilla posterior, los gráficos cian/amarillo, la tipografía serif blanca de alto impacto y el botón dorado.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("uadenCatalogToast")) return;

  const catalogUrl =
    "/assets/pdf/Catalogo%20de%20Formaciones%20y%20Programas%20de%20Training%202027%20Uaden%20Prime%20%288%29.pdf";

  // Cargar Google Fonts para la tipografía serif y sans-serif exacta
  if (!document.getElementById("uadenGoogleFonts")) {
    const fontLink = document.createElement("link");
    fontLink.id = "uadenGoogleFonts";
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(fontLink);
  }

  const style = document.createElement("style");
  style.id = "uadenCatalogModalStyles";

  style.textContent = `
    /* ========================================================
       TOAST FLOTANTE (NOTIFICACIÓN)
       ======================================================== */
    .uaden-catalog-toast {
      position: fixed;
      z-index: 99990;
      right: 2rem;
      bottom: 2rem;
      display: flex;
      align-items: center;
      gap: .9rem;
      width: min(390px, calc(100vw - 2rem));
      padding: .95rem 1.15rem;
      color: #ffffff;
      background: linear-gradient(135deg, #022349 0%, #084c8d 100%);
      border: 1px solid rgba(125, 211, 252, .35);
      border-radius: 16px;
      box-shadow: 0 20px 45px rgba(0, 10, 30, .45);
      cursor: pointer;
      opacity: 0;
      transform: translateX(130%);
      transition: transform .55s cubic-bezier(.18, .89, .32, 1.28), opacity .3s ease;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      box-sizing: border-box;
    }

    .uaden-catalog-toast * {
      box-sizing: border-box;
    }

    .uaden-catalog-toast.show {
      opacity: 1;
      transform: translateX(0);
    }

    .uaden-catalog-toast__icon {
      display: grid;
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      place-items: center;
      color: #032042;
      background: #fdb813;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(253, 184, 19, .35);
    }

    .uaden-catalog-toast strong {
      display: block;
      font-size: .92rem;
      font-weight: 700;
      color: #ffffff;
    }

    .uaden-catalog-toast small {
      display: block;
      margin-top: .2rem;
      color: #d1e8ff;
      font-size: .78rem;
      line-height: 1.35;
    }

    .uaden-catalog-toast__close {
      align-self: flex-start;
      margin-left: auto;
      padding: 0;
      color: rgba(255, 255, 255, .7);
      background: transparent;
      border: 0;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
    }

    .uaden-catalog-toast__close:hover {
      color: #ffffff;
    }

    /* ========================================================
       MODAL Y FONDO AZUL CORPORATIVO CON ONDAS
       ======================================================== */
    .uaden-catalog-modal {
      position: fixed;
      z-index: 99999;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background: rgba(1, 10, 24, .82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      opacity: 0;
      pointer-events: none;
      transition: opacity .3s ease;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      box-sizing: border-box;
    }

    .uaden-catalog-modal * {
      box-sizing: border-box;
    }

    .uaden-catalog-modal.open {
      opacity: 1;
      pointer-events: auto;
    }

    .uaden-catalog-modal__box {
      position: relative;
      display: grid;
      grid-template-columns: 330px minmax(0, 1fr);
      gap: 3.2rem;
      align-items: center;
      width: min(990px, calc(100vw - 2.5rem));
      max-height: calc(100vh - 3rem);
      padding: 3rem 3.5rem 3rem 2.5rem;
      color: #ffffff;
      background:
        radial-gradient(ellipse at 88% 18%, rgba(0, 140, 255, .28) 0%, transparent 45%),
        radial-gradient(circle at 10% 85%, rgba(0, 80, 175, .32) 0%, transparent 50%),
        linear-gradient(115deg, #011b3b 0%, #033268 45%, #054e99 82%, #033a75 100%);
      border: 1px solid rgba(125, 211, 252, .28);
      border-radius: 26px;
      box-shadow:
        0 40px 100px -15px rgba(0, 5, 16, .75),
        inset 0 1px 1px rgba(255, 255, 255, .2);
      transform: translateY(20px) scale(.97);
      transition: transform .32s cubic-bezier(.16, 1, .3, 1);
      overflow: hidden;
    }

    .uaden-catalog-modal.open .uaden-catalog-modal__box {
      transform: translateY(0) scale(1);
    }

    /* Ondas decorativas de fondo */
    .uaden-catalog-modal__waves {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .uaden-catalog-modal__close {
      position: absolute;
      z-index: 20;
      top: 1.15rem;
      right: 1.15rem;
      display: grid;
      width: 36px;
      height: 36px;
      place-items: center;
      color: #ffffff;
      background: rgba(255, 255, 255, .12);
      border: 1px solid rgba(255, 255, 255, .25);
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      transition: background .2s ease, transform .2s ease;
    }

    .uaden-catalog-modal__close:hover {
      background: rgba(255, 255, 255, .25);
      transform: scale(1.08);
    }

    /* ========================================================
       MOCKUP DEL LIBRO 3D (IZQUIERDA)
       ======================================================== */
    .uaden-catalog-mockup {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 380px;
      perspective: 1200px;
    }

    /* Lámina trasera amarilla */
    .uaden-catalog-book__backdrop {
      position: absolute;
      width: 245px;
      height: 350px;
      background: #fdb813;
      border-radius: 20px;
      transform: rotate(6deg) translate(24px, 12px);
      box-shadow: 0 20px 45px rgba(0, 7, 20, .5);
      z-index: 1;
    }

    /* Libro principal en 3D */
    .uaden-catalog-book {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 245px;
      height: 358px;
      padding: 1.6rem 1.4rem 1.4rem 1.4rem;
      overflow: hidden;
      color: #ffffff;
      background: linear-gradient(145deg, #03244b 0%, #063870 55%, #084c94 100%);
      border-radius: 6px 18px 18px 6px;
      box-shadow:
        -20px 24px 45px rgba(0, 0, 0, .55),
        inset -1px 0 0 rgba(255, 255, 255, .25),
        inset 8px 0 12px rgba(0, 0, 0, .45);
      transform: rotate(-6.5deg);
      transform-origin: center center;
    }

    /* Lomo del libro */
    .uaden-catalog-book::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 15px;
      background: linear-gradient(90deg, rgba(255, 255, 255, .35) 0%, rgba(255, 255, 255, .08) 20%, rgba(0, 0, 0, .35) 45%, transparent 100%);
      z-index: 6;
    }

    /* Esquina superior de hojas blancas */
    .uaden-catalog-book__pages-top {
      position: absolute;
      top: -5px;
      left: 2px;
      width: 28px;
      height: 12px;
      background: #f8fafc;
      transform: rotate(-24deg);
      border-radius: 2px;
      box-shadow: -2px 2px 5px rgba(0, 0, 0, .3);
      z-index: 1;
    }

    /* Borde de páginas laterales */
    .uaden-catalog-book__pages-side {
      position: absolute;
      top: 8px;
      bottom: 8px;
      right: -5px;
      width: 8px;
      background: repeating-linear-gradient(to bottom, #f1f5f9, #cbd5e1 2px, #ffffff 3px);
      border-radius: 0 4px 4px 0;
      transform: skewY(6deg);
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .25);
      z-index: 1;
    }

    /* Gráfico de círculos cian y amarillo */
    .uaden-catalog-book__shapes {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
    }

    .uaden-shape-yellow {
      position: absolute;
      top: 22%;
      right: -25px;
      width: 155px;
      height: 155px;
      background: #fdb813;
      border-radius: 50%;
    }

    .uaden-shape-cyan {
      position: absolute;
      top: 17%;
      right: 8px;
      width: 165px;
      height: 165px;
      background: #009ee2;
      border-radius: 50%;
    }

    .uaden-shape-mask {
      position: absolute;
      top: 11%;
      right: 50px;
      width: 175px;
      height: 175px;
      background: linear-gradient(135deg, #032750 0%, #063d7a 100%);
      border-radius: 50%;
    }

    /* Logo UADEN GLOBAL en portada */
    .uaden-catalog-book__brand {
      position: relative;
      z-index: 5;
    }

    .uaden-brand-svg {
      width: 115px;
      height: auto;
      display: block;
    }

    /* Textos en portada */
    .uaden-catalog-book__content {
      position: relative;
      z-index: 5;
      margin-top: auto;
    }

    .uaden-catalog-book__content strong {
      display: block;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      font-weight: 700;
      line-height: .88;
      letter-spacing: .02em;
      color: #ffffff;
    }

    .uaden-catalog-book__content strong span {
      display: block;
      font-size: 2.1rem;
      font-weight: 800;
      margin-top: .12rem;
    }

    .uaden-catalog-book__content small {
      display: block;
      margin-top: .55rem;
      color: #d1ecff;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: .72rem;
      font-weight: 500;
      line-height: 1.3;
    }

    .uaden-catalog-book__content em {
      display: inline-block;
      margin-top: .75rem;
      color: #fdb813;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: .65rem;
      font-weight: 800;
      font-style: normal;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    /* ========================================================
       COLUMNA DERECHA: TEXTO Y CTA
       ======================================================== */
    .uaden-catalog-content {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .uaden-catalog-content h2 {
      margin: 0 0 1.1rem;
      color: #ffffff;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2rem, 3vw, 2.75rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -.015em;
      max-width: 580px;
    }

    .uaden-catalog-content > p {
      max-width: 520px;
      margin: 0 0 1.6rem;
      color: #d2e7f8;
      font-size: .98rem;
      line-height: 1.55;
      font-weight: 400;
    }

    /* Lista de beneficios */
    .uaden-catalog-benefits {
      display: grid;
      gap: .8rem;
      padding: 0;
      margin: 0 0 1.9rem;
      list-style: none;
    }

    .uaden-catalog-benefits li {
      display: flex;
      align-items: center;
      gap: .75rem;
      color: #f3f8fe;
      font-size: .95rem;
      font-weight: 600;
    }

    .uaden-catalog-benefits svg {
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      color: #fdb813;
    }

    /* Botón de descarga dorado */
    .uaden-catalog-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .7rem;
      width: fit-content;
      padding: .95rem 1.8rem;
      color: #032042;
      background: #fdb813;
      border-radius: 6px;
      box-shadow: 0 10px 25px rgba(253, 184, 19, .3);
      font-size: .96rem;
      font-weight: 800;
      text-decoration: none;
      transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
    }

    .uaden-catalog-btn:hover {
      background: #ffc42e;
      color: #02142d;
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(253, 184, 19, .42);
    }

    .uaden-catalog-btn svg {
      width: 19px;
      height: 19px;
    }

    /* ========================================================
       RESPONSIVE DESIGN (MÓVIL / TABLET)
       ======================================================== */
    @media (max-width: 860px) {
      .uaden-catalog-modal {
        padding: 1rem;
      }

      .uaden-catalog-toast {
        right: 1rem;
        bottom: 1rem;
      }

      .uaden-catalog-modal__box {
        grid-template-columns: 1fr;
        gap: 2rem;
        width: min(480px, 100%);
        max-height: 90vh;
        padding: 2.5rem 1.5rem 2rem;
        overflow-y: auto;
      }

      .uaden-catalog-mockup {
        min-height: 290px;
      }

      .uaden-catalog-book__backdrop {
        width: 200px;
        height: 280px;
        transform: rotate(6deg) translate(16px, 8px);
      }

      .uaden-catalog-book {
        width: 195px;
        height: 285px;
        padding: 1.2rem 1rem;
      }

      .uaden-catalog-book__content strong {
        font-size: 1.45rem;
      }

      .uaden-catalog-book__content strong span {
        font-size: 1.65rem;
      }

      .uaden-catalog-content h2 {
        font-size: 1.85rem;
      }

      .uaden-catalog-content > p {
        font-size: .9rem;
      }

      .uaden-catalog-benefits li {
        font-size: .88rem;
      }

      .uaden-catalog-btn {
        width: 100%;
        text-align: center;
      }
    }
  `;

  document.head.appendChild(style);

  // Crear Toast Flotante
  const toast = document.createElement("div");
  toast.id = "uadenCatalogToast";
  toast.className = "uaden-catalog-toast";
  toast.setAttribute("role", "button");
  toast.setAttribute("tabindex", "0");
  toast.setAttribute("aria-label", "Ver catálogo completo de cursos");

  toast.innerHTML = `
    <span class="uaden-catalog-toast__icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </span>
    <span>
      <strong>¿Buscas otra formación?</strong>
      <small>Conoce nuestro catálogo completo de cursos. Haz clic aquí.</small>
    </span>
    <button class="uaden-catalog-toast__close" aria-label="Cerrar aviso">×</button>
  `;

  // Crear Modal
  const modal = document.createElement("div");
  modal.className = "uaden-catalog-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "uadenCatalogModalTitle");

  modal.innerHTML = `
    <div class="uaden-catalog-modal__box">
      <!-- Ondas vectoriales idénticas al banner original -->
      <svg class="uaden-catalog-modal__waves" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-100,0 C320,120 480,420 920,240 C1220,110 1380,180 1540,120 L1540,520 L-100,520 Z" fill="url(#uadenModalWave1)" opacity="0.4" />
        <path d="M-50,520 C240,340 620,480 1020,220 C1260,80 1400,150 1540,90 L1540,0 L-50,0 Z" fill="url(#uadenModalWave2)" opacity="0.3" />
        <path d="M650,0 C880,160 1140,80 1520,240 L1520,0 Z" fill="url(#uadenModalWave3)" opacity="0.2" />
        <defs>
          <linearGradient id="uadenModalWave1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#023b7a" />
            <stop offset="100%" stop-color="#0459b0" />
          </linearGradient>
          <linearGradient id="uadenModalWave2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stop-color="#001738" />
            <stop offset="100%" stop-color="#07488f" />
          </linearGradient>
          <linearGradient id="uadenModalWave3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#006cd8" />
            <stop offset="100%" stop-color="#002b66" />
          </linearGradient>
        </defs>
      </svg>

      <button class="uaden-catalog-modal__close" aria-label="Cerrar catálogo">×</button>

      <!-- ================= VISUAL / LIBRO 3D ================= -->
      <div class="uaden-catalog-mockup">
        <div class="uaden-catalog-book__backdrop"></div>

        <div class="uaden-catalog-book">
          <div class="uaden-catalog-book__pages-top"></div>
          <div class="uaden-catalog-book__pages-side"></div>

          <div class="uaden-catalog-book__shapes">
            <div class="uaden-shape-yellow"></div>
            <div class="uaden-shape-cyan"></div>
            <div class="uaden-shape-mask"></div>
          </div>

          <div class="uaden-catalog-book__brand">
            <svg viewBox="0 0 160 48" class="uaden-brand-svg">
              <text x="2" y="30" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="1">UADEN</text>
              <path d="M30,21 Q85,7 138,21" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <text x="68" y="42" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8.5" font-weight="800" fill="#aee0ff" letter-spacing="3.5">GLOBAL</text>
            </svg>
          </div>

          <div class="uaden-catalog-book__content">
            <strong>CATÁLOGO<br><span>GLOBAL</span></strong>
            <small>Formaciones y programas de training</small>
            <em>EDICIÓN 2026-2027</em>
          </div>
        </div>
      </div>

      <!-- ================= CONTENIDO DERECHO ================= -->
      <div class="uaden-catalog-content">
        <h2 id="uadenCatalogModalTitle">
          Encuentra la formación que puede impulsar tu próximo paso.
        </h2>

        <p>
          Conoce nuestra oferta internacional de programas ejecutivos, capacitaciones InCompany y entrenamientos diseñados para profesionales y organizaciones.
        </p>

        <ul class="uaden-catalog-benefits">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Programas y diplomados internacionales</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Soluciones de capacitación empresarial</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Oferta global 2026-2027 en un solo documento</span>
          </li>
        </ul>

        <a
          class="uaden-catalog-btn"
          href="${catalogUrl}"
          download="Catalogo de Formaciones y Programas de Training 2027 Uaden Prime.pdf"
          target="_blank"
          rel="noopener"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <polyline points="9 15 12 18 15 15"></polyline>
          </svg>
          <span>Ver y descargar el catálogo completo</span>
        </a>
      </div>
    </div>
  `;

  document.body.append(toast, modal);

  // Reposicionar el toast en caso de que exista botón flotante de WhatsApp
  function positionCatalogToast() {
    const candidates = [
      ...document.querySelectorAll(`
        .whatsapp-fab,
        .whatsapp-button,
        .whatsapp-btn,
        .btn-whatsapp,
        a[href*="wa.me"],
        a[href*="whatsapp.com"]
      `)
    ];

    const whatsappButton = candidates.find((element) => {
      const elementStyle = window.getComputedStyle(element);
      return elementStyle.position === "fixed";
    });

    if (!whatsappButton) {
      toast.style.bottom = "2rem";
      return;
    }

    const whatsappRect = whatsappButton.getBoundingClientRect();
    const bottomPosition = window.innerHeight - whatsappRect.top + 16;
    toast.style.bottom = `${Math.max(32, bottomPosition)}px`;
  }

  const openModal = () => {
    modal.classList.add("open");
    modal.querySelector(".uaden-catalog-modal__close").focus();
  };

  const closeModal = () => {
    modal.classList.remove("open");
    if (document.body.contains(toast)) {
      toast.focus();
    }
  };

  toast.addEventListener("click", (event) => {
    if (event.target.closest(".uaden-catalog-toast__close")) {
      toast.remove();
      return;
    }
    openModal();
  });

  toast.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  });

  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      event.target.closest(".uaden-catalog-modal__close")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  positionCatalogToast();
  window.addEventListener("resize", positionCatalogToast);
  setTimeout(positionCatalogToast, 700);

  // Muestra el toast después de 4 segundos
  setTimeout(() => {
    toast.classList.add("show");
  }, 4000);
});
```