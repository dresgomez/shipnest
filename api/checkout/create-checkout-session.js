const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No hay items" });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name
          },
          unit_amount: item.unit_amount
        },
        quantity: item.quantity
      })),
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Error creando sesión de pago" });
  }
};
