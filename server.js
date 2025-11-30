const express = require("express");
const path = require("path");
const app = express();

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal → carga el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});