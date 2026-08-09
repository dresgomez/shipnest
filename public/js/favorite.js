document.addEventListener("DOMContentLoaded", () => {

    console.log("Favorites Page Loaded");

    const favoritesList = document.querySelector(".favorites-list");

    const favoritesEmpty = document.querySelector(".favorites-empty");

    const recommendationsContainer = document.querySelector(
        ".recommendations-container"
    );

    console.log("Favorites List:", favoritesList);

    console.log("Favorites Empty:", favoritesEmpty);

    console.log(
        "Recommendations Container:",
        recommendationsContainer
    );


    const favorites = [
        {
            name: "Producto de ejemplo",
            price: "R$ 000,00",
            seller: "Vendedor de ejemplo"
        }
    ];


    function renderFavorites() {

        console.log("Renderizando favoritos:", favorites);

    }


    renderFavorites();

});