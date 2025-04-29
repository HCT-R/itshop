
import React from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const context = useCart();

  if (!context || !context.cart) {
    return <p>Загрузка оформления заказа...</p>;
  }

  const { cart } = context;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста. Добавьте товары перед оформлением.</p>
      ) : (
        <div>
          <p className="mb-2">Вы покупаете <strong>{cart.length}</strong> товаров на сумму <strong>{total} ₸</strong>.</p>
          <p className="text-green-600 mt-4 font-semibold">Спасибо за покупку!✅</p>
        </div>
      )}
    </div>
  );
}
