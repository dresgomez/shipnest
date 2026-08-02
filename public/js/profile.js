document.addEventListener("DOMContentLoaded", () => {

    console.log("Profile Page Loaded");

    /* ---------- Elements ---------- */

    const editProfileBtn = document.getElementById("edit-profile-btn");
    const changePasswordBtn = document.getElementById("change-password-btn");

    const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");

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

    /* ---------- Render ---------- */

    function renderProfile(){

        console.log(currentUser);

            profileName.textContent = currentUser.name;

    profileEmail.textContent = currentUser.email;

    profilePhone.textContent = currentUser.phone;


    }

    /* ---------- Events ---------- */

    editProfileBtn.addEventListener("click", openEditProfile);

    changePasswordBtn.addEventListener("click", openChangePassword);

    /* ---------- Initialize ---------- */

    renderProfile();

});