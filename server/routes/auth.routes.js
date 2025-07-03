const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require('crypto');

// 🔐 Логин
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 🔐 Регистрация
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны." });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "Пользователь с таким email уже существует." });
  }
  const hash = await bcrypt.hash(password, 10);
  const newName = (name) ? name : (email.split("@")[0] || "User");
  const newUser = new User({ email, password: hash, name: newName });
  newUser.save().then(() => res.status(201).json({ message: "Регистрация успешна" })).catch(err => res.status(500).json({ error: "Ошибка при регистрации." }));
});

// Получить данные текущего пользователя
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновить данные текущего пользователя
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    // Обновляем только разрешённые поля
    const { name, email, phone } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ message: "Данные профиля обновлены", user });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при обновлении профиля" });
  }
});

// Добавить адрес
router.post("/address", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    const { address } = req.body;
    if (!address || typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ message: "Некорректный адрес" });
    }
    user.addresses = user.addresses || [];
    user.addresses.push(address.trim());
    await user.save();
    res.json({ message: "Адрес добавлен", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении адреса" });
  }
});

// Удалить адрес по индексу
router.delete("/address/:idx", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    const idx = parseInt(req.params.idx, 10);
    if (isNaN(idx) || idx < 0 || idx >= (user.addresses?.length || 0)) {
      return res.status(400).json({ message: "Некорректный индекс адреса" });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    res.json({ message: "Адрес удалён", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении адреса" });
  }
});

// Восстановление пароля: запрос на email
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обязателен' });
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'Если email зарегистрирован, инструкция отправлена' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 минут
  await user.save();
  // Здесь должна быть отправка email, но для теста выводим ссылку в консоль
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
  console.log('Сброс пароля для', email, ':', resetUrl);
  res.json({ message: 'Если email зарегистрирован, инструкция отправлена' });
});

// Восстановление пароля: сброс
router.post('/reset', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Токен и новый пароль обязательны' });
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Ссылка устарела или неверна' });
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Пароль успешно изменён' });
});

module.exports = router;
