import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in">
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-2" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-green-600 font-bold">{product.price} ₸</span>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200 transform hover:scale-110 shadow"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
