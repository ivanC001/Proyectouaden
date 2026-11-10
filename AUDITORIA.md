# Auditoría de landing pages

Alcance: portada y páginas estáticas. WordPress no se modificó y está excluido del repositorio, junto con old/, configuraciones privadas y datos de alumnos.

- Eliminados cuatro respaldos .bk/.bak.
- Eliminados ocho PDFs idénticos a copias conservadas, sin referencias detectadas en HTML, CSS, JavaScript o PHP de las landing pages.
- Eliminadas cuatro páginas de plantilla de franquicia no alcanzables desde su index.html.
- Los PDFs inspeccionados tenían cabecera PDF y marcador final; esta comprobación no sustituye una revisión visual de cada página.
- Corregido el video de ejemplo inexistente en disney/index.html, reutilizando un video existente.
- Corregida la configuración Apache de la portada: se eliminó la redirección a index.php inexistente.
- Corregidos foco, navegación con Tab y estado inactivo del diálogo de catálogo; habilitado desplazamiento en pantallas pequeñas.
- JavaScript principal y catálogo: verificación de sintaxis con node --check.

## Pendientes y límites

La plantilla heredada de franquicia contiene páginas de demostración enlazadas entre sí, con referencias a recursos ausentes. Se conservan las alcanzables para evitar romper navegación existente; requieren decisión editorial antes de retirarlas. La portada y las demás landing pages no presentaron referencias locales ausentes tras la corrección del video en la comprobación de atributos src/href.

No se ejecutó PHP, una prueba visual de navegador ni formularios SMTP. No se verificaron destinos externos. Este repositorio no contiene WordPress ni permite desplegar sus funciones. El historial anterior queda conservado únicamente en la rama local local/pre-limpieza; no publicarlo porque incluye configuraciones privadas y datos de registros.
