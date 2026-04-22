async function loadProducts(){

const res = await fetch("/api/products");

const data = await res.json();

const container =
document.getElementById("products-container");

if (!container) return;

container.innerHTML = "";

data.products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.image}">
    <h3>${product.name}</h3>
    <p>$${(product.price / 100).toFixed(2)}</p>
    <button class="add-cart-btn">Add to cart</button>
  `;

  // 👉 click en card = ir a product page
  card.addEventListener("click", () => {
    window.location.href = `/product.html?id=${product._id}`;
  });

  const btn = card.querySelector(".add-cart-btn");

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // 🔥 CLAVE

    addToCart({
      id: product._id, // 🔥 CLAVE
      name: product.name,
      price: product.price,
      image: product.image
    }, btn);
  });

  container.appendChild(card);
});

}

loadProducts();

// =======================
// Productos
// =======================

window.products = [
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

// =======================
// UI productos
// =======================

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
    <button 
  class="add-cart-btn"
  onclick='addToCart(${JSON.stringify(p)}, this)'
>
  Add to Cart
</button>
      </div>
    `;
  });
}

// =======================
// Inicialización
// =======================

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  if (typeof renderCart === "function") {
    renderCart();
  }

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
});
