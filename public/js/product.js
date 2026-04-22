const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct() {
  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").textContent =
    "$" + (product.price / 100).toFixed(2);

  document.getElementById("product-description").textContent =
    product.description;

  const stockEl = document.getElementById("product-stock");

  if (product.stock > 10) {
    stockEl.textContent = "In stock";
    stockEl.className = "product-stock stock-ok";
  } else if (product.stock > 0) {
    stockEl.textContent = "Low stock";
    stockEl.className = "product-stock stock-low";
  } else {
    stockEl.textContent = "Out of stock";
    stockEl.className = "product-stock stock-out";
  }

  // botón carrito
  const btn = document.getElementById("add-to-cart-btn");

  btn.addEventListener("click", () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    }, btn);
  });
}
loadProduct();
