const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.items;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: item.currency,
          unit_amount: item.unit_amount,
          product_data: {
            name: item.name,
          },
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: req.body.successUrl,
      cancel_url: req.body.cancelUrl,
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Error creating Stripe session" });
  }
});

module.exports = router;
