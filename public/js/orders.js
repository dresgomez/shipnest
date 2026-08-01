document.addEventListener("DOMContentLoaded", () => {

    console.log("Orders Page Loaded");

    const orderCards = document.querySelectorAll(".order-card");
    const detailsButtons = document.querySelectorAll(".details-btn");

    console.log(orderCards);
    console.log(detailsButtons);

    detailsButtons.forEach(button => {

    button.addEventListener("click", () => {

        console.log("Abrir detalles del pedido");

    });

        });

});