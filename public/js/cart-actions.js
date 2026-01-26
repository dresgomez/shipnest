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

    // 🚀 Ir al checkout
    window.location.href = "checkout.html";
  });
});
