import React from "react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <div className="text-green-600 text-5xl mb-4">✅</div>
        <div className="text-2xl font-bold mb-2">Спасибо за заказ!</div>
        <div className="text-gray-600 mb-4 text-center">Мы свяжемся с вами для подтверждения и доставки.</div>
        <Link to="/" className="text-blue-600 hover:underline font-semibold">На главную</Link>
      </div>
    </div>
  );
} 