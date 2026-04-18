import { getDb } from "../../lib/mongodb.js";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "../../lib/auth.js";

export default async function handler(req, res) {
 
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { id } = req.query;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const db = await getDb();

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
}