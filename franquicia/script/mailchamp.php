<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(403);
	echo json_encode([
		'status' => 0,
		'msg' => 'Acceso no permitido.'
	]);
	exit;
}

$email = isset($_POST['dzEmail']) ? trim(strip_tags($_POST['dzEmail'])) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
	echo json_encode([
		'status' => 0,
		'msg' => 'Por favor ingresa un correo electrónico válido.'
	]);
	exit;
}

$destinatarios = 'administracion@uaden.com';
$asunto = 'Nueva solicitud de información - Uaden Prime';
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'No disponible';

$contenido = "Has recibido una nueva solicitud desde el sitio web.\n\n";
$contenido .= "Correo: {$email}\n";
$contenido .= "Fecha: " . date('d/m/Y H:i:s') . "\n";
$contenido .= "Origen: {$referer}\n";

$headers = "From: Uaden Prime <no-reply@uaden.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($destinatarios, $asunto, $contenido, $headers)) {
	echo json_encode([
		'status' => 1,
		'msg' => 'Tu solicitud fue enviada correctamente.'
	]);
	exit;
}

http_response_code(500);
echo json_encode([
	'status' => 0,
	'msg' => 'No se pudo enviar el correo. Inténtalo nuevamente.'
]);
