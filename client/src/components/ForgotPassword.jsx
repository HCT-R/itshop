import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:3001/api/auth/forgot", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка отправки");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Восстановление пароля</h2>
        {sent ? (
          <div className="text-green-600 text-center font-semibold mb-2">
            Если email зарегистрирован, инструкция отправлена.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-center text-red-600 text-sm font-semibold mb-2">{error}</div>}
            <input
              type="email"
              placeholder="Ваш email"
              className="border border-gray-200 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full py-3 font-bold text-lg shadow hover:bg-blue-700 transition"
            >
              Восстановить
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 