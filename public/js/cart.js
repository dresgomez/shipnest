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
// Helpers
// =======================
function updateCartCount() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.querySelector(".cart-count");
  if (!badge) return;

  badge.textContent = count;

  // ✨ trigger animación
  badge.classList.remove("bump");
  void badge.offsetWidth; // reset animación
  badge.classList.add("bump");
}


// =======================
// Actions
// =======================

function addToCart(product, btn = null) {
  const cart = loadCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, selected: true });
  }

  saveCart(cart);
  updateCartCount();

  // 🎯 Feedback visual
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = "✓ Added";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 900);
  }
}


function addToCartById(id) {
  const product = window.products.find(p => p.id === id);
  if (!product) return;

  addToCart(product);
}

// =======================
// Exposición global
// =======================
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
  <div class="cart-item ${item.selected ? "selected" : ""}">
        <input type="checkbox"
          ${item.selected ? "checked" : ""}
          onchange="toggleSelect(${index})"
        />
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
  
const payBtn = document.getElementById("pay-button");
if (payBtn) {
  payBtn.disabled = total === 0;
}

}

// =======================
// Global exposure
// =======================
window.addToCart = addToCart;
window.removeItem = removeItem;
window.toggleSelect = toggleSelect;
window.renderCart = renderCart;
window.updateCartCount = updateCartCount;
window.getSelectedItems = getSelectedItems;
