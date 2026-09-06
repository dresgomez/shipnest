document.addEventListener("DOMContentLoaded", async () => {

    console.log("Orders Page Loaded");

    const ordersContainer =
        document.querySelector(".orders-container");

    const ordersEmpty =
        document.querySelector(".orders-empty");


    // =========================
    // LOAD ORDERS
    // =========================

    try {

        const response = await fetch("/api/orders");

        if (!response.ok) {
            throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();

        const orders = data.orders || [];


        // =========================
        // RENDER ORDERS
        // =========================

        function renderOrders() {

            ordersContainer.innerHTML = "";

            if (orders.length === 0) {

                ordersEmpty.style.display = "block";

                ordersContainer.style.display = "none";

                return;
            }

            ordersEmpty.style.display = "none";

            ordersContainer.style.display = "flex";


            orders.forEach((order) => {

                const card =
                    document.createElement("div");

                card.classList.add("order-card");


                const total =
                    order.amount?.value || "0.00";

                const currency =
                    order.amount?.currency_code || "BRL";


                const formattedTotal =
                    new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: currency
                    }).format(Number(total));


                card.innerHTML = `

                    <div class="order-info">

                        <h3>
                            Pedido #${order.orderID}
                        </h3>

                        <p>
                            Fecha:
                            ${formatDate(order.createdAt)}
                        </p>

                        <p>
                            Total:
                            ${formattedTotal}
                        </p>

                        <span class="order-status">
                            ${order.status || "Processing"}
                        </span>

                    </div>

                    <button class="details-btn">
                        Ver detalles
                    </button>

                `;


                ordersContainer.appendChild(card);


                // =========================
                // DETAILS BUTTON
                // =========================

                const detailsButton =
                    card.querySelector(".details-btn");


                detailsButton.addEventListener("click", () => {

                    window.location.href =
                        `/order-detail.html?id=${order._id}`;

                });

            });

        }


        // =========================
        // FORMAT DATE
        // =========================

        function formatDate(date) {

            if (!date) {
                return "---";
            }

            return new Date(date).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

        }


        renderOrders();


    } catch (error) {

        console.error("Error loading orders:", error);

        ordersEmpty.style.display = "block";

        ordersContainer.style.display = "none";

    }

});