import { getDb } from "../../lib/mongodb.js";
import { verifyAdmin } from "../../lib/auth.js";

export default async function handler(req, res){
console.log("HEADER:", req.headers.authorization);
console.log("EXPECTED:", `Bearer ${process.env.ADMIN_TOKEN}`);

    if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }    

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"});
}

try{

const db = await getDb();

const product = req.body;

const newProduct = {
name: product.name,
price: Number(product.price),
image: product.image,
category: product.category || "general",
description: product.description || "",
stock: Number(product.stock) || 0,
createdAt: new Date()
};

await db.collection("products").insertOne(newProduct);

res.status(200).json({success:true});

}catch(err){

console.error("Product create error:",err);

res.status(500).json({error:"Failed to create product"});

}

}