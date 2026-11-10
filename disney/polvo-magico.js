document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('pricing-title');
    const container = document.getElementById('magic-dust-container');

    // Variables de configuración de la magia
    const particleCount = 100; // Cuántas motas crear por ráfaga
    const spawnInterval = 100; // Milisegundos entre cada creación (más bajo = más denso)
    
    // Obtener colores de tus variables CSS
    const styles = getComputedStyle(document.documentElement);
    const goldColor = styles.getPropertyValue('--disney-gold').trim() || '#D4AF37';
    const pinkColor = styles.getPropertyValue('--pixie-pink').trim() || '#FF69B4';

    function createMagicDust() {
        // Necesitamos saber el ancho y posición del título para que el polvo salga de él
        const rect = titleElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Creamos múltiples partículas a la vez para efecto cascada
        for (let i = 0; i < 5; i++) { // 5 partículas por ciclo
            const particle = document.createElement('span');
            particle.className = 'magic-particle';

            // 1. Color aleatorio (Dorado o Rosado)
            const color = Math.random() > 0.5 ? goldColor : pinkColor;
            particle.style.color = color; // currentColor en CSS lo usará para box-shadow
            particle.style.background = color;

            // 2. Tamaño aleatorio (entre 2px y 6px)
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // 3. Posición horizontal aleatoria dentro del título
            const randomX = Math.random() * rect.width;
            particle.style.left = `${rect.left - containerRect.left + randomX}px`;
            
            // Posición vertical (nace justo debajo del texto)
            particle.style.top = `${rect.bottom - containerRect.top - (rect.height / 2)}px`;

            // 4. Variables CSS aleatorias para la animación (JS -> CSS)
            // Distancia de caída (entre 100px y 300px)
            const fallDistance = Math.random() * 200 + 100;
            particle.style.setProperty('--fall-distance', `${fallDistance}px`);
            
            // Duración de la caída (entre 1s y 2.5s)
            const duration = Math.random() * 1.5 + 1;
            particle.style.setProperty('--fall-duration', `${duration}s`);

            // Deriva horizontal aleatoria (para que no caigan rectas, +/- 30px)
            const drift = (Math.random() - 0.5) * 60;
            particle.style.setProperty('--drift', `${drift}px`);

            container.appendChild(particle);

            // 5. Limpieza: Eliminar la partícula cuando termine la animación para ahorrar memoria
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }
    }

    // Iniciar la cascada mágica constante
    setInterval(createMagicDust, spawnInterval);
});