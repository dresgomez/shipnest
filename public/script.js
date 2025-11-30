/* ------------------------
   PRODUCTS (Dummy Example)
--------------------------- */

const products = [
    {
        id: 1,
        name: "Smart Watch Pro",
        price: 49.99,
        image: "https://via.placeholder.com/200"
    },
    {
        id: 2,
        name: "Wireless Earbuds",
        price: 29.99,
        image: "https://via.placeholder.com/200"
    },
    {
        id: 3,
        name: "LED Desk Lamp",
        price: 19.99,
        image: "https://via.placeholder.com/200"
    }
];

/* ------------------------
   Render Products
--------------------------- */
const productsContainer = document.getElementById("products-container");

if (productsContainer) {
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

/* ------------------------
   CART SYSTEM
--------------------------- */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
    const product = products.find(p => p.id === id);

    const exists = cart.find(item => item.id === id);
    if (exists) {
        exists.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    alert("Added to cart!");
}

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.querySelector(".cart-count");

    if (badge) badge.textContent = count;
}

updateCartCount();

/* ------------------------
   CART PAGE RENDER
--------------------------- */

const cartContainer = document.getElementById("cart-container");

if (cartContainer) {
    renderCart();
}

function renderCart() {
    cartContainer.innerHTML = "";

    cart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent =
        "$" + cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
}