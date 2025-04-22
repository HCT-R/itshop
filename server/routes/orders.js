const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Создать заказ
router.post("/", async (req, res) => {
  try {
    const { name, phone, items } = req.body;
    const newOrder = new Order({ name, phone, items });
    await newOrder.save();
    res.status(201).json({ message: "Заказ создан" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании заказа" });
  }
});

module.exports = router;
