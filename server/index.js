
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB подключен"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

// 🟢 маршруты
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/auth", authRoutes);

// Заглушка
app.get("/", (req, res) => {
  res.send("API работает");
});  

app.listen(process.env.PORT, () =>
  console.log(`Сервер работает на http://localhost:${process.env.PORT}`)
);
