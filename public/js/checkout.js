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

// -------------------------
// 🔥 PAYPAL BUTTON
// -------------------------
const statusDiv = document.getElementById("payment-status");

function mostrarCargando() {
  statusDiv.textContent = "⏳ Procesando pago, por favor espera...";
  statusDiv.style.color = "#555";
}

function mostrarExito() {
  statusDiv.innerHTML = `
    ✅ <strong>Pago realizado con éxito</strong><br>
    Gracias por tu compra. En breve puedes volver a la tienda.
    <div style="margin-top:12px;">
      <a href="index.html" style="text-decoration:underline;">
        Volver a la tienda
      </a>
    </div>
  `;
  statusDiv.style.color = "green";
}

function mostrarError() {
  statusDiv.textContent = "❌ El pago fue cancelado o ocurrió un error.";
  statusDiv.style.color = "red";
}

if (typeof paypal !== "undefined") {
  paypal.Buttons({
    onClick() {
      mostrarCargando();
      statusDiv.textContent = "⏳ Redirigiendo a PayPal...";
    },

    createOrder: async () => {
      const selectedItems = getSelectedItems();

      if (selectedItems.length === 0) {
        mostrarError();
        statusDiv.textContent = "❌ No hay productos seleccionados para pagar.";
        throw new Error("No items selected");
      }

      const total = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const res = await fetch("/api/checkout/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems,
          total: (total / 100).toFixed(2)
        })
      });

      const data = await res.json();
      if (!data.id) throw new Error("No PayPal order ID");

      return data.id;
    },

    onApprove: async (data) => {
      const res = await fetch("/api/checkout/capture-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID })
      });

      const result = await res.json();
      const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];

      if (capture?.status === "COMPLETED") {
        mostrarExito();
        document.querySelector("#paypal-button-container").style.pointerEvents = "none";

        const cart = loadCart();
        saveCart(cart.filter(item => !item.selected));
        updateCartCount();
        renderCart();
      } else {
        mostrarError();
      }
    },

    onError(err) {
      console.error(err);
      mostrarError();
    }
  }).render("#paypal-button-container");
}