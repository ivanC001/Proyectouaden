# Actualización de HTML en Hostinger

## Alcance confirmado

La estructura remota coincide con la local: index.html es la landing principal y cada subcarpeta conserva su URL. Solo se actualizan archivos .html. CSS, JS, imágenes, PDF, PHP y .htaccess no se transfieren. Si un HTML requiere un recurso nuevo, primero debe aprobarse su publicación por separado.

La lista explícita de 25 directorios está en deploy/allowlist.json; index.html es el único archivo de raíz permitido. WordPress (campuss, preuaden, registro, uadenw y cualquier wp-admin/wp-content/wp-includes) queda excluido. El directorio compartido assets se mantiene localmente como dependencia, sin desplegarlo en este flujo.

## Estado seguro actual

.github/workflows/deploy-hostinger.yml ejecuta únicamente una simulación al hacer push a main o desde Actions > Run workflow. deploy/plan.mjs genera deploy-output/plan.json y muestra todos los HTML candidatos. No conecta a Hostinger, no utiliza credenciales, no borra archivos remotos y no activa despliegue real. El manifiesto enumera todos los HTML permitidos, no solo los modificados.

Existen páginas de demostración heredadas de franquicia entre esos candidatos. Antes del despliegue real debe aprobarse el manifiesto archivo por archivo y reducirse a los destinos que realmente se administrarán. No basta con que un archivo tenga el mismo nombre en el servidor para considerarlo propiedad del proyecto.

## Conectar Hostinger: fase posterior, pendiente

1. Confirmar en hPanel el dominio, la ruta absoluta de public_html, el plan y la disponibilidad de SSH/SFTP. No introducir una ruta supuesta en allowlist.json.
2. Comparar mediante lectura el listado remoto con el manifiesto, verificar symlinks, rutas reales y qué instalaciones de WordPress hay en la raíz o en subdirectorios. Confirmar que index.html es la portada activa y que no se sustituye una portada WordPress.
3. Aprobar los destinos exactos. Mantener routesApproved=false y mode=dry-run-only hasta completar esta revisión. Cambiar esos campos por sí solo no habilita transferencias: el script las rechaza.
4. Crear una clave SSH exclusiva para despliegue; instalar solo la clave pública en la cuenta de Hostinger correspondiente. Nunca guardar la privada aquí.
5. En GitHub > Settings > Environments, crear hostinger-production con aprobación requerida si el plan lo permite. Guardar allí los secrets HOSTINGER_HOST, HOSTINGER_PORT, HOSTINGER_USER, HOSTINGER_SSH_KEY y HOSTINGER_KNOWN_HOSTS. Este último debe contener la clave de servidor contrastada por un canal confiable; no aceptar ciegamente ssh-keyscan.
6. Después de aprobar rutas, implementar un trabajo real protegido que lea el manifiesto, compruebe rutas remotas y copie cada HTML con SFTP/SSH. No usar --delete ni clonar el repositorio directamente en public_html. No subir .htaccess ni ejecutar PHP ni operaciones de base de datos.

Se recomienda Actions con manifiesto explícito y aprobación porque permite controlar cada destino y separar HTML de los demás archivos del repositorio. El despliegue Git nativo es más sencillo, pero trasladar este repositorio entero a public_html no respeta el alcance de solo HTML ni ofrece aquí las comprobaciones de destinos previstas. No se ha configurado ninguna de las dos alternativas para transferir archivos.

## Trabajo desde Windows / VS Code

Desde PowerShell:

```powershell
Set-Location -LiteralPath 'D:\ARCHIVO FUCAE\ProyectoUaden'
git pull --ff-only
# Editar HTML en VS Code; revisar cambios.
git diff -- marketing/index.html
# Añadir solo los archivos deseados; los nuevos HTML deben estar en Git para aparecer en el plan.
git add -- marketing/index.html
node deploy/plan.mjs
git commit -m "Actualizar landing de marketing"
git push origin main
```

El push activa únicamente la simulación. Revisar Actions > Hostinger - simulación de HTML > manifiesto. No publica el sitio todavía.

## Copia, comprobación y reversión del futuro despliegue

Antes de transferir: obtener una copia de cada HTML remoto que vaya a reemplazarse, su checksum y el identificador de commit; guardarlos fuera de public_html en una carpeta por ejecución, con permisos privados. Si un archivo no existe, anotarlo expresamente. No continuar si la copia falla. Esto debe quedar implementado y probado antes del primer despliegue real.

Después: verificar HTTP 200, portada, URLs secundarias, navegación móvil y referencias de recursos. Revisar que los sitios WordPress y sus checksums/configuraciones no cambiaron. Los enlaces relativos y recursos locales requieren nueva comprobación cuando se modifique un HTML; la revisión anterior está en AUDITORIA.md y no cubre el servidor real.

Para revertir: con aprobación, restaurar únicamente los HTML previamente reemplazados desde esa copia, comprobando sus rutas y checksums. Para archivos recién creados, no borrarlos automáticamente: resolver su retirada de forma explícita. git revert permite revertir el código, pero no recupera por sí solo el contenido que había en Hostinger antes del despliegue.

## Diagnóstico Git y tamaño

La rama main publicada contiene solo landing pages. El historial original local/pre-limpieza conserva el primer volcado con WordPress, respaldos y datos privados: no publicarlo. Ese volcado explica el paquete local de aproximadamente 3 GB y decenas de miles de objetos, aunque WordPress esté ignorado ahora. No se ha vuelto a reescribir el historial ni ejecutado push --force.

Las landing pages conservadas sumaban aproximadamente 1,1 GB: no había archivos mayores de 100 MiB. GitHub avisó por disney/assets/glb/disney_castle.glb (60,25 MB) y un video de Disney (54,57 MB). Una optimización futura puede mover videos/modelos a almacenamiento externo o Git LFS; cambiar archivos históricos requiere aprobación y una copia privada previa. No ejecutar limpieza de objetos ni borrar la rama de archivo mientras sea la única copia del historial original.

La eliminación local de las cuatro carpetas WordPress fue solicitada, pero el comando fue rechazado por la política automática. Permanecen excluidas del repositorio. El servidor no se modificó.

## Referencias oficiales

- SSH Hostinger: https://www.hostinger.com/support/1583645-how-to-enable-ssh-access-in-hostinger/
- Claves SSH Hostinger: https://www.hostinger.com/support/5634532-how-to-generate-ssh-keys-and-add-them-to-hostinger-dashboard/
- Secrets GitHub: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
