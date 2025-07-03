require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Создаем директорию uploads, если она не существует
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Обслуживание статических файлов из директории uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
