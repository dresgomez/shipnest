export default async function handler(req, res) {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: "Missing orderID" });
    }

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(
            process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
          ).toString("base64")}`
        }
      }
    );

    const result = await response.json();

    console.log("🔴 RAW PAYPAL CAPTURE RESPONSE:", result);

    return res.status(200).json(result);

  } catch (err) {
    console.error("❌ Capture error:", err);
    return res.status(500).json({ error: "Capture failed" });
  }
}
