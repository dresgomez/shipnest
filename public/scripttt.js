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
        <p>$${(p.price / 100).toFixed(2)}</p>
        <button 
          class="add-cart-btn"
          onclick='addToCart(${JSON.stringify(p)})'
        >
          Add to Cart
        </button>
      </div>
    `;
  });
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
