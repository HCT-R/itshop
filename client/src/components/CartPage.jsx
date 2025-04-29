
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const context = useCart();
  const navigate = useNavigate();

  if (!context || !context.cart) {
    return <p>Загрузка корзины...</p>;
  }

  const { cart, setCart } = context;

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price} ₸</p>
              </div>
              <button onClick={() => removeItem(idx)} className="text-red-600">Удалить</button>
            </div>
          ))}
          <div className="mt-4">
            <p className="font-bold">Итого: {total} ₸</p>
            <button onClick={() => navigate("/checkout")} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Перейти к оформлению</button>
          </div>
        </div>
      )}
    </div>
  );
}
