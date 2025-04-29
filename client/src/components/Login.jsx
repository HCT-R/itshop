import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", form);
      localStorage.setItem("token", res.data.token); // сохраняем токен
      setMessage("Успешный вход!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка входа.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Вход</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="email" placeholder="Email" required className="border p-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Пароль" required className="border p-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Войти</button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
