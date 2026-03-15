async function loadProducts(){

const res = await fetch("/api/products");

const data = await res.json();

const container =
document.getElementById("products-container");

container.innerHTML = "";

data.products.forEach(product => {

const card = document.createElement("div");

card.className = "product-card";

card.innerHTML = `
<img src="${product.image}">
<h3>${product.name}</h3>
<p>$${product.price}</p>
<button class="add-cart-btn">Add to cart</button>
`;

container.appendChild(card);

});

}

loadProducts();