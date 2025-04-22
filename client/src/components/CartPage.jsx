import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Корзина пуста.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li key={index} className="border p-3 rounded flex justify-between items-center">
                <span>{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{item.price} ₸</span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg font-bold">Итого: {total} ₸</span>
            <button
              onClick={clearCart}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Очистить корзину
            </button>
          </div>

          <div className="mt-6">
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Перейти к оформлению
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
