document.addEventListener("DOMContentLoaded", () => {

    console.log("Client Panel Loaded");

    const clientName = document.getElementById("client-name");
    const clientEmail = document.getElementById("client-email");

    const ordersCard = document.getElementById("orders-card");
    const profileCard = document.getElementById("profile-card");
    const favoritesCard = document.getElementById("favorites-card");
    const settingsCard = document.getElementById("settings-card");


ordersCard.addEventListener("click", () => {
    console.log("Abrir Mis pedidos");
});

profileCard.addEventListener("click", () => {
    console.log("Abrir Mi perfil");
});

favoritesCard.addEventListener("click", () => {
    console.log("Abrir Favoritos");
});

settingsCard.addEventListener("click", () => {
    console.log("Abrir Configuración");
});

    console.log(clientName);
    console.log(clientEmail);

    console.log(ordersCard);
    console.log(profileCard);
    console.log(favoritesCard);
    console.log(settingsCard);

});