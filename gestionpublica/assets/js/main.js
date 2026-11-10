/* =====================================================================
   UADEN Global — Gestión Pública Municipal y Regional
   Interacciones de la landing: menú, cuenta regresiva, revelado,
   navegación activa y envío del formulario por WhatsApp.
   ===================================================================== */
(function () {
  'use strict';

  var WHATSAPP = '12232400531';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del pie ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var boton = document.getElementById('hamburguesa');
  var menu = document.getElementById('menu');

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
        boton.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }

  /* ---------- La barra se despega al hacer scroll ---------- */
  var barra = document.getElementById('nav');

  if (barra) {
    var fijada = false;
    var revisarBarra = function () {
      var debeFijarse = window.scrollY > 40;
      if (debeFijarse === fijada) return;
      fijada = debeFijarse;
      barra.classList.toggle('nav--fijo', fijada);
    };
    revisarBarra();
    window.addEventListener('scroll', revisarBarra, { passive: true });
  }

  /* ---------- Cuenta regresiva al cierre de la beca parcial ---------- */
  var LIMITE = new Date('2026-10-22T23:59:59-05:00').getTime(); // hora de Houston
  var cuenta = document.getElementById('cuenta');
  var campos = {
    dias: document.getElementById('cd-dias'),
    horas: document.getElementById('cd-horas'),
    min: document.getElementById('cd-min'),
    seg: document.getElementById('cd-seg')
  };

  function dosDigitos(n) { return n < 10 ? '0' + n : String(n); }

  function pintarCuenta() {
    if (!cuenta || !campos.dias) return;
    var resto = LIMITE - Date.now();

    if (resto <= 0) {
      cuenta.innerHTML =
        '<p class="sello__pie" style="grid-column:1/-1;margin:0">' +
        'La promoción de inscripción anticipada ha finalizado. ' +
        'Consulte con su asesor el valor vigente.</p>';
      var titulo = document.getElementById('sello-titulo');
      if (titulo) titulo.textContent = 'Promoción finalizada';
      return true;
    }

    var seg = Math.floor(resto / 1000);
    campos.dias.textContent = dosDigitos(Math.floor(seg / 86400));
    campos.horas.textContent = dosDigitos(Math.floor(seg % 86400 / 3600));
    campos.min.textContent = dosDigitos(Math.floor(seg % 3600 / 60));
    campos.seg.textContent = dosDigitos(seg % 60);
    return false;
  }

  if (cuenta && !pintarCuenta()) {
    var reloj = setInterval(function () {
      if (pintarCuenta()) clearInterval(reloj);
    }, 1000);
  }

  /* ---------- Revelado al hacer scroll ---------- */
  // El hero tiene su propia secuencia de entrada; aquí solo el resto de la página.
  var revelables = document.querySelectorAll('.seccion__interior > *, .cifra');

  if (reduce || !('IntersectionObserver' in window)) {
    // Sin animación: el contenido queda visible tal cual.
  } else {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

    Array.prototype.forEach.call(revelables, function (el) {
      // Lo que ya está en pantalla al cargar nunca se oculta.
      if (el.getBoundingClientRect().top < window.innerHeight - 40) return;
      el.classList.add('revelar');
      observador.observe(el);
    });

    // Red de seguridad: si algo quedara sin revelar, se muestra igualmente.
    window.setTimeout(function () {
      Array.prototype.forEach.call(
        document.querySelectorAll('.revelar:not(.visible)'),
        function (el) {
          var caja = el.getBoundingClientRect();
          if (caja.top < window.innerHeight && caja.bottom > 0) el.classList.add('visible');
        }
      );
    }, 1200);
  }

  /* ---------- Enlace activo en la navegación ---------- */
  var enlaces = document.querySelectorAll('.nav__menu a[href^="#"]');
  var secciones = [];

  Array.prototype.forEach.call(enlaces, function (a) {
    var destino = document.querySelector(a.getAttribute('href'));
    if (destino) secciones.push({ enlace: a, seccion: destino });
  });

  if (secciones.length && 'IntersectionObserver' in window) {
    var vigilante = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        secciones.forEach(function (par) {
          par.enlace.classList.toggle('activo', par.seccion === entrada.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach(function (par) { vigilante.observe(par.seccion); });
  }

  /* ---------- Formulario: abre WhatsApp con el mensaje listo ---------- */
  var formulario = document.getElementById('formulario');
  var error = document.getElementById('f-error');

  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = formulario.nombre.value.trim();
      var institucion = formulario.institucion.value.trim();
      var pais = formulario.pais.value.trim();
      var modalidad = formulario.modalidad.value;

      if (!nombre || !pais) {
        if (error) error.hidden = false;
        (nombre ? formulario.pais : formulario.nombre).focus();
        return;
      }
      if (error) error.hidden = true;

      var texto =
        'Hola, quiero información del Diplomado Internacional en Gestión Pública Municipal y Regional.\n' +
        'Nombre: ' + nombre + '\n' +
        (institucion ? 'Institución: ' + institucion + '\n' : '') +
        'País: ' + pais + '\n' +
        'Modalidad de interés: ' + modalidad;

      window.open(
        'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto),
        '_blank',
        'noopener'
      );
    });

    ['nombre', 'pais'].forEach(function (campo) {
      formulario[campo].addEventListener('input', function () {
        if (error) error.hidden = true;
      });
    });
  }
})();
