// server/models/orderModel.js
const { getDB } = require("../db/mongo");

async function createOrder(order) {
  const db = getDB();
  const col = db.collection("orders");
  const res = await col.insertOne({ ...order, createdAt: new Date() });
  return res.insertedId;
}

async function getOrderBySessionId(sessionId) {
  const db = getDB();
  return await db.collection("orders").findOne({ sessionId });
}

module.exports = { createOrder, getOrderBySessionId };