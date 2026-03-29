import { getDb } from "../../lib/mongodb.js";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("ENV CHECK", {
  hasId: !!process.env.PAYPAL_CLIENT_ID,
  hasSecret: !!process.env.PAYPAL_CLIENT_SECRET
});
try {
  const { items } = req.body;

  // ✅ Validación fuerte del carrito
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid items" });
  }

  for (const item of items) {
    if (!item.quantity || item.quantity <= 0) {
      return res.status(400).json({ error: "Invalid item quantity" });
    }
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

  // ... sigue el flujo


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

    // 2️⃣ Calcular total (centavos → reales)
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const db = await getDb();

for (const item of items) {

  console.log("ITEM:", item);

  const product = await db.collection("products").findOne({
  id: product._id
  });

 console.log("PRODUCT:", product);

  if (!product) {
    return res.status(400).json({ error: "Product not found" });
  }

  if (product.stock < item.quantity) {
    return res.status(400).json({
      error: `Not enough stock for ${product.name}`
    });
  }
}

    // 3️⃣ Crear orden PayPal
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
                value: (total / 100).toFixed(2),
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
