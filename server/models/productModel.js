// server/models/productModel.js
const { getDB } = require("../db/mongo");

async function listProducts(filter = {}) {
  const db = getDB();
  const col = db.collection("products");
  return await col.find(filter).toArray();
}

async function getProductById(id) {
  const db = getDB();
  const col = db.collection("products");
  return await col.findOne({ id });
}

module.exports = { listProducts, getProductById };