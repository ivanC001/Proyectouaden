const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const counters = document.querySelectorAll("[data-count]");
const magicDustLayer = document.querySelector(".magic-dust-layer");

navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("site-nav-open");
  navToggle.classList.toggle("nav-open");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("site-nav-open");
    navToggle?.classList.remove("nav-open");
  });
});

document.querySelectorAll("[data-delay]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay}ms`);
});

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("site-header-scrolled", window.scrollY > 24);
});

const magicColors = ["#d4af37", "#ff69b4", "#a569bd", "#50c0cf", "#ffffff"];

const createMagicParticle = () => {
  if (!magicDustLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const magicArea = document
    .elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.72)
    ?.closest(".hero-section, .magic-dark-section, .disney-gallery-section, .site-footer");

  if (!magicArea) {
    magicDustLayer.querySelectorAll(".magic-particle").forEach((particle) => particle.remove());
    return;
  }

  const particle = document.createElement("span");
  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight - Math.random() * 160;
  const color = magicColors[Math.floor(Math.random() * magicColors.length)];

  particle.className = "magic-particle";
  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  particle.style.color = color;
  particle.style.background = color;
  particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
  particle.style.setProperty("--duration", `${1.8 + Math.random() * 1.6}s`);

  magicDustLayer.appendChild(particle);
  setTimeout(() => particle.remove(), 3600);
};

setInterval(() => {
  for (let i = 0; i < 3; i += 1) createMagicParticle();
}, 520);
