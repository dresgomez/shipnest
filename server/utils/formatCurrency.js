function formatCurrency(amount = 0, currency = 'USD') {
  // amount en centavos (ej. 1000 = $10.00)
  const number = (amount / 100).toFixed(2);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(number);
}

module.exports = formatCurrency;
