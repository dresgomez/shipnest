document.addEventListener("DOMContentLoaded", () => {

    console.log("Orders Page Loaded");

    const ordersContainer =
        document.querySelector(".orders-container");

    const ordersEmpty =
        document.querySelector(".orders-empty");


    const orders = [

        {
            id: "1001",
            date: "01/08/2026",
            total: "R$ 259,90",
            status: "En preparación",
            statusClass: "status-processing"
        },

        {
            id: "1002",
            date: "03/08/2026",
            total: "R$ 149,90",
            status: "Enviado",
            statusClass: "status-shipped"
        },

        {
            id: "1003",
            date: "05/08/2026",
            total: "R$ 399,90",
            status: "Entregado",
            statusClass: "status-delivered"
        }

    ];


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

            const card = document.createElement("div");

            card.classList.add("order-card");

            card.innerHTML = `

                <div class="order-info">

                    <h3>
                        Pedido #${order.id}
                    </h3>

                    <p>
                        Fecha: ${order.date}
                    </p>

                    <p>
                        Total: ${order.total}
                    </p>

                    <span class="order-status ${order.statusClass}">
                        ${order.status}
                    </span>

                </div>

                <button class="details-btn">
                    Ver detalles
                </button>

            `;

            ordersContainer.appendChild(card);


                const detailsButton = card.querySelector(".details-btn");

detailsButton.addEventListener("click", () => {

window.location.href =
    `/order-detail.html?id=${order.id}`;

});


        });


    }


    renderOrders();

});