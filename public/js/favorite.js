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

    favoritesList.innerHTML = "";

    if (favorites.length === 0) {

    favoritesEmpty.style.display = "block";

    favoritesList.style.display = "none";

    return;
}

favoritesEmpty.style.display = "none";

favoritesList.style.display = "flex";

    favorites.forEach((favorite) => {

        const card = document.createElement("div");

        card.classList.add("favorite-card");

        card.innerHTML = `

            <img 
                src="https://placehold.co/120x120" 
                alt="${favorite.name}"
            >

            <div class="favorite-info">

                <h3>${favorite.name}</h3>

                <p>${favorite.price}</p>

                <span>${favorite.seller}</span>

            </div>

            <div class="favorite-actions">

                <button class="details-btn">
                    Ver producto
                </button>

                <button class="remove-favorite">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;

        favoritesList.appendChild(card);

    });

}


    renderFavorites();

});