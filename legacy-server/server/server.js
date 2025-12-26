require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS correcto: solo tu frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);


app.use(express.json());

// Servir tu carpeta pública
app.use(express.static(path.join(__dirname, "../public")));

// Rutas Stripe
const checkoutRoutes = require("./routes/checkout");
app.use("/api/checkout", checkoutRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
