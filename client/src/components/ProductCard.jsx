import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// Форматирование цены с пробелами
function formatPrice(price) {
  return price?.toLocaleString('ru-RU');
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in bg-white flex flex-col min-h-[220px] sm:min-h-[280px]">
      <Link to={`/product/${product._id}`}>
        <img 
          src={`http://localhost:3001${product.images[0]}`} 
          alt={product.name} 
          className="w-full h-32 sm:h-40 object-contain mb-2" 
        />
      </Link>
      <h3 className="text-base sm:text-lg font-semibold line-clamp-2 min-h-[2.2em]">{product.name}</h3>
      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 min-h-[2.2em]">{product.description}</p>
      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="text-blue-600 font-bold text-sm sm:text-base">{formatPrice(product.price)} ₸</span>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200 transform hover:scale-110 shadow text-xs sm:text-sm"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
