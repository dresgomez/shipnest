import { getDb } from "../../lib/mongodb.js";

export default async function handler(req, res){

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"});
}

try{

const db = await getDb();

const product = req.body;

const newProduct = {
name: product.name,
price: product.price,
image: product.image,
category: product.category || "general",
description: product.description || "",
createdAt: new Date()
};

await db.collection("products").insertOne(newProduct);

res.status(200).json({success:true});

}catch(err){

console.error("Product create error:",err);

res.status(500).json({error:"Failed to create product"});

}

}