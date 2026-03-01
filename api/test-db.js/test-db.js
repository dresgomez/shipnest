import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  try {
    const db = await getDb();

    const result = await db.collection("orders").insertOne({
      test: true,
      createdAt: new Date(),
    });

    return res.status(200).json({
      ok: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Mongo test error:", err);
    return res.status(500).json({ ok: false });
  }
}