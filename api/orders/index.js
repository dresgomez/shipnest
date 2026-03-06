import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const db = await getDb();

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (err) {

    console.error("❌ Orders fetch error:", err);

    return res.status(500).json({
      error: "Failed to fetch orders"
    });

  }

}