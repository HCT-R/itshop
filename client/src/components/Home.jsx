import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Ошибка загрузки товаров:", err));
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
