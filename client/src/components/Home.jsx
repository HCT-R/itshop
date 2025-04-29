
import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterPanel from "./FilterPanel";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    brands: []
  });

  const { cart, setCart } = useCart();

  useEffect(() => {
    axios.get("http://localhost:3001/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const filteredProducts = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = filters.category
      ? product.category?.toLowerCase().includes(filters.category.toLowerCase())
      : true;
    const matchMinPrice = filters.minPrice ? product.price >= Number(filters.minPrice) : true;
    const matchMaxPrice = filters.maxPrice ? product.price <= Number(filters.maxPrice) : true;
    const matchBrand = filters.brands.length > 0 ? filters.brands.includes(product.brand) : true;

    return matchName && matchCategory && matchMinPrice && matchMaxPrice && matchBrand;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Каталог</h2>
      <FilterPanel filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border rounded shadow-sm p-4">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-sm text-gray-500">Бренд: {product.brand}</p>
            <p className="text-sm text-gray-500">Категория: {product.category}</p>
            <p className="text-green-600 font-semibold">{product.price} ₸</p>
            <button onClick={() => addToCart(product)} className="bg-green-500 text-white px-4 py-1 rounded mt-2">
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
