// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("checkout-items");
  const totalText = document.getElementById("checkout-total");

  if (!itemsContainer || !totalText) return;

  const selectedItems = getSelectedItems();

  if (selectedItems.length === 0) {
    itemsContainer.innerHTML = `
      <p>No products selected for checkout.</p>
      <a href="carrito.html">Go back to cart</a>
    `;
    totalText.textContent = "$0.00";
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = "";

  selectedItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    itemsContainer.innerHTML += `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>$${(item.price / 100).toFixed(2)} × ${item.quantity}</p>
          <p><strong>$${(itemTotal / 100).toFixed(2)}</strong></p>
        </div>
      </div>
    `;
  });

  totalText.textContent = "$" + (total / 100).toFixed(2);
});
