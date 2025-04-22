import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return alert("Пожалуйста, заполните все поля");

    try {
      await axios.post("http://localhost:3001/api/orders", {
        name,
        phone,
        items: cartItems,
      });
      alert("Спасибо за заказ!");
      clearCart();
      navigate("/");
    } catch (err) {
      console.error("Ошибка при отправке заказа:", err);
      alert("Ошибка оформления заказа");
    }
  };

  if (cartItems.length === 0) {
    return <p className="p-4">Корзина пуста.</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Оформить заказ
        </button>
      </form>
    </div>
  );
}
