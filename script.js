const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".benefits-grid, .faculties-grid, .program-list, .testimonials-grid").forEach((group) => {
  group.querySelectorAll("[data-reveal]").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  });
});

const counters = document.querySelectorAll(".count-up");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounter(counter) {
  const target = Number(counter.dataset.count || 0);
  if (prefersReducedMotion) {
    counter.textContent = String(target);
    return;
  }

  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.8 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

const heroVisual = document.querySelector(".hero-visual");

if (heroVisual && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty("--tilt-x", `${x * 3.5}deg`);
    heroVisual.style.setProperty("--tilt-y", `${y * -3.5}deg`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

const testimonialsCarousel = document.querySelector("[data-testimonials-carousel]");

if (testimonialsCarousel) {
  const viewport = testimonialsCarousel.querySelector(".testimonials-viewport");
  const track = testimonialsCarousel.querySelector(".testimonials-grid");
  const slides = Array.from(track.querySelectorAll("blockquote"));
  const previousButton = testimonialsCarousel.querySelector(".carousel-button-prev");
  const nextButton = testimonialsCarousel.querySelector(".carousel-button-next");
  const dotsContainer = testimonialsCarousel.querySelector(".carousel-dots");
  const status = testimonialsCarousel.querySelector(".carousel-status");
  let currentSlide = 0;
  let autoPlayId = null;
  let touchStartX = 0;

  testimonialsCarousel.tabIndex = 0;

  slides.forEach((slide, index) => {
    slide.setAttribute("aria-label", `Testimonio ${index + 1} de ${slides.length}`);
  });

  function visibleSlides() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1060) return 2;
    return 3;
  }

  function maximumSlide() {
    return Math.max(0, slides.length - visibleSlides());
  }

  function updateCarousel(announce = true) {
    const maxSlide = maximumSlide();
    currentSlide = Math.min(Math.max(currentSlide, 0), maxSlide);
    const slideOffset = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
    track.style.transform = `translate3d(${-currentSlide * slideOffset}px, 0, 0)`;

    Array.from(dotsContainer.children).forEach((dot, index) => {
      const isActive = index === currentSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (announce) {
      status.textContent = `Mostrando el testimonio ${currentSlide + 1} de ${slides.length}`;
    }
  }

  function buildDots() {
    dotsContainer.replaceChildren();

    for (let index = 0; index <= maximumSlide(); index += 1) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir al testimonio ${index + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateCarousel();
        restartAutoPlay();
      });
      dotsContainer.append(dot);
    }
  }

  function goNext() {
    currentSlide = currentSlide >= maximumSlide() ? 0 : currentSlide + 1;
    updateCarousel();
  }

  function goPrevious() {
    currentSlide = currentSlide <= 0 ? maximumSlide() : currentSlide - 1;
    updateCarousel();
  }

  function stopAutoPlay() {
    if (!autoPlayId) return;
    window.clearInterval(autoPlayId);
    autoPlayId = null;
  }

  function startAutoPlay() {
    if (prefersReducedMotion || slides.length <= visibleSlides()) return;
    stopAutoPlay();
    autoPlayId = window.setInterval(goNext, 5200);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  previousButton.addEventListener("click", () => {
    goPrevious();
    restartAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    goNext();
    restartAutoPlay();
  });

  testimonialsCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
      restartAutoPlay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      restartAutoPlay();
    }
  });

  testimonialsCarousel.addEventListener("mouseenter", stopAutoPlay);
  testimonialsCarousel.addEventListener("mouseleave", startAutoPlay);
  testimonialsCarousel.addEventListener("focusin", stopAutoPlay);
  testimonialsCarousel.addEventListener("focusout", (event) => {
    if (!testimonialsCarousel.contains(event.relatedTarget)) startAutoPlay();
  });

  viewport.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      stopAutoPlay();
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) {
        if (distance < 0) goNext();
        else goPrevious();
      }
      startAutoPlay();
    },
    { passive: true }
  );

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildDots();
      updateCarousel(false);
      restartAutoPlay();
    }, 120);
  });

  buildDots();
  updateCarousel(false);
  startAutoPlay();
}
