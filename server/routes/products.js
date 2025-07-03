const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");

// Получить все товары
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавить товар с загрузкой изображений
router.post("/", upload.array('images', 10), async (req, res) => {
  try {
    // Преобразуем specs из FormData в объект
    if (!req.body.specs || typeof req.body.specs !== 'object') {
      const specs = {};
      Object.keys(req.body).forEach(key => {
        const match = key.match(/^specs\[(.+)\]$/);
        if (match) {
          specs[match[1]] = req.body[key];
        }
      });
      req.body.specs = specs;
    }
    // Преобразуем specs в plain-object, если это объект с null prototype
    if (req.body.specs && typeof req.body.specs === 'object' && !(req.body.specs instanceof Map)) {
      req.body.specs = Object.fromEntries(Object.entries(req.body.specs));
    }
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const productData = {
      ...req.body,
      images: imageUrls
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Ошибка при создании товара:', err);
    res.status(500).json({ message: "Ошибка при создании товара" });
  }
});

// Обновление товара с загрузкой изображений
router.put("/:id", upload.array('images', 10), async (req, res) => {
  try {
    // Преобразуем specs из FormData в объект
    if (!req.body.specs || typeof req.body.specs !== 'object') {
      const specs = {};
      Object.keys(req.body).forEach(key => {
        const match = key.match(/^specs\[(.+)\]$/);
        if (match) {
          specs[match[1]] = req.body[key];
        }
      });
      req.body.specs = specs;
    }
    // Преобразуем specs в plain-object, если это объект с null prototype
    if (req.body.specs && typeof req.body.specs === 'object' && !(req.body.specs instanceof Map)) {
      req.body.specs = Object.fromEntries(Object.entries(req.body.specs));
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Если загружены новые изображения, добавляем их к существующим
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/${file.filename}`);
      // Проверяем, чтобы общее количество изображений не превышало 10
      const totalImages = [...(product.images || []), ...newImageUrls];
      if (totalImages.length > 10) {
        return res.status(400).json({ message: "Максимальное количество изображений - 10" });
      }
      req.body.images = totalImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error('Ошибка при обновлении товара:', err);
    res.status(500).json({ message: "Ошибка при обновлении товара" });
  }
});

// Удалить изображение товара
router.delete("/:id/images/:imageIndex", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({ message: "Неверный индекс изображения" });
    }

    // Удаляем изображение из массива
    product.images.splice(imageIndex, 1);
    await product.save();
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении изображения" });
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

module.exports = router; // ❗️Это обязательно!
