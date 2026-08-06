document.addEventListener("DOMContentLoaded", () => {

    console.log("Profile Page Loaded");

    /* ---------- Elements ---------- */


        /* ---------- Buttons ---------- */
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const changePasswordBtn = document.getElementById("change-password-btn");

    /* ---------- User Data ---------- */

    const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");
const profileRole = document.getElementById("profile-role");
const profileStatus = document.getElementById("profile-status");

const profileMemberSince = document.getElementById("profile-member-since");

    /* ---------- Data ---------- */

const currentUser = {

    name: "Invitado",

    email: "Sin iniciar sesión",

    phone: "No disponible",

    role: "Cliente",

    status: "Activo",

    memberSince: "--/--/----"

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

    profileRole.textContent = currentUser.role;

    profileStatus.textContent = currentUser.status;

    profileMemberSince.textContent = currentUser.memberSince;

    console.log("Current User:", currentUser);

}

    /* ---------- Events ---------- */

    editProfileBtn.addEventListener("click", openEditProfile);

    changePasswordBtn.addEventListener("click", openChangePassword);

    /* ---------- Initialize ---------- */

    renderProfile();

});