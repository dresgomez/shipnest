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
        name: "Producto A",
        price: "R$ 100,00",
        seller: "Vendedor A"
    },
    {
        name: "Producto B",
        price: "R$ 200,00",
        seller: "Vendedor B"
    },
    {
        name: "Producto C",
        price: "R$ 300,00",
        seller: "Vendedor C"
    }
];

const recommendations = [
    {
        name: "Producto recomendado",
        price: "R$ 149,90",
        seller: "Vendedor recomendado",
        shipping: "Envío nacional"
    }
];

// =======================
// Favorites
// =======================

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


        const removeButton = card.querySelector(".remove-favorite");

        const detailsButton = card.querySelector(".details-btn");


        removeButton.addEventListener("click", () => {

            const index = favorites.indexOf(favorite);

            favorites.splice(index, 1);

            renderFavorites();

        });


        detailsButton.addEventListener("click", () => {

            console.log("Ver producto:", favorite.name);

        });

    });

}

// =======================
// Recomendations
// =======================

function renderRecommendations() {

    recommendationsContainer.innerHTML = "";

    if (recommendations.length === 0) {

    recommendationsContainer.innerHTML = `
    
        <div class="recommendations-empty">

            <i class="fa-solid fa-box-open"></i>

            <p>
                Por ahora no tenemos recomendaciones para ti.
            </p>

        </div>

    `;

    return;
}

    recommendations.forEach((product) => {

        const card = document.createElement("div");

        card.classList.add("recommendation-card");

        card.innerHTML = `

            <img
                src="https://placehold.co/120x120"
                alt="${product.name}"
            >

            <div class="recommendation-info">

                <h3>${product.name}</h3>

                <p>${product.price}</p>

                <span>${product.seller}</span>

                <small>${product.shipping}</small>

            </div>

            <div class="recommendation-actions">

                <button class="details-btn">
                    Ver producto
                </button>

            </div>

        `;

        recommendationsContainer.appendChild(card);

        const detailsButton = card.querySelector(".details-btn");

detailsButton.addEventListener("click", () => {

    console.log("Ver recomendación:", product.name);

});

    });

}

renderFavorites();

renderRecommendations();

});