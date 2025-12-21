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
// 🔥 CARRITO (LOCALSTORAGE)
// -------------------------

function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = loadCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) cartCount.textContent = count;
}

function addToCart(productId) {
    const cart = loadCart();
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    alert("Product added to cart!");
}


// -------------------------
// 🔥 MOSTRAR PRODUCTOS EN index.html
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
            <button class="add-btn" onclick="addToCart(${p.id})">
                Add to Cart
            </button>
        </div>
        `;
    });
}


// -------------------------
// 🔥 MOSTRAR CARRITO EN carrito.html
// -------------------------

function renderCart() {
    const container = document.getElementById("cart-container");
    const totalText = document.getElementById("cart-total");

    if (!container || !totalText) return;

    const cart = loadCart();

    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        container.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}">
            <div>
                <h3>${item.name}</h3>
                <p>$${(item.price / 100).toFixed(2)} x ${item.quantity}</p>
                <p><strong>Total: $${(itemTotal / 100).toFixed(2)}</strong></p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
        `;
    });

    totalText.textContent = "$" + (total / 100).toFixed(2);
}

function removeItem(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount();
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

try {
  const res = await fetch("/api/checkout/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items
    })
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Error iniciando el pago");
  }
} catch (err) {
  console.error("Checkout error:", err);
}
}
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
