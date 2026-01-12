export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("❌ Missing PayPal env vars");
      return res.status(500).json({ error: "PayPal env vars missing" });
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // 1️⃣ Obtener access token
    const tokenRes = await fetch(
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

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("❌ Token error:", tokenData);
      return res.status(500).json({ error: "Failed to get PayPal token" });
    }

    // 2️⃣ Crear orden
    const orderRes = await fetch(
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
                value: items.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                ).toFixed(2),
              },
            },
          ],
        }),
      }
    );

    const orderData = await orderRes.json();

    if (!orderData.id) {
      console.error("❌ Order error:", orderData);
      return res.status(500).json({ error: "Failed to create PayPal order" });
    }

    return res.status(200).json({ id: orderData.id });
  } catch (err) {
    console.error("🔥 PayPal backend crash:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
