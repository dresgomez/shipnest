export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    // 🔐 Recalcular total en el servidor
    let total = 0;

    for (const item of items) {
      if (!item.price || !item.quantity) {
        return res.status(400).json({ error: "Item inválido" });
      }
      total += item.price * item.quantity;
    }

    // Convertir de centavos a reales
    const totalBRL = (total / 100).toFixed(2);

    // 1. Obtener access token
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenResponse.json();

    // 2. Crear orden PayPal
    const orderResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "BRL",
                value: totalBRL,
              },
            },
          ],
        }),
      }
    );

    const orderData = await orderResponse.json();

    return res.status(200).json({ id: orderData.id });

  } catch (error) {
    console.error("PayPal error:", error);
    return res.status(500).json({ error: "Error creating PayPal order" });
  }
}
