import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { total } = req.body;

    if (!total) {
      return res.status(400).json({ error: "Total is required" });
    }

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

    if (!tokenData.access_token) {
      console.error("PayPal token error:", tokenData);
      return res.status(500).json({ error: "PayPal auth failed" });
    }

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
                value: total.toFixed(2),
              },
            },
          ],
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderData.id) {
      console.error("PayPal order error:", orderData);
      return res.status(500).json({ error: "Order creation failed" });
    }

    res.status(200).json({ id: orderData.id });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
