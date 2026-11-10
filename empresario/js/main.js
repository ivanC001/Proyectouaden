const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const quoteText = document.querySelector("[data-quote]");
const quoteCount = document.querySelector("[data-quote-count]");
const quotePrev = document.querySelector("[data-quote-prev]");
const quoteNext = document.querySelector("[data-quote-next]");
const leadForm = document.querySelector("[data-lead-form]");
const formNote = document.querySelector("[data-form-note]");
const submitButton = document.querySelector("[data-submit-button]");
const submitLabel = document.querySelector("[data-submit-label]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * CONFIGURACION PARA PRODUCCION
 * 1. Confirma la URL publica del backend.
 * 2. Reemplaza landingKey por la clave de una landing activa en el CRM.
 * 3. Si esa landing exige producto, completa catalogoItemId Y catalogoToken.
 *    Si no usa catalogo, deja catalogoItemId en null y catalogoToken vacio.
 * 4. Envia X-Idempotency-Key en cada solicitud y reutilizala al reintentar el mismo payload.
 * El catalogoToken es un token publico para landings; no agregues aqui JWT ni secretos privados.
 */
const CRM_LEAD_CONFIG = Object.freeze({
  endpoint: "https://azurion.tech/api/v1/public/forms",
  landingKey: "lnd_7kv4Xd0mz5wEP5mF696ltaQUVMy7kE2H4yZUIoQ17t4",
  catalogoItemId: null,
  catalogoToken: "",
  campania: "De Cero a Empresario",
  canalIngreso: "LANDING",
  interesPrincipal: "Seminario De Cero a Empresario México 2026"
});

const TRACKING_PARAMETER_NAMES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid"
];

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "aria-hidden": "true"
    }
  });
}

const quotes = [
  "La riqueza comienza cuando decides pensar como empresario.",
  "El mejor momento para construir tu empresa es antes que tu competencia.",
  "No trabajes toda tu vida por dinero. Haz que el dinero trabaje para ti.",
  "Cada gran empresa comenzó con una decisión valiente.",
  "Las oportunidades no aparecen. Se crean.",
  "Tu futuro financiero depende más de tus decisiones que de la economía.",
  "Emprender sin método cuesta años. Con método puede cambiar tu vida.",
  "El conocimiento solo vale cuando produce resultados.",
  "Deja de buscar seguridad. Comienza a construir libertad.",
  "Tu próximo cliente está esperando una solución que todavía no has creado.",
  "Los empresarios exitosos no improvisan. Ejecutan sistemas.",
  "El patrimonio se construye creando valor de manera constante.",
  "Hoy puedes seguir sobreviviendo o empezar a construir riqueza.",
  "Cada día que postergas tu proyecto también postergas tu libertad.",
  "Dentro de cinco años agradecerás haber comenzado hoy."
];

let quoteIndex = 0;

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
}

function renderQuote() {
  if (!quoteText || !quoteCount) return;
  quoteText.textContent = quotes[quoteIndex];
  quoteCount.textContent = `${String(quoteIndex + 1).padStart(2, "0")} / ${quotes.length}`;

  if (!prefersReducedMotion && typeof quoteText.animate === "function") {
    quoteText.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 320, easing: "ease-out" }
    );
  }
}

function moveQuote(direction) {
  quoteIndex = (quoteIndex + direction + quotes.length) % quotes.length;
  renderQuote();
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });
}

const revealTargets = document.querySelectorAll([
  ".section-heading",
  ".venue-card",
  ".rich-copy",
  ".copy-stack",
  ".method-image",
  ".method-content",
  ".objective-grid article",
  ".audience-copy",
  ".audience-card",
  ".audience-proof",
  ".reason-list li",
  ".module-card",
  ".speaker-photo",
  ".speaker-copy",
  ".benefit-grid article",
  ".certificate-panel",
  ".quote-card",
  ".price-card",
  ".registration-grid > *",
  ".world-grid > *",
  ".team-box",
  ".footer-grid > *"
].join(","));

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
});

document.body.classList.add("motion-ready");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -10%",
    threshold: 0.08
  });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

if (quotePrev && quoteNext) {
  quotePrev.addEventListener("click", () => moveQuote(-1));
  quoteNext.addEventListener("click", () => moveQuote(1));
  renderQuote();
}

if (leadForm) {
  const phoneInput = leadForm.elements.telefono;
  const emailInput = leadForm.elements.correo;
  let isSubmitting = false;
  let pendingSubmission = null;

  const createIdempotencyKey = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
  };

  const validateContact = () => {
    const hasContact = Boolean(phoneInput.value.trim() || emailInput.value.trim());
    const message = hasContact ? "" : "Indica un teléfono o un correo electrónico.";
    phoneInput.setCustomValidity(message);
    emailInput.setCustomValidity(message);
    return hasContact;
  };

  const setFormState = (state, message) => {
    if (!formNote) return;
    formNote.dataset.state = state;
    formNote.textContent = message;
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);
    submitButton.setAttribute("aria-busy", String(isSubmitting));
    if (submitLabel) {
      submitLabel.textContent = isSubmitting ? "Enviando..." : "Enviar solicitud";
    }
  };

  const getConfigurationError = () => {
    if (!CRM_LEAD_CONFIG.endpoint || !CRM_LEAD_CONFIG.landingKey) {
      return "El formulario todavía no está configurado para producción.";
    }

    const hasCatalogoItem = Number.isInteger(CRM_LEAD_CONFIG.catalogoItemId);
    const hasCatalogoToken = Boolean(CRM_LEAD_CONFIG.catalogoToken.trim());
    if (hasCatalogoItem !== hasCatalogoToken) {
      return "La configuración del producto está incompleta.";
    }

    return "";
  };

  const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMetadataJson = () => {
    const query = new URLSearchParams(window.location.search);
    const metadata = {};

    TRACKING_PARAMETER_NAMES.forEach((parameterName) => {
      const value = query.get(parameterName)?.trim();
      if (value) {
        metadata[parameterName] = value;
      }
    });

    if (document.referrer) {
      metadata.referrer = document.referrer;
    }

    return JSON.stringify(metadata);
  };

  phoneInput.addEventListener("input", validateContact);
  emailInput.addEventListener("input", validateContact);

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    validateContact();
    if (!leadForm.reportValidity()) {
      setFormState("error", "Revisa los campos obligatorios antes de continuar.");
      return;
    }

    const configurationError = getConfigurationError();
    if (configurationError) {
      console.error(configurationError, CRM_LEAD_CONFIG);
      setFormState("error", `${configurationError} Contáctanos por WhatsApp.`);
      return;
    }

    const data = new FormData(leadForm);
    const nombre = data.get("nombre")?.toString().trim() || "";
    const correo = data.get("correo")?.toString().trim() || "";
    const telefono = data.get("telefono")?.toString().trim() || "";
    const ciudad = data.get("ciudad")?.toString().trim() || "";
    const empresa = data.get("empresa")?.toString().trim() || "";
    const mensaje = data.get("mensaje")?.toString().trim() || "";
    const website = data.get("website")?.toString().trim() || "";

    const mensajeCompleto = [
      "Interés en el seminario De Cero a Empresario México 2026.",
      ciudad ? `Sede seleccionada: ${ciudad}.` : "",
      mensaje ? `Mensaje: ${mensaje}` : ""
    ].filter(Boolean).join("\n");

    const payload = {
      nombre,
      email: correo,
      telefono,
      empresa,
      direccion: ciudad,
      campania: CRM_LEAD_CONFIG.campania,
      landingUrl: window.location.href.split("#")[0],
      mensaje: mensajeCompleto,
      canalIngreso: CRM_LEAD_CONFIG.canalIngreso,
      interesPrincipal: CRM_LEAD_CONFIG.interesPrincipal,
      interesDetalle: mensaje || `Sede seleccionada: ${ciudad}.`,
      fechaInteres: getLocalDate(),
      website,
      metadataJson: getMetadataJson()
    };

    if (Number.isInteger(CRM_LEAD_CONFIG.catalogoItemId) && CRM_LEAD_CONFIG.catalogoToken.trim()) {
      payload.catalogoItemId = CRM_LEAD_CONFIG.catalogoItemId;
      payload.catalogoToken = CRM_LEAD_CONFIG.catalogoToken.trim();
    }

    const requestBody = JSON.stringify(payload);
    if (!pendingSubmission || pendingSubmission.body !== requestBody) {
      pendingSubmission = {
        body: requestBody,
        idempotencyKey: createIdempotencyKey()
      };
    }

    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 15000);

    isSubmitting = true;
    setSubmitting(true);
    setFormState("info", "Estamos registrando tu solicitud...");

    try {
      const submissionEndpoint = `${CRM_LEAD_CONFIG.endpoint}/${encodeURIComponent(CRM_LEAD_CONFIG.landingKey)}/submissions`;
      const response = await fetch(submissionEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Idempotency-Key": pendingSubmission.idempotencyKey
        },
        body: pendingSubmission.body,
        signal: controller.signal
      });

      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("CRM lead rejected", response.status, responseData);
        throw new Error("crm-rejected");
      }

      pendingSubmission = null;
      leadForm.reset();
      validateContact();
      setFormState("success", "Solicitud enviada correctamente. Nuestro equipo se pondrá en contacto contigo.");
    } catch (error) {
      const message = error.name === "AbortError"
        ? "La solicitud tardó demasiado. Verifica tu conexión e inténtalo nuevamente."
        : "No pudimos enviar la solicitud. Inténtalo nuevamente o contáctanos por WhatsApp.";
      setFormState("error", message);
    } finally {
      window.clearTimeout(requestTimeout);
      isSubmitting = false;
      setSubmitting(false);
    }
  });
}
