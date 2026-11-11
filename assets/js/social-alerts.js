function initUadenSocialAlerts() {
  if (document.querySelector(".global-social-alert")) return;
  const registrations = [
    "<strong>Lic. Roberto M.</strong> de México acaba de reservar su cupo.",
    "<strong>Dra. Sofía G.</strong> de Argentina se unió a MUNICIPAL PRO™.",
    "<strong>Ing. Carlos T.</strong> de Colombia completó su pre-inscripción.",
    "<strong>Dra. Elena V.</strong> de Chile confirmó su asistencia al Campus Live.",
    "<strong>Dr. Fernando P.</strong> de Perú reservó su plaza profesional.",
    "<strong>Lic. Mariana R.</strong> de Ecuador solicitó información sobre la certificación.",
    "<strong>Mg. Andrés L.</strong> de Guatemala inició su proceso de inscripción.",
    "<strong>Dra. Valeria C.</strong> de Uruguay confirmó su participación.",
    "<strong>Ing. Sebastián M.</strong> de Panamá reservó su lugar en el programa.",
    "<strong>Lic. Andrea F.</strong> de Costa Rica se registró para recibir información.",
    "<strong>Dr. Mauricio G.</strong> de Bolivia completó su pre-registro.",
    "<strong>Mg. Patricia S.</strong> de República Dominicana solicitó acceso al brochure.",
    "<strong>Ing. Daniel R.</strong> de Paraguay confirmó su interés en MUNICIPAL PRO™.",
    "<strong>Lic. Camila T.</strong> de Honduras reservó su cupo internacional.",
    "<strong>Dr. Ricardo A.</strong> de México inició su proceso de inscripción.",
    "<strong>Mg. Fernanda B.</strong> de Colombia solicitó información sobre el Campus Digital.",
    "<strong>Ing. Jorge V.</strong> de Perú confirmó su participación en las jornadas intensivas.",
    "<strong>Lic. Natalia P.</strong> de Argentina reservó su plaza profesional.",
    "<strong>Dra. Gabriela M.</strong> de Chile se registró para la certificación.",
    "<strong>Ing. Alejandro C.</strong> de Ecuador completó su pre-inscripción.",
    "<strong>Lic. Sergio D.</strong> de México solicitó información sobre fechas y horarios.",
    "<strong>Mg. Paola H.</strong> de Colombia confirmó su participación en MUNICIPAL PRO™.",
    "<strong>Dr. Javier E.</strong> de Guatemala reservó su lugar.",
    "<strong>Lic. Ana Lucía R.</strong> de Perú solicitó información sobre la certificación oficial.",
    "<strong>Ing. Martín S.</strong> de Uruguay inició su registro.",
    "<strong>Dra. Claudia V.</strong> de Ecuador confirmó su interés en el Campus Live.",
    "<strong>Lic. Felipe N.</strong> de Chile completó su solicitud de información.",
    "<strong>Mg. Verónica T.</strong> de Panamá reservó su plaza.",
    "<strong>Dr. Luis C.</strong> de Bolivia solicitó información sobre MUNICIPAL 2030 Digital Campus.",
    "<strong>Ing. Mariana P.</strong> de Costa Rica se unió al proceso de admisión.",
    "<strong>Lic. Diego A.</strong> de Argentina confirmó su asistencia.",
    "<strong>Dra. Lorena G.</strong> de México reservó su cupo profesional.",
    "<strong>Mg. Carlos F.</strong> de Perú solicitó detalles sobre el Implementation Day.",
    "<strong>Ing. Carolina M.</strong> de Colombia completó su pre-inscripción.",
    "<strong>Lic. Andrés V.</strong> de Chile solicitó información sobre los 73 expertos internacionales.",
    "<strong>Dra. Silvia P.</strong> de Ecuador confirmó su interés en la certificación.",
    "<strong>Mg. Roberto C.</strong> de Guatemala reservó su plaza internacional.",
    "<strong>Lic. Gabriela L.</strong> de Paraguay inició su proceso de registro.",
    "<strong>Ing. Fernando R.</strong> de México solicitó información sobre el programa completo.",
    "<strong>Dra. Mónica S.</strong> de Perú confirmó su participación en MUNICIPAL PRO™."
  ];

  const style = document.createElement("style");
  style.textContent = `
    .global-social-alert {
      position: fixed;
      z-index: 99999;
      bottom: 2rem;
      left: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: min(580px, calc(100vw - 2rem));
      padding: 1rem 1.4rem;
      color: #fff;
      background: rgba(4, 18, 36, .96);
      border: 1px solid rgba(56, 189, 248, .4);
      border-radius: 18px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, .45);
      backdrop-filter: blur(16px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(24px);
      transition: transform .4s ease-out, opacity .4s ease-out, visibility .4s;
    }

    .global-social-alert.show {
      opacity: 1; visibility: visible;
      transform: translateY(0);
    }

    .global-social-alert__icon {
      display: grid;
      flex: 0 0 52px;
      width: 52px;
      height: 52px;
      place-items: center;
      color: #041224;
      font-size: 1.3rem;
      font-weight: 900;
      background: #38bdf8;
      border-radius: 50%;
    }

    .global-social-alert__text {
      color: #f8fafc;
      font-family: Arial, sans-serif;
      font-size: clamp(.9rem, 2.5vw, 1.05rem);
      line-height: 1.4;
    }

    .global-social-alert__text strong {
      color: #38bdf8;
    }

    @media (prefers-reduced-motion: reduce) { .global-social-alert { transition: none; } }
    @media (max-width: 576px) {
      .global-social-alert {
        right: 1rem;
        bottom: 1rem;
        left: 1rem;
        padding: .9rem 1rem;
      }

      .global-social-alert__icon {
        flex-basis: 44px;
        width: 44px;
        height: 44px;
      }
    }
  `;

  document.head.appendChild(style);

  const alert = document.createElement("div");
  alert.className = "global-social-alert";
  alert.setAttribute("role", "status");
  alert.setAttribute("aria-live", "polite");

  alert.innerHTML = `
    <div class="global-social-alert__icon">✓</div>
    <div class="global-social-alert__text"></div>
  `;

  document.body.appendChild(alert);

  const text = alert.querySelector(".global-social-alert__text");

  
  let lastIndex = -1;

    function showAlert() {
      let randomIndex;
    
      do {
        randomIndex = Math.floor(Math.random() * registrations.length);
      } while (randomIndex === lastIndex && registrations.length > 1);
    
      lastIndex = randomIndex;
      text.innerHTML = registrations[randomIndex];
    
      alert.classList.add("show");
    
      setTimeout(() => {
        alert.classList.remove("show");
      }, 4500);
    }

  setTimeout(showAlert, 4000);
  setInterval(showAlert, 14000);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initUadenSocialAlerts, { once: true });
else initUadenSocialAlerts();
