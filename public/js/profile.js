document.addEventListener("DOMContentLoaded", () => {

    console.log("Profile Page Loaded");

    /* ---------- Elements ---------- */

    const editProfileBtn = document.getElementById("edit-profile-btn");
    const changePasswordBtn = document.getElementById("change-password-btn");

    /* ---------- Data ---------- */

    const currentUser = {

        name: "Invitado",

        email: "Sin iniciar sesión",

        phone: "No disponible"

    };

    /* ---------- Functions ---------- */

    function openEditProfile(){

        console.log("Editar perfil");

    }

    function openChangePassword(){

        console.log("Cambiar contraseña");

    }

    function renderProfile(){

        console.log(currentUser);

    }

    /* ---------- Events ---------- */

    editProfileBtn.addEventListener("click", openEditProfile);

    changePasswordBtn.addEventListener("click", openChangePassword);

    /* ---------- Initialize ---------- */

    renderProfile();

});