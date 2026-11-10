(() => {
  "use strict";

  const header = document.querySelector("#site-header");
  const progress = document.querySelector(".scroll-progress span");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");

  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    header?.classList.toggle("scrolled", scrollY > 24);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, percentage)}%`;
  };

  const closeMenu = () => {
    menuButton?.classList.remove("active");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Abrir menú");
    mobileNav?.classList.remove("open");
    mobileNav?.setAttribute("aria-hidden", "true");
    if (mobileNav) mobileNav.inert = true;
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = !mobileNav?.classList.contains("open");
    menuButton.classList.toggle("active", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
    mobileNav?.classList.toggle("open", willOpen);
    mobileNav?.setAttribute("aria-hidden", String(!willOpen));
    if (mobileNav) mobileNav.inert = !willOpen;
    document.body.classList.toggle("menu-open", willOpen);
  });

  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1260) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item?.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("is-open");
        faq.querySelector("button")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item?.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -25px" }
    );
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  document.querySelector("#interest-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const country = String(data.get("country") || "").trim();
    const profile = String(data.get("profile") || "").trim();
    const message = [
      "Hola, quiero iniciar mi inscripción al Diplomado Internacional en Startups y Microemprendimientos.",
      "",
      `Nombre: ${name}`,
      `País: ${country}`,
      `Etapa: ${profile}`,
    ].join("\n");

    window.open(`https://wa.me/5511930331168?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /*
   * Rotating alerts contain verified program facts. They intentionally avoid
   * invented names, reservations or simulated live activity.
   */
  const toast = document.querySelector("#social-proof-toast");
  const toastText = document.querySelector("#toast-text");
  const toastKicker = document.querySelector("#toast-kicker");
  const toastIcon = document.querySelector("#toast-icon");
  const toastClose = document.querySelector(".toast-close");

  const programAlerts = [
    {
      kicker: "Próximo inicio",
      title: "01 de septiembre.",
      detail: "Las inscripciones están abiertas.",
      icon: "bi-calendar-check",
      tone: "sky",
    },
    {
      kicker: "Acceso educativo",
      title: "Programa académico sin costo.",
      detail: "La donación a FUCAE es completamente voluntaria.",
      icon: "bi-unlock-fill",
      tone: "gold",
    },
    {
      kicker: "Modalidad flexible",
      title: "Clases online en vivo.",
      detail: "También tendrás acceso a las grabaciones.",
      icon: "bi-play-btn-fill",
      tone: "navy",
    },
    {
      kicker: "Respaldo internacional",
      title: "Doble certificación.",
      detail: "Acredita las competencias desarrolladas en el programa.",
      icon: "bi-patch-check-fill",
      tone: "sky",
    },
    {
      kicker: "Formación intensiva",
      title: "8 semanas de aprendizaje.",
      detail: "Herramientas aplicables desde el primer día.",
      icon: "bi-lightning-charge-fill",
      tone: "gold",
    },
    {
      kicker: "Experiencia global",
      title: "Más de 80 expertos.",
      detail: "Perspectivas de múltiples países e industrias.",
      icon: "bi-globe-americas",
      tone: "navy",
    },
    {
      kicker: "Acompañamiento",
      title: "¿Tienes alguna duda?",
      detail: "Un asesor puede orientarte directamente por WhatsApp.",
      icon: "bi-whatsapp",
      tone: "sky",
    },
  ];

  let alertIndex = 0;
  let alertTimer;
  let hideTimer;
  let dismissed = false;
  let hovering = false;

  const renderAlert = (alert) => {
    if (!toast || !toastText || !toastKicker || !toastIcon) return;
    toast.dataset.tone = alert.tone;
    toastKicker.textContent = alert.kicker;
    toastIcon.className = `bi ${alert.icon}`;
    toastText.replaceChildren();

    const strong = document.createElement("strong");
    strong.className = "toast-highlight";
    strong.textContent = `${alert.title} `;
    toastText.append(strong, document.createTextNode(alert.detail));
  };

  const showNextAlert = () => {
    if (dismissed || hovering || !toast) return;
    renderAlert(programAlerts[alertIndex]);
    toast.classList.add("is-visible");
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (!hovering) toast.classList.remove("is-visible");
    }, 6000);
    alertIndex = (alertIndex + 1) % programAlerts.length;
  };

  if (toast) {
    renderAlert(programAlerts[0]);
    toast.addEventListener("mouseenter", () => { hovering = true; });
    toast.addEventListener("mouseleave", () => {
      hovering = false;
      hideTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
    });
    toastClose?.addEventListener("click", () => {
      dismissed = true;
      toast.classList.remove("is-visible");
      clearInterval(alertTimer);
      clearTimeout(hideTimer);
    });

    window.setTimeout(() => {
      showNextAlert();
      alertTimer = window.setInterval(showNextAlert, 11000);
    }, 2200);
  }

  /* Interactive light follows the pointer across institutional cards. */
  document.querySelectorAll(".institution-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });
})();
