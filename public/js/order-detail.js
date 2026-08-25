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

    // =========================
    // ORDER INFORMATION
    // =========================

    orderIdElement.textContent =
        `#${order.orderID || order._id}`;

    orderStatusElement.textContent =
        order.status || "Processing";

    orderDateElement.textContent =
        formatDate(order.createdAt);


    // =========================
    // SHIPPING INFORMATION
    // =========================

    // Shipping information is not currently
    // stored in the order document.

    shippingNameElement.textContent = "---";

    shippingAddressElement.textContent = "---";

    shippingCityElement.textContent = "---";

    shippingPostalCodeElement.textContent = "---";


    // =========================
    // PRODUCTS
    // =========================

    const items = order.items || [];

    renderProducts(items);


    // =========================
    // ORDER SUBTOTAL
    // =========================

    const subtotal = items.reduce((total, item) => {

        const price = Number(item.price) || 0;

        const quantity = Number(item.quantity) || 1;

        return total + (price * quantity);

    }, 0);

    orderSubtotalElement.textContent =
        formatPrice(subtotal);


    // =========================
    // ORDER TOTAL
    // =========================

    const currency =
        order.amount?.currency_code || "BRL";

    const total =
        order.amount?.value || "0.00";

    orderTotalElement.textContent =
        formatAmount(total, currency);


    // =========================
    // SHIPPING
    // =========================

    orderShippingElement.textContent = "---";

}


    // =========================
    // CURRENTLY UNAVAILABLE
    // =========================

    orderSubtotalElement.textContent = "---";

    orderShippingElement.textContent = "---";



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

        const productElement =
            document.createElement("div");

        productElement.className =
            "order-product";


        productElement.innerHTML = `

            <div class="order-product-info">

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


        orderProductsElement.appendChild(productElement);

    });

}


// =========================
// FORMAT INTERNAL PRICE
// =========================

function formatPrice(price) {

    const amount = Number(price) / 100;

    return new Intl.NumberFormat("pt-BR", {

        style: "currency",

        currency: "BRL"

    }).format(amount);

}


// =========================
// FORMAT PAYPAL AMOUNT
// =========================

function formatAmount(value, currency) {

    const amount = Number(value);

    return new Intl.NumberFormat("pt-BR", {

        style: "currency",

        currency: currency

    }).format(amount);

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
