const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = router;
