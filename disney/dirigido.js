gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Animación de los 4 cuadrantes
    gsap.from(".audience-item", {
        scrollTrigger: {
            trigger: ".audience-grid",
            start: "top 80%",
            toggleActions: "play reverse play reverse"
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });

    // Animación de la lista estratégica (Izquierda/Derecha)
    gsap.from(".reveal-left", {
        scrollTrigger: {
            trigger: ".strategic-list",
            start: "top 85%"
        },
        x: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });

    gsap.from(".reveal-right", {
        scrollTrigger: {
            trigger: ".strategic-list",
            start: "top 85%"
        },
        x: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });

    // Fade para los insights
    gsap.from(".reveal-fade", {
        scrollTrigger: {
            trigger: ".reveal-fade",
            start: "top 90%"
        },
        opacity: 0,
        scale: 0.9,
        duration: 1
    });
});