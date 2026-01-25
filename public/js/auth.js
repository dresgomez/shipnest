// js/auth.js

export function getUserMode() {
  return localStorage.getItem("user_mode"); // "guest" | "user"
}

export function setGuest() {
  localStorage.setItem("user_mode", "guest");
  window.location.href = "store.html";
}

export function logout() {
  localStorage.removeItem("user_mode");
  window.location.href = "index.html";
}

export function requireAuth() {
  const mode = getUserMode();

  if (!mode || mode === "guest") {
    alert("Debes registrarte o iniciar sesión para continuar.");
    window.location.href = "index.html";
    return false;
  }

  return true;
}
