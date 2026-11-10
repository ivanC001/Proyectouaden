const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const mobileSticky = document.querySelector(".mobile-sticky");
const mobileQuery = window.matchMedia("(max-width: 980px)");

function updateMobileSticky() {
  if (!mobileSticky || !hero) return;

  const shouldShow = mobileQuery.matches && window.scrollY > hero.offsetHeight * 0.55;
  mobileSticky.classList.toggle("is-visible", shouldShow);
}

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
  updateMobileSticky();
});

window.addEventListener("resize", updateMobileSticky);
updateMobileSticky();

const animatedItems = document.querySelectorAll("[data-animate]");
const navCollapse = document.getElementById("mainNav");
const navToggler = document.querySelector(".navbar-toggler");
const hasBootstrapCollapse = () => Boolean(window.bootstrap?.Collapse);

if (navToggler && navCollapse && !hasBootstrapCollapse()) {
  navToggler.addEventListener("click", () => {
    const isOpen = navCollapse.classList.toggle("show");
    navToggler.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".navbar .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (!navCollapse) return;

    if (hasBootstrapCollapse()) {
      const instance = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
      instance.hide();
      return;
    }

    navCollapse.classList.remove("show");
    navToggler?.setAttribute("aria-expanded", "false");
  });
});

animatedItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index % 6, 5) * 70}ms`);
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

animatedItems.forEach(item => revealObserver.observe(item));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dustColors = ["#D4AF37", "#FF69B4", "#A569BD", "#50C0CF", "#ffffff"];
let lastDust = 0;

function createMagicDust(x, y, amount = 1) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement("span");
    const size = Math.random() * 4 + 3;
    const drift = (Math.random() - 0.5) * 90;
    const fall = Math.random() * 90 + 45;
    const duration = Math.random() * 0.75 + 0.8;
    const color = dustColors[Math.floor(Math.random() * dustColors.length)];

    particle.className = "magic-dust";
    particle.style.setProperty("--x", `${x + (Math.random() - 0.5) * 18}px`);
    particle.style.setProperty("--y", `${y + (Math.random() - 0.5) * 18}px`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--drift", `${drift}px`);
    particle.style.setProperty("--fall", `${fall}px`);
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--dust-color", color);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
  }
}

document.addEventListener("pointermove", event => {
  if (event.pointerType === "touch") return;

  const now = Date.now();
  if (now - lastDust < 70) return;

  lastDust = now;
  createMagicDust(event.clientX, event.clientY, 2);
});

const heroTitle = document.querySelector(".hero h1");

setInterval(() => {
  if (!heroTitle || prefersReducedMotion) return;

  const rect = heroTitle.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;

  const x = rect.left + Math.random() * rect.width;
  const y = rect.top + Math.random() * rect.height;
  createMagicDust(x, y, 6);
}, 900);

const countdown = document.querySelector(".countdown");

function updateCountdown() {
  if (!countdown) return;

  const deadline = new Date(countdown.dataset.deadline).getTime();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  if (!daysEl || !hoursEl || !minutesEl) return;

  const diff = Math.max(0, deadline - Date.now());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 60000);
