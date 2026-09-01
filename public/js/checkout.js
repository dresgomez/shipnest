// js/checkout.js

let paymentLocked = false;
let paymentTimeout = null;
let paymentApproved = false;

// 🔒 BLOQUEAR UI
function lockPaymentUI(message = "Procesando pago...") {
  paymentLocked = true;

  // 🔁 limpiar timeout anterior si existe
  if (paymentTimeout) {
    clearTimeout(paymentTimeout);
    paymentTimeout = null;
  }

  const overlay = document.createElement("div");
  overlay.id = "payment-overlay";
  overlay.innerHTML = `
    <div class="payment-box">
      <div class="spinner"></div>
      <p>${message}</p>
      <small>No cierres ni recargues esta página</small>
    </div>
  `;

  document.body.appendChild(overlay);

paymentTimeout = setTimeout(() => {
  if (paymentLocked && !paymentApproved) {
    console.warn("⚠️ Payment timeout");
    unlockPaymentUI();
    mostrarError();
  }
}, 20000); // 20 segundos

}

// 🔓 DESBLOQUEAR UI
function unlockPaymentUI() {
  paymentLocked = false;

  if (paymentTimeout) {
    clearTimeout(paymentTimeout);
    paymentTimeout = null;
  }

  const overlay = document.getElementById("payment-overlay");
  if (overlay) overlay.remove();
}


// ⛔ evitar recarga mientras paga
window.addEventListener("beforeunload", (e) => {
  if (paymentLocked) {
    e.preventDefault();
    e.returnValue = "";
  }
});

let statusDiv;

document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("checkout-items");
  const totalText = document.getElementById("checkout-total");

   statusDiv = document.getElementById("payment-status");

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

    <div class="checkout-item-info">
      <h4>${item.name}</h4>

      <p>
        Price:
        $${(item.price / 100).toFixed(2)}
      </p>

      <p>
        Quantity:
        ${item.quantity}
      </p>

      <p>
  Subtotal:
  $${(itemTotal / 100).toFixed(2)}
</p>
    </div>
  </div>
`;
  });

  totalText.textContent = "$" + (total / 100).toFixed(2);
});

// -------------------------
// 🔥 PAYPAL BUTTON
// -------------------------
function mostrarCargando() {
    if (!statusDiv) return;
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

     const cleanItems = selectedItems.map(item => ({
  id: item.id || item._id, // 🔥 solución híbrida
  name: item.name,
  price: Number(item.price),
  quantity: item.quantity
}));

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  items: cleanItems,
  total: (total / 100).toFixed(2)
}) 
      });

      const data = await res.json();
      if (!data.id) throw new Error("No PayPal order ID");

      return data.id;
    },

 onApprove: async (data) => {
  paymentApproved = true;
  lockPaymentUI("Confirmando pago con el banco...");

  try {
    const res = await fetch("/api/checkout/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  orderID: data.orderID,
  items: getSelectedItems()
})
    });

    const result = await res.json();
    console.log("CAPTURE RESULT:", result);

    if (result.status === "COMPLETED") {
      mostrarExito();

      document.querySelector("#paypal-button-container")
        .style.pointerEvents = "none";

      const cart = loadCart();
      saveCart(cart.filter(item => !item.selected));
      updateCartCount();
      renderCart();


  if (result.orderMongoId) {
    setTimeout(() => {
      window.location.href =
        `order-detail.html?id=${result.orderMongoId}`;
    }, 1500);
  }


    } else {
      mostrarError();
    }

  } catch (err) {
    console.error("❌ Capture error:", err);
    mostrarError();
  } finally {
    paymentApproved = false;
    unlockPaymentUI();
  }
},

   onError(err) {
  console.error(err);
  unlockPaymentUI();
  mostrarError();
}
  }).render("#paypal-button-container");
}