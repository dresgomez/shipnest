import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
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
      line_items: items.map(item => ({
        price_data: {
          currency: item.currency || "usd",
          product_data: {
            name: item.name
          },
          unit_amount: item.unit_amount
        },
        quantity: item.quantity || 1
      })),
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
}
