const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Получить все товары
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавить товар
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const product = new Product({ name, description, price, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании товара" });
  }
});

// Удалить товар
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Товар удалён" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении" });
  }
});

module.exports = router; // ❗️Это обязательно!
