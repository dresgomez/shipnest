document.addEventListener("DOMContentLoaded", () => {

    console.log("Client Panel Loaded");

    const clientName = document.getElementById("client-name");
    const clientEmail = document.getElementById("client-email");

    const ordersCard = document.getElementById("orders-card");
    const profileCard = document.getElementById("profile-card");
    const favoritesCard = document.getElementById("favorites-card");
    const settingsCard = document.getElementById("settings-card");


ordersCard.addEventListener("click", () => {
    window.location.href = "orders.html";
});

profileCard.addEventListener("click", () => {
    window.location.href = "profile.html";
});

favoritesCard.addEventListener("click", () => {
    window.location.href = "favorites.html";
});

settingsCard.addEventListener("click", () => {
    window.location.href = "settings.html";
});

    console.log(clientName);
    console.log(clientEmail);

    console.log(ordersCard);
    console.log(profileCard);
    console.log(favoritesCard);
    console.log(settingsCard);


});