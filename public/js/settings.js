document.addEventListener("DOMContentLoaded", () => {

    console.log("Settings Page Loaded");


    // =======================
    // USER
    // =======================

    const currentUser = {
        role: "seller"
    };


    // =======================
    // SELLER SETTINGS
    // =======================

    const sellerSection = document.querySelector(".settings-seller");


    if (sellerSection) {

        if (currentUser.role === "seller") {

            sellerSection.style.display = "block";

        } else {

            sellerSection.style.display = "none";

        }

    }


    // =======================
    // SETTINGS ACTIONS
    // =======================

    const settingsButtons = document.querySelectorAll(".settings-action");


    settingsButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const option = button
                .closest(".settings-option")
                .querySelector("h3");

            if (!option) {
                return;
            }

            console.log("Configuración seleccionada:", option.textContent);

        });

    });


});