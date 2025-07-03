import React from "react";

const reviews = [
  {
    name: "Иван П.",
    text: "Очень доволен покупкой! Быстрая доставка и отличное качество.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Мария К.",
    text: "Большой выбор товаров и приятные цены. Рекомендую!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Алексей С.",
    text: "Поддержка помогла быстро решить вопрос. Спасибо!",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg"
  }
];

export default function Reviews() {
  return (
    <section className="my-12">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Отзывы клиентов</h3>
      <div className="flex flex-wrap justify-center gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-8 max-w-sm flex flex-col items-center min-h-[220px]">
            <img src={review.avatar} alt={review.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-600 shadow" />
            <div className="text-gray-900 font-semibold mb-2 text-lg">{review.name}</div>
            <div className="text-gray-600 text-center text-base">{review.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 