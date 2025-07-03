import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password || password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/auth/reset", { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка сброса пароля");
    }
  };

  if (!token) {
    return <div className="flex justify-center items-center min-h-[60vh] text-red-600 font-bold">Некорректная ссылка</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold mb-2">Пароль успешно изменён! Перенаправление...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-center text-red-600 text-sm font-semibold mb-2">{error}</div>}
            <input
              type="password"
              placeholder="Новый пароль"
              className="border border-gray-200 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Повторите пароль"
              className="border border-gray-200 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full py-3 font-bold text-lg shadow hover:bg-blue-700 transition"
            >
              Сбросить пароль
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 