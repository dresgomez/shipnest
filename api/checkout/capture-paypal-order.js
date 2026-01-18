export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: "Missing orderID" });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("❌ Missing PayPal env vars");
      return res.status(500).json({ error: "PayPal env vars missing" });
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

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

    // 2️⃣ CAPTURAR la orden
    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (captureData.status !== "COMPLETED") {
      console.error("❌ Capture failed:", captureData);
      return res.status(500).json({ error: "Payment not completed" });
    }

    return res.status(200).json({
      status: "COMPLETED",
      capture: captureData,
    });

  } catch (err) {
    console.error("🔥 Capture crash:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
