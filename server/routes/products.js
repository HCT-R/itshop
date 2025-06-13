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
    const product = new Product(req.body);
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

// Получение одного товара по id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении товара" });
  }
});

// Обновление товара
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при обновлении товара" });
  }
});

module.exports = router; // ❗️Это обязательно!
