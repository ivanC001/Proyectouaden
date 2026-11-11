# Rediseño de UADEN

Portada institucional en `index.html` y `styles.css`, conservando marca, contenido y destinos existentes. Footer convertido en directorio temático con contacto y campus. Estilos anteriores acumulados sustituidos por una hoja unificada responsive.

`social-alerts.js` conserva exactamente su registro y estructura originales. Los 150 HTML versionados cargan ese script y `catalog-modal.js` una sola vez. WhatsApp y sus destinos específicos no se modifican. El catálogo conserva el PDF existente; se mejoró el foco del diálogo, el control de apertura y la coordinación de los avisos en móvil.

## Verificación

- Navegador Edge en 375, 1280, 1440 y 1920 px: sin desbordamiento horizontal, imágenes rotas ni errores JavaScript en portada.
- Catálogo: apertura, foco contenido en diálogo y cierre con Escape. Menú móvil comprobado.
- Avisos y catálogo sin superposición entre sí en los cuatro tamaños.
- Education, Crisis Brasil, Franquicia y Restaurante: una instancia de cada interacción.
- Análisis estático: los 35 destinos originales y 14 hooks de scripts conservados. No se añadieron cifras ni testimonios.
- Sintaxis JavaScript y espacios del diff comprobados. Revisión visual independiente y correcciones aplicadas.

## Publicación pendiente

No se ha modificado Hostinger ni WordPress. El workflow sigue en simulación de HTML. Para publicar este diseño deberán incluirse también `styles.css` y `assets/js/catalog-modal.js` en una transferencia aprobada; publicar solo HTML no instala el nuevo diseño. No se amplió automáticamente el alcance del despliegue.

Se detectaron cambios simultáneos en archivos de Restaurante fuera del rediseño; no se modificaron ni revirtieron desde esta tarea.
