import { getDb } from "../../lib/mongo.js";

const db = await getDb();

export default async function handler(req, res) {
  try {
    const db = await getDb();

    const result = await db.collection("orders").insertOne({
      test: true,
      createdAt: new Date(),
    });

    res.status(200).json({
      ok: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mongo test failed" });
  }
}
