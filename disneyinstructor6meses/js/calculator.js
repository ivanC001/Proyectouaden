/* ==========================================================================
   CALCULADORA DE INVERSIÓN CORPORATIVA Y DESCUENTOS POR GRUPO
   Valores según folleto oficial: regular USD 4.500 · contado USD 3.950
   Descuentos por inscripciones múltiples: 2 → 10% · 3 → 20% · 4+ → 30%
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const participantsInput = document.getElementById('calcParticipants');
  const countDisplay = document.getElementById('calcCountDisplay');
  const discountBadge = document.getElementById('calcDiscountBadge');
  const totalPriceDisplay = document.getElementById('calcTotalPrice');
  const perPersonDisplay = document.getElementById('calcPerPerson');
  const savingsDisplay = document.getElementById('calcSavings');

  if (!participantsInput) return;

  const regularUnitPrice = 4500;
  const cashUnitPrice = 3950;

  // Formato es-AR/es-ES con punto como separador de miles (4500 -> 4.500)
  const money = (value) =>
    `$${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} USD`;

  function calculate() {
    const qty = parseInt(participantsInput.value, 10);
    countDisplay.textContent = qty;

    let discountRate = 0;
    if (qty === 2) discountRate = 0.10;
    else if (qty === 3) discountRate = 0.20;
    else if (qty >= 4) discountRate = 0.30;

    const finalUnit = regularUnitPrice * (1 - discountRate);
    const totalFinal = finalUnit * qty;
    const regularTotal = regularUnitPrice * qty;
    const totalSavings = regularTotal - totalFinal;

    if (discountRate > 0) {
      discountBadge.textContent = `${(discountRate * 100).toFixed(0)}% DESCUENTO CORPORATIVO APLICADO`;
      savingsDisplay.textContent = `¡Ahorro institucional de ${money(totalSavings)}!`;
    } else {
      discountBadge.textContent = `TARIFA OFICIAL (${money(regularUnitPrice)})`;
      savingsDisplay.textContent = `Pago de contado: ${money(cashUnitPrice)} · ahorras ${money(regularUnitPrice - cashUnitPrice)}`;
    }
    discountBadge.style.display = 'inline-block';

    totalPriceDisplay.textContent = money(totalFinal);
    perPersonDisplay.textContent = `(${money(finalUnit)} por participante)`;
  }

  participantsInput.addEventListener('input', calculate);
  calculate();
});
