/* ==========================================================================
   CALCULADORA DE INVERSIÓN CORPORATIVA Y DESCUENTOS POR GRUPO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const participantsInput = document.getElementById('calcParticipants');
  const countDisplay = document.getElementById('calcCountDisplay');
  const discountBadge = document.getElementById('calcDiscountBadge');
  const totalPriceDisplay = document.getElementById('calcTotalPrice');
  const perPersonDisplay = document.getElementById('calcPerPerson');
  const savingsDisplay = document.getElementById('calcSavings');

  if (!participantsInput) return;

  const regularUnitPrice = 960;
  const promoUnitPrice = 790;

  function calculate() {
    const qty = parseInt(participantsInput.value, 10);
    countDisplay.textContent = qty;

    let discountRate = 0;
    if (qty === 2) discountRate = 0.10;
    else if (qty === 3) discountRate = 0.20;
    else if (qty >= 4) discountRate = 0.30;

    const baseUnit = promoUnitPrice;
    const finalUnit = baseUnit * (1 - discountRate);
    const totalFinal = finalUnit * qty;
    const regularTotal = regularUnitPrice * qty;
    const totalSavings = regularTotal - totalFinal;

    if (discountRate > 0) {
      discountBadge.textContent = `${(discountRate * 100).toFixed(0)}% DESCUENTO CORPORATIVO APLICADO`;
      discountBadge.style.display = 'inline-block';
    } else {
      discountBadge.textContent = 'TARIFA PREFERENCIAL PRONTO PAGO ($790 USD)';
      discountBadge.style.display = 'inline-block';
    }

    totalPriceDisplay.textContent = `$${Math.round(totalFinal).toLocaleString()} USD`;
    perPersonDisplay.textContent = `($${Math.round(finalUnit).toLocaleString()} USD por participante)`;
    savingsDisplay.textContent = `¡Ahorro institucional de $${Math.round(totalSavings).toLocaleString()} USD!`;
  }

  participantsInput.addEventListener('input', calculate);
  calculate();
});