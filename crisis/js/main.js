"use strict";

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const moduleButtons = document.querySelectorAll(".module-toggle");
const teamButtons = document.querySelectorAll(".team-options button");
const threatButtons = document.querySelectorAll(".threat-pill");
const discountValue = document.getElementById("discount-value");
const leadForm = document.getElementById("lead-form");
const currentYear = document.getElementById("current-year");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 36);
};

const closeMenu = () => {
  navToggle.classList.remove("active");
  mainNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("menu-open");
};

navToggle.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("open");
  navToggle.classList.toggle("active", willOpen);
  mainNav.classList.toggle("open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentModule = button.closest(".module");
    const isOpen = currentModule.classList.contains("is-open");

    document.querySelectorAll(".module").forEach((module) => {
      module.classList.remove("is-open");
      module.querySelector(".module-toggle").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      currentModule.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const priceElement = document.querySelector(".main-price strong");
const basePrice = 249;

teamButtons.forEach((button) => {
  button.addEventListener("click", () => {
    teamButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const discount = parseInt(button.dataset.discount, 10);
    discountValue.textContent = `${discount}%`;
    if (priceElement) {
      const discountedPrice = Math.round(basePrice * (1 - discount / 100));
      priceElement.textContent = discountedPrice;
    }
  });
});

threatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    threatButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!leadForm.reportValidity()) {
    return;
  }

  const data = new FormData(leadForm);
  const message = [
    "Hola, deseo información sobre el Diplomado de Gestión Integral de Crisis (Doble Titulación / 2da Fase).",
    "",
    `Nombre: ${data.get("nombre")}`,
    `País: ${data.get("pais")}`,
    `Institución: ${data.get("institucion")}`,
    `Correo: ${data.get("email")}`,
    `WhatsApp: ${data.get("telefono")}`
  ].join("\n");

  const whatsappUrl = `https://wa.me/12232400531?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

currentYear.textContent = new Date().getFullYear();
