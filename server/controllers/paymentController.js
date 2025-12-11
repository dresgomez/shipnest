// server/controllers/paymentController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getDB } = require("../db/mongo");

async function createCheckoutSession(req, res) {
  try {
    const { items, currency = "usd" } = req.body;

    // items: [{ id, title, unit_amount, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No hay items en el carrito" });
    }

    // construir line_items para Stripe
    const line_items = items.map((it) => ({
      price_data: {
        currency,
        product_data: {
          name: it.title,
        },
        unit_amount: Math.round(it.unit_amount), // en centavos
      },
      quantity: it.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart`,
    });

    // opcional: guardar orden provisional en Mongo (status: pending)
    try {
      const db = getDB();
      const ordersCol = db.collection("orders");
      const orderDoc = {
        sessionId: session.id,
        items,
        status: "pending",
        createdAt: new Date(),
        currency,
      };
      await ordersCol.insertOne(orderDoc);
    } catch (e) {
      console.warn("No se pudo guardar orden provisional:", e.message);
    }

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Error createCheckoutSession:", err);
    res.status(500).json({ error: err.message || "Error creando sesión" });
  }
}

module.exports = { createCheckoutSession };