import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res) {

try {

const db = await getDb();

const products = await db
.collection("products")
.find({})
.sort({ createdAt: -1 })
.toArray();

res.status(200).json({
success: true,
products
});

} catch (err) {

console.error("Products error:", err);

res.status(500).json({
error: "Failed to load products"
});

}

}