import React from "react";

const advantages = [
  { icon: "🚚", title: "Быстрая доставка" },
  { icon: "💳", title: "Удобная оплата" },
  { icon: "🔒", title: "Гарантия качества" },
  { icon: "☎️", title: "Поддержка 24/7" },
];

export default function Advantages() {
  return (
    <section className="flex flex-wrap justify-center gap-4 sm:gap-8 my-6 sm:my-10">
      {advantages.map((adv, idx) => (
        <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow p-4 sm:p-6 w-full sm:w-48 min-h-[120px] sm:min-h-[160px] justify-center">
          <div className="bg-blue-600 text-white text-2xl sm:text-3xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-2 sm:mb-3 shadow-md">{adv.icon}</div>
          <div className="text-sm sm:text-base font-semibold text-gray-900 text-center">{adv.title}</div>
        </div>
      ))}
    </section>
  );
} 