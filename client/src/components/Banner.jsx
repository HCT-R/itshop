import React from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="bg-blue-600 text-white py-6 px-4 rounded-lg shadow mb-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">itshop</h1>
      <p className="text-base md:text-lg mb-4">Лучший выбор техники для вас</p>
      <Link to="/catalog" className="bg-white text-blue-600 font-semibold px-5 py-2 rounded shadow hover:bg-blue-50 transition text-base">В каталог</Link>
    </section>
  );
} 