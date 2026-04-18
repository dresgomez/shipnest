import { getDb } from "../../lib/mongodb.js";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "../../lib/auth.js";

export default async function handler(req, res) {
console.log("HEADER:", req.headers.authorization);
console.log("EXPECTED:", `Bearer ${process.env.ADMIN_TOKEN}`);

   if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const db = await getDb();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const data = req.body;

    const updateData = {
      name: data.name,
      price: parseInt(data.price),
      image: data.image,
      category: data.category || "general",
      description: data.description || "",
      stock: Number(data.stock) || 0
    };

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update" });
  }
}