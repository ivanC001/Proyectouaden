document.getElementById('form-diplomado').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const btn = form.querySelector('button');
    const originalText = btn.innerText;

    // Cambiar estado del botón
    btn.disabled = true;
    btn.innerText = "Enviando magia...";

    const formData = new FormData(form);

    fetch('enviar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("¡Gracias! Tu solicitud ha sido enviada con éxito.");
            form.reset(); // Limpia el formulario
        } else {
            alert("Vaya, algo salió mal. Inténtalo de nuevo.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error de conexión. Revisa tu internet.");
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = originalText;
    });
});