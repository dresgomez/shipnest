import fetch from "node-fetch";
import { getDb } from "../../lib/mongodb.js";
import { ObjectId } from "mongodb";
console.log("🟢 CAPTURE API LOADED");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
     console.log("🟢 CAPTURE HANDLER STARTED");
    const { orderID, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
  return res.status(400).json({
    error: "Invalid items"
  });
}

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

const validatedItems = [];

for (const item of items) {

  const productId = item.id || item._id;

  if (!productId || !ObjectId.isValid(productId)) {
    return res.status(400).json({
      error: "Invalid product ID"
    });
  }

  if (!item.quantity || item.quantity <= 0) {
    return res.status(400).json({
      error: "Invalid item quantity"
    });
  }

  const product = await db.collection("products").findOne({
    _id: new ObjectId(productId)
  });

  if (!product) {
    return res.status(400).json({
      error: "Product not found"
    });
  }

  validatedItems.push({
    id: productId,
    name: product.name,
    price: product.price,
    quantity: item.quantity
  });
}

const insertedOrder = await db.collection("orders").insertOne({
  orderID,
  captureID: capture.id,
  amount: capture.amount,
 items: validatedItems, // 🔥 AQUÍ ESTÁ LA MAGIA
  status: "paid",
  provider: "paypal",
  createdAt: new Date(),
});

for (const item of validatedItems) {

  // 🧠 Debug antes de validar
  console.log("UPDATING STOCK:", item.id, item.quantity);

  // 🔒 Validación de ObjectId
  if (!ObjectId.isValid(item.id)) {
    console.error("❌ Invalid ObjectId:", item.id);
    continue;
  }

  // 🔄 Update real
 const result = await db.collection("products").updateOne(
  {
    _id: new ObjectId(item.id),
    stock: { $gte: item.quantity }
  },
  {
    $inc: { stock: -item.quantity }
  }
);

if (result.modifiedCount !== 1) {
  console.error("❌ Stock update failed:", item.id);

  return res.status(400).json({
    error: `Could not update stock for ${item.name}`
  });
}

  // 🧠 Debug después del update
  console.log("UPDATE RESULT:", result);
}

    // ✅ SOLO AQUÍ EL PAGO ES REAL
return res.status(200).json({
  status: "COMPLETED",
  orderID,
  orderMongoId: insertedOrder.insertedId.toString(),
  captureID: capture.id,
  amount: capture.amount,
});
 
  } catch (err) {
    console.error("❌ PayPal capture error:", err);
    return res.status(500).json({ error: "Capture failed" });
  }
}
