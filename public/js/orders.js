document.addEventListener("DOMContentLoaded", () => {

    console.log("Orders Page Loaded");

    initializeOrders();

});

function initializeOrders(){

    const orderCards = document.querySelectorAll(".order-card");
    const detailsButtons = document.querySelectorAll(".details-btn");

    console.log(orderCards);
    console.log(detailsButtons);

    setupDetailsButtons(detailsButtons);

}

function setupDetailsButtons(buttons){

    buttons.forEach((button)=>{

        button.addEventListener("click", ()=>{

            console.log("Abrir detalles del pedido");

        });

    });

}