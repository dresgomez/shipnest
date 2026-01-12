import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  return res.status(500).json({
    error: "PayPal env vars missing"
  });
}

  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!total) {
      return res.status(400).json({ error: "Total missing" });
    }

    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "BRL",
                value: total
              }
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal API error:", data);
      return res.status(500).json({ error: "PayPal order creation failed" });
    }

    return res.status(200).json({ id: data.id });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
