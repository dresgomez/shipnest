// =========================
// ORDER DETAIL
// =========================

// Get order ID from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");


// =========================
// DOM ELEMENTS
// =========================

const orderIdElement = document.querySelector("#order-id");
const orderStatusElement = document.querySelector("#order-status");
const orderDateElement = document.querySelector("#order-date");

const shippingNameElement = document.querySelector("#shipping-name");
const shippingAddressElement = document.querySelector("#shipping-address");
const shippingCityElement = document.querySelector("#shipping-city");
const shippingPostalCodeElement = document.querySelector("#shipping-postal-code");

const orderProductsElement = document.querySelector("#order-products");

const orderSubtotalElement = document.querySelector("#order-subtotal");
const orderShippingElement = document.querySelector("#order-shipping");
const orderTotalElement = document.querySelector("#order-total");


// =========================
// INITIAL CHECK
// =========================

if (!orderId) {
    console.error("No order ID provided.");

    orderIdElement.textContent = "Order not found";
} else {
    loadOrder(orderId);
}


// =========================
// LOAD ORDER
// =========================

async function loadOrder(id) {

    try {

        const response = await fetch("/api/orders");

        if (!response.ok) {
            throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();

        const orders = data.orders || [];

        const order = orders.find(order => order._id === id);

        if (!order) {
            console.error("Order not found:", id);

            orderIdElement.textContent = "Order not found";
            return;
        }

        renderOrder(order);

    } catch (error) {

        console.error("Error loading order:", error);

        orderIdElement.textContent = "Error loading order";
    }
}


// =========================
// RENDER ORDER
// =========================

function renderOrder(order) {

    // Order information
    orderIdElement.textContent = `#${order._id}`;

    orderStatusElement.textContent = order.status || "Processing";

    orderDateElement.textContent = formatDate(order.createdAt);


    // Shipping information
    shippingNameElement.textContent =
        order.shippingAddress?.name || "---";

    shippingAddressElement.textContent =
        order.shippingAddress?.address || "---";

    shippingCityElement.textContent =
        order.shippingAddress?.city || "---";

    shippingPostalCodeElement.textContent =
        order.shippingAddress?.postalCode || "---";


    // Products
    renderProducts(order.items || []);


    // Summary
    const subtotal = order.subtotal || 0;
    const shipping = order.shipping || 0;
    const total = order.total || subtotal + shipping;

    orderSubtotalElement.textContent = formatPrice(subtotal);
    orderShippingElement.textContent = formatPrice(shipping);
    orderTotalElement.textContent = formatPrice(total);
}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(products) {

    orderProductsElement.innerHTML = "";

    if (!products.length) {

        orderProductsElement.innerHTML = `
            <p class="empty-order-products">
                No products found in this order.
            </p>
        `;

        return;
    }


    products.forEach(item => {

        const product = document.createElement("div");

        product.className = "order-product";

        product.innerHTML = `
            <div class="order-product-info">

                <div class="order-product-image">
                    <img
                        src="${item.image || "images/placeholder.png"}"
                        alt="${item.name || "Product"}"
                    >
                </div>

                <div class="order-product-details">

                    <h3>${item.name || "Product"}</h3>

                    <p>
                        Quantity:
                        ${item.quantity || 1}
                    </p>

                </div>

            </div>

            <div class="order-product-price">
                ${formatPrice(item.price || 0)}
            </div>
        `;

        orderProductsElement.appendChild(product);
    });
}


// =========================
// FORMAT PRICE
// =========================

function formatPrice(price) {

    return `R$ ${(price / 100).toFixed(2)}`;
}


// =========================
// FORMAT DATE
// =========================

function formatDate(date) {

    if (!date) {
        return "---";
    }

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

