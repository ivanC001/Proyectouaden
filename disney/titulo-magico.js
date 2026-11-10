document.addEventListener("DOMContentLoaded", function() {
    const title = document.querySelector('.main-title-walt');
    
    // Verificamos que el título exista para evitar errores de consola
    if (!title) return;

    const text = title.textContent.trim();
    const letters = text.split("");
    
    title.textContent = ""; // Limpiamos el título original
    
    letters.forEach((letter, i) => {
        const span = document.createElement("span");
        // Si es un espacio, usamos el espacio de no ruptura para que no se colapse
        span.textContent = letter === " " ? "\u00A0" : letter; 
        
        // Retraso de animación incremental (0.15s por letra)
        span.style.animationDelay = `${i * 0.15}s`; 
        
        title.appendChild(span);
    });
});