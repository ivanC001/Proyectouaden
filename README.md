# Proyectouaden

Sitio UADEN: portada estática, páginas de programas e instalaciones WordPress independientes.

## Despliegue

Publicar en la raíz de un servidor Apache con PHP y mod_rewrite. La portada es `index.html`; no necesita compilación. Las páginas de programas usan sus propios recursos. GitHub almacena el código; GitHub Pages no ejecuta PHP ni WordPress.

WordPress: `campuss/`, `preuaden/`, `registro/` y `uadenw/`. Cada instalación requiere su base de datos, configuración privada `wp-config.php` y las dependencias de sus plugins. Las bases de datos, contraseñas, registros de alumnos y archivos `.private` se conservan fuera del repositorio. Configurarlos en el servidor antes de habilitar esos sitios.

## Mantenimiento

Consultar `AUDITORIA.md`. No eliminar recursos de distintos programas solo porque tienen el mismo contenido: sus rutas pueden estar enlazadas. Los folletos de programas se conservan salvo evidencia de duplicación sin referencias o corrupción. No subir respaldos, archivos de configuración privada ni datos de alumnos.
