import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const context = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!context || !context.cart) {
    return <p>{t('cart.loading', 'Загрузка корзины...')}</p>;
  }

  const { cart, setCart } = context;

  const handleQty = (idx, delta) => {
    const updated = [...cart];
    updated[idx].qty = Math.max(1, (updated[idx].qty || 1) + delta);
    setCart(updated);
  };
  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">{t('cart.title')}</h2>
      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center">
          <FaShoppingCart className="text-4xl sm:text-5xl text-blue-200 mb-4" />
          <div className="text-base sm:text-lg text-gray-500 mb-4 text-center">{t('cart.empty')}</div>
          <button 
            onClick={() => navigate("/")} 
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition w-full sm:w-auto"
          >
            В каталог
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 text-left">Товар</th>
                  <th className="py-2">Цена</th>
                  <th className="py-2">Кол-во</th>
                  <th className="py-2">Сумма</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 flex items-center gap-3">
                      <img src={`http://localhost:3001${item.images[0]}`} alt={item.name} className="w-12 h-12 rounded bg-gray-50 border object-contain" />
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.brand}</div>
                      </div>
                    </td>
                    <td className="text-center font-semibold text-blue-600">{item.price} ₸</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => handleQty(idx, -1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100"><FaMinus /></button>
                        <span className="w-6 text-center">{item.qty || 1}</span>
                        <button type="button" onClick={() => handleQty(idx, 1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100"><FaPlus /></button>
                      </div>
                    </td>
                    <td className="text-center font-bold">{item.price * (item.qty || 1)} ₸</td>
                    <td className="text-center">
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="border-b last:border-b-0 pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <img src={`http://localhost:3001${item.images[0]}`} alt={item.name} className="w-16 h-16 rounded bg-gray-50 border object-contain" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
                    <div className="text-sm font-semibold text-blue-600">{item.price} ₸</div>
                  </div>
                  <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 p-2">
                    <FaTrash />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleQty(idx, -1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100">
                      <FaMinus />
                    </button>
                    <span className="w-6 text-center">{item.qty || 1}</span>
                    <button type="button" onClick={() => handleQty(idx, 1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100">
                      <FaPlus />
                    </button>
                  </div>
                  <div className="font-bold">{item.price * (item.qty || 1)} ₸</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 pt-4 border-t">
            <div className="text-lg font-bold">{t('cart.total')}: <span className="text-blue-700">{total} ₸</span></div>
            <button 
              onClick={() => navigate("/checkout")} 
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
            >
              {t('cart.checkout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
