const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверяем наличие токена
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt_secret_key"); // замени на процесс из .env, если хочешь
    req.user = decoded; // userId и email будут в req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Неверный токен" });
  }
};
