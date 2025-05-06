import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Вы не авторизованы.");
      return;
    }

    axios.get("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUser(res.data.user))
    .catch(() => setMessage("Ошибка при получении данных"));
  }, []);

  if (message) return <p className="p-4 text-red-500">{message}</p>;
  if (!user) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Личный кабинет</h2>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user._id}</p>
    </div>
  );
}
