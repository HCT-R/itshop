import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", form);
      localStorage.setItem("token", res.data.token); // сохраняем токен
      setMessage("Успешный вход!");
      window.location.href = "/";
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка входа.");
      setShowSuccess(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="Email" required className="border border-gray-200 rounded-full pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={showPassword ? "text" : "password"} placeholder="Пароль" required className="border border-gray-200 rounded-full pl-10 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded-full py-3 font-bold text-lg shadow hover:bg-blue-700 transition">Войти</button>
          {message && <div className="text-center text-red-600 text-sm font-semibold mt-2">{message}</div>}
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">Нет аккаунта? Зарегистрироваться</Link>
          <Link to="/forgot-password" className="text-gray-400 hover:underline">Забыли пароль?</Link>
        </div>
        {showSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold animate-fade-in z-50 transition-all">
            Успешный вход!
          </div>
        )}
      </div>
    </div>
  );
}
