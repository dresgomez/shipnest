const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct() {

    try {

        const res = await fetch("/api/products");

        if (!res.ok) {
            throw new Error("Error loading products");
        }

        const data = await res.json();

        const product = data.products.find(p => p._id === id);

        // =======================
        // PRODUCT NOT FOUND
        // =======================

        if (!product) {

            console.error("Product not found");

            document.querySelector(".product-container").innerHTML = `
                <div class="product-not-found">

                    <h1>Producto no encontrado</h1>

                    <p>
                        El producto que buscas no existe o ya no está disponible.
                    </p>

                    <a href="index.html">
                        Volver a la tienda
                    </a>

                </div>
            `;

            document.querySelector(".product-extra").style.display = "none";
            document.querySelector(".related-wrapper").style.display = "none";

            return;
        }


        // =======================
        // RELATED PRODUCTS
        // =======================

        const related = data.products
            .filter(p => {

                return (
                    p.category === product.category &&
                    p._id !== product._id
                );

            })
            .slice(0, 4);


        // =======================
        // PRODUCT BASIC INFO
        // =======================

        document.getElementById("product-image").src =
            product.image;

        document.getElementById("product-image").alt =
            product.name;

        document.getElementById("product-name").textContent =
            product.name;

        document.getElementById("breadcrumb-product").textContent =
            product.name;

        document.getElementById("product-price").textContent =
            "R$ " + (product.price / 100).toFixed(2);


        // =======================
        // THUMBNAILS
        // =======================

        const thumbnailList =
            document.getElementById("thumbnail-list");

        thumbnailList.innerHTML = "";

        const images =
            product.images?.length
                ? product.images
                : [product.image];


        images.forEach((img, index) => {

            const thumb =
                document.createElement("img");

            thumb.src = img;

            thumb.alt =
                `${product.name} imagen ${index + 1}`;

            thumb.className = "thumb";

            if (index === 0) {
                thumb.classList.add("active-thumb");
            }

            thumb.addEventListener("click", () => {

                document.getElementById(
                    "product-image"
                ).src = img;

                document
                    .querySelectorAll(".thumb")
                    .forEach(t => {

                        t.classList.remove(
                            "active-thumb"
                        );

                    });

                thumb.classList.add(
                    "active-thumb"
                );

            });

            thumbnailList.appendChild(thumb);

        });


        // =======================
        // RELATED PRODUCTS RENDER
        // =======================

        const relatedContainer =
            document.getElementById(
                "related-products-container"
            );

        relatedContainer.innerHTML = "";


        if (related.length === 0) {

            relatedContainer.innerHTML = `
                <p class="related-empty">
                    No hay productos similares disponibles.
                </p>
            `;

        } else {

            related.forEach(item => {

                const card =
                    document.createElement("div");

                card.className = "related-card";

                card.innerHTML = `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <h3>${item.name}</h3>

                    <p>
                        R$ ${(item.price / 100).toFixed(2)}
                    </p>
                `;

                card.addEventListener("click", () => {

                    window.location.href =
                        `/product.html?id=${item._id}`;

                });

                relatedContainer.appendChild(card);

            });

        }


        // =======================
        // DESCRIPTION
        // =======================

        document.getElementById(
            "product-description"
        ).textContent =
            product.description;


        // =======================
        // STOCK
        // =======================

        const stockEl =
            document.getElementById("product-stock");


        if (product.stock > 10) {

            stockEl.textContent = "In stock";

            stockEl.className =
                "product-stock stock-ok";

        } else if (product.stock > 0) {

            stockEl.textContent = "Low stock";

            stockEl.className =
                "product-stock stock-low";

        } else {

            stockEl.textContent = "Out of stock";

            stockEl.className =
                "product-stock stock-out";

        }


        // =======================
        // ADD TO CART
        // =======================

        const btn =
            document.getElementById(
                "add-to-cart-btn"
            );


        btn.addEventListener("click", () => {

            addToCart({

                id: product._id,

                name: product.name,

                price: product.price,

                image: product.image

            }, btn);

            updateCartCount();

        });


    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );

        document.querySelector(".product-container").innerHTML = `
            <div class="product-not-found">

                <h1>No se pudo cargar el producto</h1>

                <p>
                    Ocurrió un problema al intentar obtener la información del producto.
                </p>

                <a href="index.html">
                    Volver a la tienda
                </a>

            </div>
        `;

        document.querySelector(".product-extra").style.display = "none";
        document.querySelector(".related-wrapper").style.display = "none";

    }

}


// =======================
// DESCRIPTION TOGGLE
// =======================

const toggleBtn =
    document.getElementById("toggle-description");

const wrapper =
    document.getElementById("description-wrapper");


toggleBtn.addEventListener("click", () => {

    wrapper.classList.toggle(
        "description-expanded"
    );


    if (
        wrapper.classList.contains(
            "description-expanded"
        )
    ) {

        wrapper.classList.remove(
            "description-collapsed"
        );

        toggleBtn.textContent =
            "Show less";

    } else {

        wrapper.classList.add(
            "description-collapsed"
        );

        toggleBtn.textContent =
            "Read more";

    }

});


loadProduct();

updateCartCount();