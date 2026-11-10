/**
 * CONFERENCISTA PRO® - INTERACTIVE CLIENT SCRIPT
 * High-performance UI interactions, counters, scroll animations & FAQ
 */

document.addEventListener("DOMContentLoaded", () => {
  // Reusable animated geometric art for every content section.
  document
    .querySelectorAll(".section-light-motion, .section-kinetic-dark")
    .forEach((section, sectionIndex) => {
      const artLayer = document.createElement("div");
      artLayer.className = "section-kinetic-art";
      artLayer.setAttribute("aria-hidden", "true");

      ["purple", "blue", "yellow", "cyan"].forEach((color, shapeIndex) => {
        const bar = document.createElement("span");
        bar.className = `kinetic-bar kinetic-bar-${shapeIndex + 1} kinetic-${color}`;
        bar.style.animationDelay = `${-((sectionIndex + shapeIndex) % 5)}s`;
        artLayer.appendChild(bar);
      });

      ["yellow", "purple"].forEach((color, shapeIndex) => {
        const orb = document.createElement("span");
        orb.className = `kinetic-orb kinetic-orb-${shapeIndex + 1} kinetic-${color}`;
        orb.style.animationDelay = `${-((sectionIndex + shapeIndex + 2) % 6)}s`;
        artLayer.appendChild(orb);
      });

      section.prepend(artLayer);
    });

  // Official WhatsApp Target
  const whatsappBaseUrl =
    "https://wa.me/12232400531?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Diplomado%20Internacional%20Conferencista%20Pro";

  // Assign WhatsApp URLs
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = whatsappBaseUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Mobile Navigation Drawer
  const menuBtn = document.querySelector(".menu-button");
  const mainNav = document.querySelector(".main-nav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    mainNav.querySelectorAll("a").forEach((navLink) => {
      navLink.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  // FAQ Accordion
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const parentItem = trigger.closest(".faq-item");
      const isAlreadyOpen = parentItem.classList.contains("is-open");

      // Close all items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("is-open");
        const btn = item.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      // Toggle clicked item
      if (!isAlreadyOpen) {
        parentItem.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Smooth Animated Number Counter
  const counters = document.querySelectorAll(".js-counter");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runCounter(el) {
    const target = Number.parseInt(el.getAttribute("data-count") || "0", 10);
    if (prefersReducedMotion || Number.isNaN(target)) {
      el.textContent = String(target);
      return;
    }

    const duration = 1600; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease Out Quart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.round(target * easeOut);

      el.textContent = currentVal.toLocaleString("es-ES");

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target.toLocaleString("es-ES");
      }
    }

    requestAnimationFrame(updateCount);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => runCounter(c));
  }

  // Hero typewriter: communicates multiple outcomes in the space of one line.
  const typewriter = document.querySelector("[data-typewriter]");
  if (typewriter) {
    const phrases = (typewriter.dataset.typewriter || "")
      .split("|")
      .map((phrase) => phrase.trim())
      .filter(Boolean);

    if (phrases.length) {
      if (prefersReducedMotion) {
        typewriter.textContent = phrases[0];
      } else {
        let phraseIndex = 0;
        let characterIndex = phrases[0].length;
        let deleting = false;

        const animateTypewriter = () => {
          const phrase = phrases[phraseIndex];

          if (!deleting && characterIndex < phrase.length) {
            characterIndex += 1;
            typewriter.textContent = phrase.slice(0, characterIndex);
            window.setTimeout(animateTypewriter, 58);
            return;
          }

          if (!deleting && characterIndex === phrase.length) {
            deleting = true;
            window.setTimeout(animateTypewriter, 1450);
            return;
          }

          if (deleting && characterIndex > 0) {
            characterIndex -= 1;
            typewriter.textContent = phrase.slice(0, characterIndex);
            window.setTimeout(animateTypewriter, 30);
            return;
          }

          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(animateTypewriter, 220);
        };

        window.setTimeout(animateTypewriter, 1450);
      }
    }
  }

  // Infinite proof ribbon. The clone is decorative and hidden from assistive tech.
  document.querySelectorAll(".proof-ticker-track").forEach((track) => {
    const group = track.querySelector(".proof-ticker-group");
    if (!group || track.children.length > 1) return;

    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  // Accessible content carousel with keyboard, touch and responsive page sizes.
  document.querySelectorAll("[data-content-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector(".content-carousel-viewport");
    const slides = Array.from(carousel.querySelectorAll(".content-carousel-slide"));
    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const status = carousel.querySelector(".content-carousel-status");
    if (!viewport || !slides.length || !previousButton || !nextButton || !status) return;

    let currentIndex = 0;
    let scrollFrame = 0;
    const getPerView = () => (window.innerWidth >= 992 ? 2 : 1);

    const renderCarouselState = () => {
      const perView = getPerView();
      const finalVisible = Math.min(currentIndex + perView, slides.length);
      status.textContent = currentIndex + 1 === finalVisible
        ? `Jornada ${finalVisible} de ${slides.length}`
        : `Jornadas ${currentIndex + 1}–${finalVisible} de ${slides.length}`;
      previousButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex >= slides.length - perView;
    };

    const moveCarousel = (requestedIndex, smooth = true) => {
      const perView = getPerView();
      const maximumIndex = Math.max(0, slides.length - perView);
      currentIndex = Math.max(0, Math.min(requestedIndex, maximumIndex));
      viewport.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: smooth && !prefersReducedMotion ? "smooth" : "auto",
      });
      renderCarouselState();
    };

    previousButton.addEventListener("click", () => {
      moveCarousel(currentIndex - getPerView());
    });

    nextButton.addEventListener("click", () => {
      moveCarousel(currentIndex + getPerView());
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCarousel(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCarousel(currentIndex + 1);
      }
    });

    viewport.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const nearestSlide = slides.reduce((nearest, slide, index) => {
          const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
          return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: 0, distance: Number.POSITIVE_INFINITY });
        currentIndex = Math.min(nearestSlide.index, slides.length - getPerView());
        renderCarouselState();
      });
    }, { passive: true });

    window.addEventListener("resize", () => moveCarousel(currentIndex, false));
    moveCarousel(0, false);
  });

  // Native accessible modal for the compact program overview.
  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dialog = document.getElementById(trigger.dataset.modalOpen || "");
      if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
    });
  });

  document.querySelectorAll(".program-modal").forEach((dialog) => {
    dialog.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // Set Current Year in Footer
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
