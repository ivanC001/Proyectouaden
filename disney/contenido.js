gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // Configuración para entradas desde la IZQUIERDA
    gsap.utils.toArray('.reveal-left').forEach(item => {
        gsap.from(item, {
            x: -150,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                // play reverse play reverse: hace que se mueva en ambas direcciones
                toggleActions: "play reverse play reverse"
            }
        });
    });

    // Configuración para entradas desde la DERECHA
    gsap.utils.toArray('.reveal-right').forEach(item => {
        gsap.from(item, {
            x: 150,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse"
            }
        });
    });

    // Fade suave para el título y descripción inicial
    gsap.from('.reveal-fade', {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
            trigger: '.header-section',
            start: "top 90%",
            toggleActions: "play reverse play reverse"
        }
    });
});