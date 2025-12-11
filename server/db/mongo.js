const { MongoClient } = require("mongodb");

// Crear instancia del cliente sin opciones antiguas
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
    }
}

module.exports = { client, connectDB };