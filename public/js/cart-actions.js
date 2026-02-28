// js/cart-actions.js
console.log("TEST CART ACTIONS");

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-button");
  if (!payBtn) return;

  payBtn.addEventListener("click", () => {
    console.log("🟡 PAY CLICK");

    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      alert("Please select at least one product to continue.");
      return;
    }

    // 🔒 UX
    payBtn.disabled = true;
    payBtn.textContent = "Redirecting...";

    // 💾 Guardar para checkout
    localStorage.setItem(
      "checkout_items",
      JSON.stringify(selectedItems)
    );

    // 🚀 Ir al checkout
    window.location.href = "checkout.html";
  });
});