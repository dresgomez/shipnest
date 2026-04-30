const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct() {
  const res = await fetch("/api/products");
  const data = await res.json();

  const product = data.products.find(p => p._id === id);

  const related = data.products.filter(p => {

  return (
    p.category === product.category &&
    p._id !== product._id
  );

}).slice(0, 4);

  if (!product) {
    console.error("Product not found");
    return;
  }

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").textContent =
    "$" + (product.price / 100).toFixed(2);

    const thumbs = [
  document.getElementById("thumb-1"),
  document.getElementById("thumb-2"),
  document.getElementById("thumb-3")
];

thumbs.forEach((thumb) => {

  thumb.src = product.image;

  thumb.addEventListener("click", () => {

    document.getElementById("product-image").src =
      thumb.src;

    document
      .querySelectorAll(".thumb")
      .forEach(t =>
        t.classList.remove("active-thumb")
      );

    thumb.classList.add("active-thumb");

  });

  const relatedContainer =
  document.getElementById(
    "related-products-container"
  );

related.forEach(item => {

  const card =
    document.createElement("div");

  card.className = "related-card";

  card.innerHTML = `
    <img src="${item.image}">
    <h3>${item.name}</h3>
    <p>
      $${(item.price / 100).toFixed(2)}
    </p>
  `;

  card.addEventListener("click", () => {

    window.location.href =
      `/product.html?id=${item._id}`;

  });

  relatedContainer.appendChild(card);

});

});

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

  const btn = document.getElementById("add-to-cart-btn");

 btn.addEventListener("click", () => {
  addToCart({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.image
  }, btn);

  updateCartCount();
});
}

loadProduct();
updateCartCount();