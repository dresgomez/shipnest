document.addEventListener("DOMContentLoaded", () => {

    console.log("Profile Page Loaded");

    /* ---------- Elements ---------- */

    const editProfileBtn = document.getElementById("edit-profile-btn");
    const changePasswordBtn = document.getElementById("change-password-btn");

    const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");
const profileRole = document.getElementById("profile-role");

    /* ---------- Data ---------- */

    const currentUser = {

        name: "Invitado",

        email: "Sin iniciar sesión",

        phone: "No disponible",

         role: "Cliente"

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

    profileName.textContent = currentUser.name;

    profileEmail.textContent = currentUser.email;

    profilePhone.textContent = currentUser.phone;

    console.log("Current User:", currentUser);

    profileRole.textContent = currentUser.role;

}

    /* ---------- Events ---------- */

    editProfileBtn.addEventListener("click", openEditProfile);

    changePasswordBtn.addEventListener("click", openChangePassword);

    /* ---------- Initialize ---------- */

    renderProfile();

});