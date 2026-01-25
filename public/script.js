// -------------------------
// 🔥 CARGA DE PRODUCTOS
// -------------------------

const products = [
    {
        id: 1,
        name: "Smart Watch Pro",
        price: 2999,
        image: "img/reloj.jpg"
    },
    {
        id: 2,
        name: "Wireless Earbuds",
        price: 1999,
        image: "img/earbuds.jpg"
    },
    {
        id: 3,
        name: "4K Action Camera",
        price: 4999,
        image: "img/camara.jpg"
    }
];
// -------------------------
// 🔥 MOSTRAR PRODUCTOS
// -------------------------

function renderProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">$${(p.price / 100).toFixed(2)}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>
          Add to Cart
        </button>
      </div>
    `;
  });
}


// -------------------------
// 🔥 STRIPE CHECKOUT
// -------------------------

async function checkout() {
    const cart = loadCart();

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

   const items = cart.map(item => ({
  name: item.name,
 unit_amount: item.price,
  currency: "usd",
  quantity: item.quantity
}));

console.log("Items enviados a Stripe:", items);
}

/*
try {
  const res = await fetch("/api/checkout/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });

  console.log("Response status:", res.status);

  const text = await res.text();
  console.log("Stripe response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Respuesta no JSON del servidor");
  }

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Error iniciando el pago");
  }
} catch (err) {
  console.error("Checkout error:", err);
}
*/

// -------------------------
// 🔥 INICIALIZACIÓN
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderCart();
    updateCartCount();

    const payBtn = document.getElementById("pay-button");
    if (payBtn) {
        payBtn.addEventListener("click", checkout);
    }
});
// -------------------------
// 🔥 PAYPAL BUTTON
// -------------------------

if (typeof paypal !== "undefined") {
  paypal.Buttons({
    createOrder: async () => {
    const selectedItems = getSelectedItems();

if (selectedItems.length === 0) {
  alert("Please select at least one product to proceed to payment.");
  throw new Error("No items selected");
}

console.log("🧪 ITEMS ENVIADOS A PAYPAL:", selectedItems);

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
console.log("🔥 PayPal backend response:", data);

if (!data.id) {
  alert("Backend error: " + JSON.stringify(data));
  throw new Error("No PayPal order ID returned");
}

return data.id;
    },

onApprove: async (data) => {
  try {
    const res = await fetch("/api/checkout/capture-paypal-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID })
    });

    const result = await res.json();
    console.log("CAPTURE RESULT:", result);

    const capture =
      result?.purchase_units?.[0]?.payments?.captures?.[0];

if (capture && capture.status === "COMPLETED") {
  alert("Pago recibido con éxito 🎉");

  const cart = loadCart();
  const remaining = cart.filter(item => !item.selected);

  saveCart(remaining);
  updateCartCount();
  renderCart();
} else {
  alert("Pago autorizado pero no capturado. Intenta nuevamente.");
}
  } catch (err) {
    console.error("Capture error:", err);
    alert("Error procesando el pago. No se realizó el cobro.");
  }
},
  }).render("#paypal-button-container");
}
