import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const Catalog = () => {
  const navigate = useNavigate();

  return (
    <div className="catalog-categories px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Категории товаров</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="category-card bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/catalog/${cat.slug}`)}
          >
            <img src={cat.image} alt={cat.name} className="w-32 h-32 object-contain mb-4" />
            <h2 className="text-xl font-semibold">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog; 