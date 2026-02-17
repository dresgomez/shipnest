// js/cart-actions.js

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-button");
  if (!payBtn) return;

  payBtn.addEventListener("click", () => {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
      alert("Please select at least one product to continue.");
      return;
    }

    // 🔒 UX: bloquear botón
    payBtn.disabled = true;
    const originalText = payBtn.textContent;
    payBtn.textContent = "Redirecting...";

    // 💾 Guardar selección para checkout
    localStorage.setItem(
      "checkout_items",
      JSON.stringify(selectedItems)
    );

    // 🚀 Ir al checkout
    window.location.href = "checkout.html";
  });
});
