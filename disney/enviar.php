<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = strip_tags(trim($_POST["nombre"] ?? ""));
    $apellidos = strip_tags(trim($_POST["apellidos"] ?? ""));
    $email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $prefijo = strip_tags(trim($_POST["country-code"] ?? ""));
    $telefono = strip_tags(trim($_POST["telefono"] ?? ""));

    $destinatarios = "ivancalderonburga@gmail.com";
    $asunto = "✨ Nueva Solicitud de Información: Diplomado Disney";

    $contenido = "Has recibido una nueva solicitud desde la Landing Page:\n\n";
    $contenido .= "Nombre Completo: $nombre $apellidos\n";
    $contenido .= "Correo: $email\n";
    $contenido .= "Teléfono: $prefijo $telefono\n";
    $contenido .= "Enviado el: " . date("d/m/Y H:i:s") . "\n";

    $headers = "From: Uaden Landing <no-reply@uaden.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($destinatarios, $asunto, $contenido, $headers)) {
        http_response_code(200);
        echo "¡Mensaje enviado con éxito!";
    } else {
        http_response_code(500);
        echo "Hubo un error al enviar el correo.";
    }

} else {
    http_response_code(403);
    echo "Acceso no permitido.";
}
?>