const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const links = document.querySelector(".navlinks");
const navItems = [...document.querySelectorAll(".navlinks a")];
const heroImage = document.querySelector(".hero-bg");

const closeMenu = () => {
  if (!menu || !links) return;
  links.classList.remove("open");
  menu.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir men\u00fa");
  document.body.classList.remove("menu-open");
};

if (menu && links) {
  menu.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    menu.classList.toggle("is-open", isOpen);
    menu.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-label", isOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa");
    document.body.classList.toggle("menu-open", isOpen);
  });
}

navItems.forEach((item) => item.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const metric = entry.target;
    const target = Number(metric.dataset.count || 0);
    const duration = 900;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      metric.textContent = Math.round(target * progress).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(metric);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach((metric) => countObserver.observe(metric));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -52%" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const countdown = document.querySelector("[data-countdown]");
if (countdown) {
  const startDate = new Date("2026-08-08T08:00:00-05:00");
  const today = new Date();
  const diff = startDate.getTime() - today.getTime();
  const days = Math.max(0, Math.ceil(diff / 86400000));
  countdown.textContent = days ? days.toString() : "Hoy";
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (heroImage && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      heroImage.style.transform = `scale(1.03) translateY(${Math.min(y * 0.035, 20)}px)`;
    }
    ticking = false;
  });
}, { passive: true });
