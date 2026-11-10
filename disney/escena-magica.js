// Registramos el plugin ScrollTrigger para que GSAP pueda "ver" el scroll
gsap.registerPlugin(ScrollTrigger);

// Usamos DOMContentLoaded para asegurarnos de que el HTML está listo antes de animar
document.addEventListener("DOMContentLoaded", () => {
    
    // Configuración base para las animaciones
    const tlSettings = {
        ease: "power2.out", // Transición suave y elegante
        duration: 1.2       // Tiempo de la animación
    };

    // 1. Animación de Cabecera (Título e Introducción)
    gsap.from("#perfil-objetivo-v2 .header-section", {
        scrollTrigger: {
            trigger: "#perfil-objetivo-v2 .header-section",
            start: "top 80%", // Empieza cuando la cabecera está al 80% de la ventana
            toggleActions: "play none none none" // Se ejecuta solo una vez al bajar
        },
        opacity: 0,     // Empieza invisible
        y: 50,          // Pequeño deslizamiento hacia arriba
        ...tlSettings    // Aplicamos la configuración base
    });

    // 2. Animación Escalonada de las Tarjetas (Perfil y Objetivo)
    // Usamos 'stagger' para que aparezcan una tras otra
    gsap.from("#perfil-objetivo-v2 .dual-layout .magic-card", {
        scrollTrigger: {
            trigger: "#perfil-objetivo-v2 .dual-layout",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 100,
        stagger: 0.4, // Retraso de 0.4s entre cada tarjeta
        duration: 1.4,
        ease: "back.out(1.5)" // Efecto de rebote suave al final
    });

    // 3. Animación en Cascada de la Rejilla de Razones (Staggered Grid)
    // Esto crea un efecto "ripple" (onda) muy chulo
    gsap.from("#perfil-objetivo-v2 .reasons-grid .reason-tag", {
        scrollTrigger: {
            trigger: "#perfil-objetivo-v2 .reasons-grid",
            start: "top 70%",
            toggleActions: "play none none none"
        },
        scale: 0.6, // Empieza un poco más pequeña
        opacity: 0,
        duration: 0.5,
        stagger: {
            grid: "auto", // Detecta automáticamente la rejilla
            from: "edges", // La animación empieza desde los bordes hacia el centro
            amount: 1.2    // Tiempo total para que todas las etiquetas aparezcan
        },
        ease: "power2.out"
    });

    // 4. Animación de Frase de Oro Final
    gsap.from("#perfil-objetivo-v2 .gold-footer", {
        scrollTrigger: {
            trigger: "#perfil-objetivo-v2 .gold-footer",
            start: "top 85%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power4.out" // Una aparición más dramática y nítida
    });

});

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Animamos los encabezados de bloque
    gsap.utils.toArray('.block-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 90%",
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // 2. Animamos los círculos (Efecto escala)
    gsap.from(".circle-item", {
        scrollTrigger: {
            trigger: ".circles-row",
            start: "top 80%",
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // 3. Animamos los listados horizontales (Efecto cascada lateral)
    gsap.from(".list-item", {
        scrollTrigger: {
            trigger: ".list-item",
            start: "top 85%",
        },
        x: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power1.out"
    });

});

