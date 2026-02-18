import clientPromise from "../lib/mongo";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      ok: true,
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "MongoDB connection failed",
    });
  }
}
