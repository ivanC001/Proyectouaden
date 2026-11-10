/* --- AÑADIR AL FINAL DE TU JS SIN CAMBIAR LO ANTERIOR --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Buscamos la sección que queremos decorar (ya existente)
    const sectionToDecorate = document.getElementById('quince-razones-modelo');

    // Si la sección no existe, abortamos (seguridad de ingeniería)
    if (!sectionToDecorate) {
        console.warn("Dante: No encontré la sección #quince-razones-modelo para decorar.");
        return;
    }

    // 2. Definimos las ubicaciones exactas (estimadas de image_9.png)
    // Coordenadas top/left son porcentuales respecto al tamaño de la sección.
    const scribblesData = [
        { id: 'gif-top-left', src: 'assets/gif/viaductk-celebration-19390.gif', top: '15%', left: '8%', width: '300px' },
        { id: 'gif-top-right', src: 'assets/img/15_razones/mickey-2-removebg-preview.png', top: '25%', left: '90%', width: '400px' },
        { id: 'gif-top-mid', src: 'assets/gif/ha_nguyen_monslide365-firework-7791_512.gif', top: '1%', left: '45%', width: '800px' },
        { id: 'gif-bottom-left', src: 'assets/img/15_razones/descarga-removebg-preview (1).png', top: '80%', left: '10%', width: '300px' },
        { id: 'gif-bottom-right', src: 'assets/img/15_razones/descarga-removebg-preview.png', top: '90%', left: '90%', width: '400px' }
        
        
        // Agrega más si hay más dibujos que me salté
    ];

    // 3. Creamos e inyectamos cada elemento
    scribblesData.forEach(data => {
        const watermarkElement = document.createElement('div');
        watermarkElement.id = data.id;
        watermarkElement.className = 'floating-watermark'; // relies on new CSS rule

        // Aplicamos los estilos de posicionamiento y tamaño específicos
        watermarkElement.style.top = data.top;
        watermarkElement.style.left = data.left;
        watermarkElement.style.width = data.width;
        watermarkElement.style.height = 'auto'; // maintain aspect ratio
        watermarkElement.style.aspectRatio = '1 / 1'; // placeholders as squares, adjust as needed

        // Si es GIF o Imagen, lo cargamos como background-image (mejor para stack)
        watermarkElement.style.backgroundImage = `url('${data.src}')`;

        // 4. Inyectamos al final de la sección, JS lo pondrá DETRÁS del contenido real
        // gracias a z-index 0 vs z-index 2 del contenido.
        sectionToDecorate.appendChild(watermarkElement);
    });
});