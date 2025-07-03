import React from "react";
import { Link } from "react-router-dom";

// Форматирование цены с пробелами
function formatPrice(price) {
  return price?.toLocaleString('ru-RU');
}

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold">×</button>
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden border">
            <img src={`http://localhost:3001${product.images[0]}`} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">{product.name}</h2>
          <div className="text-blue-600 font-bold text-2xl mb-2">{formatPrice(product.price)} ₸</div>
          <div className="text-gray-600 text-sm text-center mb-4 line-clamp-3">{product.description}</div>
          <div className="flex gap-2 w-full">
            <button onClick={onAddToCart} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">В корзину</button>
            <Link to={`/product/${product._id}`} className="flex-1 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-center" onClick={onClose}>Подробнее</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 