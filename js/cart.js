// js/cart.js

const CART_KEY = "cart";

// =======================
// Storage
// =======================

function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// =======================
// Cart helpers
// =======================

function updateCartCount() {
  const count = loadCart().reduce((sum, item) => sum + item.quantity, 0);
  const el = document.querySelector(".cart-count");
  if (el) el.textContent = count;
}

function getSelectedItems() {
  return loadCart().filter(item => item.selected);
}

// =======================
// Cart actions
// =======================

function addToCart(product) {
  const cart = loadCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, selected: true });
  }

  saveCart(cart);
  updateCartCount();
}

function removeItem(index) {
  if (!confirm("Remove this item from cart?")) return;

  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function toggleSelect(index) {
  const cart = loadCart();
  cart[index].selected = !cart[index].selected;
  saveCart(cart);
  renderCart();
}

// =======================
// UI
// =======================

function renderCart() {
  const container = document.getElementById("cart-container");
  const totalText = document.getElementById("cart-total");

  if (!container || !totalText) return;

  const cart = loadCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">🛒 Your cart is empty</p>`;
    totalText.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    if (item.selected) total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <input type="checkbox"
          ${item.selected ? "checked" : ""}
          onchange="toggleSelect(${index})"
        />
        <img src="${item.image}">
        <div>
          <h3>${item.name}</h3>
          <p>$${(item.price / 100).toFixed(2)} x ${item.quantity}</p>
          <p><strong>Total: $${(itemTotal / 100).toFixed(2)}</strong></p>
          <button class="remove-btn" onclick="removeItem(${index})">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  totalText.textContent = "$" + (total / 100).toFixed(2);
}
