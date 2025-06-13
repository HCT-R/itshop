const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// Создать заказ
router.post("/", async (req, res) => {
  try {
    const { name, phone, items } = req.body;

    // Проверка наличия товара на складе
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(400).json({ error: `Товар не найден: ${item.name}` });
      }
      if (typeof product.stock !== 'number' || product.stock < 1) {
        return res.status(400).json({ error: `Недостаточно товара на складе: ${item.name}` });
      }
    }

    // Уменьшаем stock у каждого товара
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -1 } });
    }

    const newOrder = new Order({ name, phone, items });
    await newOrder.save();
    res.status(201).json({ message: "Заказ создан" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании заказа" });
  }
});

module.exports = router;
