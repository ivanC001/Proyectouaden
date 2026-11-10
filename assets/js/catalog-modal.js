document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("uadenCatalogToast")) return;

  const catalogUrl =
    "/assets/pdf/Catalogo%20de%20Formaciones%20y%20Programas%20de%20Training%202027%20Uaden%20Prime%20%288%29.pdf";

  // Cambia esta ruta solo si tu logo está en otra carpeta.
  const logoUrl = "/assets/logos/logo-white.png";

  const style = document.createElement("style");
  style.id = "uadenCatalogModalStyles";

  style.textContent = `
    .uaden-catalog-toast {
      position: fixed;
      z-index: 99990;
      right: 2rem;
      bottom: 2rem;
      display: flex;
      align-items: center;
      gap: .85rem;
      width: min(390px, calc(100vw - 2rem));
      padding: 1rem;
      color: #fff;
      background: linear-gradient(135deg, #082d57, #0b71bd);
      border: 1px solid rgba(125, 211, 252, .45);
      border-radius: 16px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, .3);
      cursor: pointer;
      opacity: 0;
      transform: translateX(130%);
      transition:
        transform .55s cubic-bezier(.18, .89, .32, 1.28),
        opacity .3s ease;
    }

    .uaden-catalog-toast.show {
      opacity: 1;
      transform: translateX(0);
    }

    .uaden-catalog-toast__icon {
      display: grid;
      flex: 0 0 46px;
      width: 46px;
      height: 46px;
      place-items: center;
      color: #082d57;
      background: #f7bd11;
      border-radius: 50%;
      font-size: 1.45rem;
      font-weight: 900;
    }

    .uaden-catalog-toast strong,
    .uaden-catalog-toast small {
      display: block;
    }

    .uaden-catalog-toast strong {
      font-family: Arial, sans-serif;
      font-size: .96rem;
    }

    .uaden-catalog-toast small {
      margin-top: .25rem;
      color: #d9f3ff;
      font-family: Arial, sans-serif;
      font-size: .78rem;
      line-height: 1.35;
    }

    .uaden-catalog-toast__close {
      align-self: flex-start;
      margin-left: auto;
      padding: 0;
      color: #fff;
      background: transparent;
      border: 0;
      cursor: pointer;
      font-size: 1.15rem;
      line-height: 1;
    }

    .uaden-catalog-modal {
      position: fixed;
      z-index: 99999;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background: rgba(1, 10, 24, .8);
      backdrop-filter: blur(10px);
      opacity: 0;
      pointer-events: none;
      transition: opacity .28s ease;
    }

    .uaden-catalog-modal.open {
      opacity: 1;
      pointer-events: auto;
    }

    .uaden-catalog-modal__box {
      position: relative;
      display: grid;
      grid-template-columns: 270px minmax(0, 1fr);
      gap: 2.2rem;
      width: min(820px, calc(100vw - 3rem));
      max-height: calc(100vh - 4rem);
      overflow: auto;
      color: #fff;
      background:
        radial-gradient(circle at 97% 5%, rgba(56, 189, 248, .18), transparent 23%),
        radial-gradient(circle at 70% 110%, rgba(125, 211, 252, .12), transparent 30%),
        linear-gradient(120deg, #061b35 0%, #0b4779 58%, #075da4 100%);
      border: 1px solid rgba(125, 211, 252, .25);
      border-radius: 24px;
      box-shadow: 0 34px 90px rgba(0, 0, 0, .56);
      transform: translateY(25px) scale(.97);
      transition: transform .28s ease;
    }

    .uaden-catalog-modal.open .uaden-catalog-modal__box {
      transform: translateY(0) scale(1);
    }

    .uaden-catalog-modal__close {
      position: absolute;
      z-index: 5;
      top: .9rem;
      right: .9rem;
      display: grid;
      width: 36px;
      height: 36px;
      place-items: center;
      color: #fff;
      background: rgba(255, 255, 255, .1);
      border: 1px solid rgba(255, 255, 255, .22);
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
    }

    .uaden-catalog-brand {
      position: relative;
      display: flex;
      align-self: center;
      overflow: hidden;
      flex-direction: column;
      min-height: 390px;
      margin-left: -1.15rem;
      padding: 1.5rem;
      color: #fff;
      background:
        radial-gradient(circle at 84% 45%, #19afe1 0 23%, transparent 23.5%),
        radial-gradient(circle at 112% 46%, #f7bd11 0 29%, transparent 29.5%),
        radial-gradient(circle at 38% 38%, transparent 0 28%, rgba(0, 0, 0, .22) 28.5% 34%, transparent 34.5%),
        linear-gradient(145deg, #061d3a, #0d6cc7);
      border: 1px solid rgba(255, 255, 255, .36);
      border-radius: 8px 20px 20px 8px;
      box-shadow:
        15px 12px 0 #f7bd11,
        23px 20px 0 rgba(247, 189, 17, .35),
        -16px 22px 35px rgba(0, 0, 0, .42);
      transform: perspective(900px) rotateY(10deg) rotateZ(-4deg);
    }

    .uaden-catalog-brand::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 12px;
      content: "";
      background: linear-gradient(90deg, rgba(0, 0, 0, .38), transparent);
    }

    .uaden-catalog-brand__logo {
      position: relative;
      z-index: 1;
      width: min(145px, 72%);
      height: auto;
      object-fit: contain;
    }

    .uaden-catalog-brand__tag {
      position: relative;
      z-index: 1;
      margin-top: 2.4rem;
      color: #a8eaff;
      font-family: Arial, sans-serif;
      font-size: .62rem;
      font-weight: 900;
      letter-spacing: .11em;
    }

    .uaden-catalog-brand h3 {
      position: relative;
      z-index: 1;
      margin: .65rem 0;
      font-family: Georgia, serif;
      font-size: 3rem;
      line-height: .8;
    }

    .uaden-catalog-brand h3 span {
      color: #f7bd11;
    }

    .uaden-catalog-brand p {
      position: relative;
      z-index: 1;
      max-width: 180px;
      margin: auto 0 0;
      color: #ddf5ff;
      font-family: Arial, sans-serif;
      font-size: .75rem;
      line-height: 1.45;
    }

    .uaden-catalog-brand__edition {
      position: relative;
      z-index: 1;
      display: inline-block;
      width: fit-content;
      margin-top: 1rem;
      padding: .38rem .55rem;
      color: #082d57;
      background: #f7bd11;
      font-family: Arial, sans-serif;
      font-size: .65rem;
      font-weight: 900;
      letter-spacing: .08em;
    }

    .uaden-catalog-content {
      min-height: 0;
      overflow-y: auto;
      padding: 2.3rem 2.8rem 2.3rem 0;
    }

    .uaden-catalog-modal__eyebrow {
      color: #7dd3fc;
      font-family: Arial, sans-serif;
      font-size: .7rem;
      font-weight: 900;
      letter-spacing: .1em;
    }

    .uaden-catalog-content h2 {
      max-width: 460px;
      margin: .65rem 0 .9rem;
      color: #fff;
      font-family: Georgia, serif;
      font-size: clamp(2rem, 3.4vw, 2.85rem);
      line-height: 1.04;
    }

    .uaden-catalog-content > p {
      max-width: 480px;
      margin: 0;
      color: #d5e9f6;
      font-family: Arial, sans-serif;
      font-size: .91rem;
      line-height: 1.55;
    }

    .uaden-catalog-benefits {
      display: grid;
      gap: .55rem;
      padding: 0;
      margin: 1.3rem 0 1.5rem;
      list-style: none;
    }

    .uaden-catalog-benefits li {
      display: flex;
      align-items: center;
      gap: .6rem;
      color: #f2fbff;
      font-family: Arial, sans-serif;
      font-size: .83rem;
      font-weight: 700;
    }

    .uaden-catalog-benefits li::before {
      display: grid;
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      place-items: center;
      color: #f7bd11;
      content: "✓";
      border: 1px solid rgba(247, 189, 17, .75);
      border-radius: 50%;
      font-size: .7rem;
    }

    .uaden-catalog-modal__footer {
      display: flex;
      align-items: center;
      gap: .85rem;
      margin-top: auto;
    }

    .uaden-catalog-modal__download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: .6rem;
      padding: .88rem 1rem;
      color: #082d57;
      background: #f7bd11;
      border-radius: 5px;
      box-shadow: 0 12px 26px rgba(0, 0, 0, .18);
      font-family: Arial, sans-serif;
      font-size: .82rem;
      font-weight: 900;
      text-decoration: none;
      transition: transform .2s ease;
    }

    .uaden-catalog-modal__download:hover {
      color: #082d57;
      transform: translateY(-2px);
    }

    .uaden-catalog-modal__meta {
      color: #b8d7e9;
      font-family: Arial, sans-serif;
      font-size: .63rem;
      line-height: 1.4;
    }

    @media (max-width: 720px) {
      .uaden-catalog-modal {
        padding: 1rem;
      }

      .uaden-catalog-toast {
        right: 1rem;
      }

      .uaden-catalog-modal__box {
        grid-template-columns: 1fr;
        gap: 0;
        width: min(460px, 100%);
        max-height: 90vh;
        overflow-y: auto;
      }

      .uaden-catalog-brand {
        min-height: 205px;
        margin: 0;
        padding: 1.35rem;
        border-radius: 20px 20px 0 0;
        box-shadow: none;
        transform: none;
      }

      .uaden-catalog-brand__tag {
        margin-top: 1rem;
      }

      .uaden-catalog-brand h3 {
        margin: .45rem 0;
        font-size: 2.35rem;
      }

      .uaden-catalog-brand p {
        display: none;
      }

      .uaden-catalog-content {
        overflow: visible;
        padding: 1.6rem;
      }

      .uaden-catalog-content h2 {
        font-size: 2rem;
      }

      .uaden-catalog-modal__footer {
        align-items: stretch;
        flex-direction: column;
      }

      .uaden-catalog-modal__download {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);

  const toast = document.createElement("div");
  toast.id = "uadenCatalogToast";
  toast.className = "uaden-catalog-toast";
  toast.setAttribute("role", "button");
  toast.setAttribute("tabindex", "0");
  toast.setAttribute("aria-label", "Ver catálogo completo de cursos");

  toast.innerHTML = `
    <span class="uaden-catalog-toast__icon">↓</span>
    <span>
      <strong>¿Buscas otra formación?</strong>
      <small>Conoce nuestro catálogo completo de cursos. Haz clic aquí.</small>
    </span>
    <button class="uaden-catalog-toast__close" aria-label="Cerrar aviso">×</button>
  `;

  const modal = document.createElement("div");
  modal.className = "uaden-catalog-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "uadenCatalogModalTitle");

  modal.inert = true;

  modal.innerHTML = `
    <div class="uaden-catalog-modal__box">
      <button class="uaden-catalog-modal__close" aria-label="Cerrar catálogo">×</button>

      <aside class="uaden-catalog-brand">
        <img
          class="uaden-catalog-brand__logo"
          src="${logoUrl}"
          alt="UADEN Global"
        >

        <span class="uaden-catalog-brand__tag">
          FORMACIONES INTERNACIONALES
        </span>

        <h3>CATÁLOGO<br><span>PRIME</span></h3>

        <p>
          Programas, diplomados y soluciones de capacitación para impulsar
          el talento profesional y organizacional.
        </p>

        <span class="uaden-catalog-brand__edition">EDICIÓN 2027</span>
      </aside>

      <div class="uaden-catalog-content">
        <span class="uaden-catalog-modal__eyebrow">
          UADEN PRIME · FORMACIÓN GLOBAL
        </span>

        <h2 id="uadenCatalogModalTitle">
          Encuentra la formación que puede impulsar tu próximo paso.
        </h2>

        <p>
          Descubre nuestra oferta internacional de programas ejecutivos,
          diplomados y capacitaciones InCompany diseñadas para personas,
          equipos y organizaciones.
        </p>

        <ul class="uaden-catalog-benefits">
          <li>Programas y diplomados internacionales</li>
          <li>Capacitación empresarial e InCompany</li>
          <li>Oferta global de formación 2027</li>
        </ul>

        <div class="uaden-catalog-modal__footer">
          <a
            class="uaden-catalog-modal__download"
            href="${catalogUrl}"
            download="Catalogo de Formaciones y Programas de Training 2027 Uaden Prime.pdf"
          >
            ↓ Ver y descargar el catálogo
          </a>

          <span class="uaden-catalog-modal__meta">
            Documento PDF<br>
            Oferta global UADEN Prime 2027
          </span>
        </div>
      </div>
    </div>
  `;

  document.body.append(toast, modal);

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

  let previousFocus = null;
  const openModal = () => {
    previousFocus = document.activeElement;
    modal.inert = false;
    modal.classList.add("open");
    modal.querySelector(".uaden-catalog-modal__close").focus();
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.inert = true;
    if (previousFocus?.isConnected) previousFocus.focus();

    if (!previousFocus?.isConnected && document.body.contains(toast)) {
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
    if (event.target !== toast) return;
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
    if (event.key === "Tab" && modal.classList.contains("open")) {
      const items = modal.querySelectorAll("button, a[href]");
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  positionCatalogToast();
  window.addEventListener("resize", positionCatalogToast);
  setTimeout(positionCatalogToast, 700);

  setTimeout(() => {
    toast.classList.add("show");
  }, 7000);
});