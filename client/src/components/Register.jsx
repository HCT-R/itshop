import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", form);
      setMessage(res.data.message || "Регистрация прошла успешно!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка регистрации.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="Имя" required className="border p-2 w-full"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" required className="border p-2 w-full"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Пароль" required className="border p-2 w-full"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Зарегистрироваться</button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
