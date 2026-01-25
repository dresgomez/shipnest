// js/auth.js

function getUserMode() {
  return localStorage.getItem("user_mode"); // "guest" | "user"
}

function setGuest() {
  localStorage.setItem("user_mode", "guest");
  window.location.href = "store.html";
}

function logout() {
  localStorage.removeItem("user_mode");
  window.location.href = "index.html";
}

function requireAuth() {
  const mode = getUserMode();

  if (!mode || mode === "guest") {
    alert("Debes registrarte o iniciar sesión para continuar.");
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// 👇 Exposición global (MUY IMPORTANTE)
window.getUserMode = getUserMode;
window.setGuest = setGuest;
window.logout = logout;
window.requireAuth = requireAuth;
