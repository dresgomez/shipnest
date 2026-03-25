import fetch from "node-fetch";
import { getDb } from "../../lib/mongodb.js";
console.log("🟢 CAPTURE API LOADED");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
     console.log("🟢 CAPTURE HANDLER STARTED");
    const { orderID, items } = req.body;

const cleanItems = items.map(item => ({
  id: item.id,
  name: item.name,
  price: Number(item.price),
  quantity: item.quantity
}));

    // 🔐 Validación básica
    if (!orderID) {
      return res.status(400).json({ error: "Missing orderID" });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "PayPal env vars missing" });
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    // 🔁 Captura real en PayPal
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const result = await response.json();

    console.log("🟢 PAYPAL CAPTURE RAW:", result);

    // 🔐 VALIDACIÓN CRÍTICA
    const capture =
      result?.purchase_units?.[0]?.payments?.captures?.[0];

    if (!capture || capture.status !== "COMPLETED") {
      return res.status(400).json({
        error: "Payment not completed",
        details: result,
      });
    }

// 🧠 Guardar orden en Mongo
const db = await getDb();

await db.collection("orders").insertOne({
  orderID,
  captureID: capture.id,
  amount: capture.amount,
 items: cleanItems, // 🔥 AQUÍ ESTÁ LA MAGIA
  status: "paid",
  provider: "paypal",
  createdAt: new Date(),
});

    // ✅ SOLO AQUÍ EL PAGO ES REAL
    return res.status(200).json({
      status: "COMPLETED",
      orderID,
      captureID: capture.id,
      amount: capture.amount,
    });

  } catch (err) {
    console.error("❌ PayPal capture error:", err);
    return res.status(500).json({ error: "Capture failed" });
  }
}
