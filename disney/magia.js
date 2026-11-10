document.addEventListener('mousemove', function(e) {
  // Creamos el elemento del brillo
  const sparkle = document.createElement('div');
  sparkle.className = 'magic-dust';
  
  // Posicionamos en las coordenadas del mouse
  sparkle.style.left = e.pageX + 'px';
  sparkle.style.top = e.pageY + 'px';

  // Tamaño aleatorio entre 2px y 8px
  const size = Math.random() * 8 + 2;
  sparkle.style.width = size + 'px';
  sparkle.style.height = size + 'px';

  document.body.appendChild(sparkle);

  // Como buen ingeniero, gestionamos la memoria: 
  // Eliminamos el elemento después de que termine la animación
  setTimeout(() => {
    sparkle.remove();
  }, 1000); 
});

