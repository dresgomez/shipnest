import bcrypt from "bcryptjs";
import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const db = await getDb();

    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      createdAt: new Date()
    };

    const result = await db.collection("users").insertOne(user);

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId.toString()
    });

  } catch (error) {

    console.error("❌ Register error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

