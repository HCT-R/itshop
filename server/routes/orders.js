const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

// Эндпоинт для получения заказов авторизованного пользователя (GET /my)
router.get("/my", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Токен не передан." });
  }
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Неверный токен." });
    }
    Order.find({ user: decoded.userId }).sort({ createdAt: -1 }).then(orders => res.json(orders)).catch(err => res.status(500).json({ error: "Ошибка при получении заказов." }));
  });
});

// Создать заказ (POST /)
router.post("/", async (req, res) => {
  const { name, phone, items } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;
  if (token) {
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (!err) { userId = decoded.userId; }
    });
  }
  try {
    // Проверка наличия товара на складе (можно реализовать дополнительно)
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(400).json({ error: `Товар не найден: ${item.name}` });
      }
      if (typeof product.stock !== 'number' || product.stock < 1) {
        return res.status(400).json({ error: `Недостаточно товара на складе: ${item.name}` });
      }
    }
    const newOrder = new Order({ user: userId, name, phone, items });
    await newOrder.save();
    res.status(201).json({ message: "Заказ создан" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании заказа." });
  }
});

module.exports = router;
