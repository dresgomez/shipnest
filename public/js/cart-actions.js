// js/cart-actions.js

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("pay-button");
  if (!payBtn) return;

  payBtn.addEventListener("click", async () => {
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
      alert("Please select at least one product to continue.");
      return;
    }

    // 🔒 UX: bloquear botón
    payBtn.disabled = true;
    const originalText = payBtn.textContent;
    payBtn.textContent = "Processing...";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: selectedItems,
          total: calculateSelectedTotal(),
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      alert("Order created successfully");

      clearCart();
      renderCart();

    } catch (err) {
      alert("Something went wrong");
      payBtn.disabled = false;
      payBtn.textContent = originalText;
    }
  });
});
