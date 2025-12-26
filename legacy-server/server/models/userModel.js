// server/models/userModel.js
const { getDB } = require("../db/mongo");
const bcrypt = require("bcrypt");

async function createUser(user) {
  const db = getDB();
  const col = db.collection("users");
  const hashed = await bcrypt.hash(user.password, 10);
  const res = await col.insertOne({ email: user.email, password: hashed, createdAt: new Date() });
  return res.insertedId;
}

async function findByEmail(email) {
  const db = getDB();
  return await db.collection("users").findOne({ email });
}

module.exports = { createUser, findByEmail };