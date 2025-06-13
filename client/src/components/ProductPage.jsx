import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart, setCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    setCart([...cart, product]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div>Загрузка...</div>;
  if (!product) return <div>Товар не найден</div>;

  // Пример расчёта скидки и старой цены (если есть поле oldPrice, иначе имитируем)
  const oldPrice = product.oldPrice || (product.price ? Math.round(product.price * 1.06) : null);
  const discount = oldPrice && oldPrice > product.price ? Math.round(100 - (product.price / oldPrice) * 100) : null;
  const economy = oldPrice && oldPrice > product.price ? oldPrice - product.price : null;

  // Основные характеристики (пример)
  const mainSpecs = [
    { label: "Тип матрицы", value: product.specs?.os || "-" },
    { label: "Диагональ экрана, дюйм", value: product.specs?.screen || "-" },
    { label: "Соотношение сторон", value: product.specs?.ratio || "-" },
    { label: "Размер пикселя, мм", value: product.specs?.pixelSize || "-" },
  ];

  // Индикатор наличия и текст для кнопки
  let inStock = typeof product.stock === 'number' ? product.stock : 0;
  let isAvailable = inStock > 0;
  let stockBarWidth = inStock > 10 ? 100 : inStock * 10;
  let buttonText = isAvailable ? 'Купить' : 'Нет в наличии';

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded shadow p-6 relative animate-fade-in">
      {/* Хлебные крошки */}
      <nav className="text-sm text-gray-500 mb-2 flex gap-2">
        <Link to="/">itshop</Link>
        <span>/</span>
        <Link to="/">Мониторы</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* Название и Sale */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {discount && <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">Sale! -{discount}%</span>}
      </div>

      {/* Основной блок */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Галерея */}
        <div className="md:w-1/2 flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-contain bg-gray-50 rounded mb-2"
          />
          {/* Миниатюры (если будет массив картинок) */}
        </div>
        {/* Информация */}
        <div className="md:w-1/2 flex flex-col gap-3">
          {/* Цена и скидка */}
          <div className="flex items-end gap-4 mb-2">
            {oldPrice && oldPrice > product.price && (
              <span className="text-gray-400 line-through text-lg">{oldPrice} ₸</span>
            )}
            <span className="text-2xl font-bold text-gray-900">{product.price} ₸</span>
          </div>
          {economy && (
            <div className="text-green-700 text-sm mb-1">Вы экономите {economy} ₸</div>
          )}
          {/* Кредит/рассрочка (пример) */}
          <div className="text-sm text-gray-600 mb-2">
            В кредит: <b>{Math.ceil(product.price / 60)} ₸ x 60 мес</b> &nbsp;|&nbsp;
            В рассрочку: <b>{Math.ceil(product.price / 12)} ₸ x 12 мес</b>
          </div>
          {/* Индикатор наличия */}
          <div className="flex items-center gap-2 mb-2">
            <span className={isAvailable ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {isAvailable ? `В наличии: ${inStock} шт.` : "Нет в наличии"}
            </span>
            <div className="w-32 h-2 bg-green-200 rounded overflow-hidden">
              <div className={isAvailable ? "bg-green-500 h-2" : "bg-gray-400 h-2"} style={{ width: `${stockBarWidth}%` }}></div>
            </div>
          </div>
          {/* Кнопка купить */}
          <button
            onClick={addToCart}
            className={`bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded w-full mb-2 transition duration-200 transform hover:scale-105 shadow ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={!isAvailable}
          >
            {buttonText}
          </button>
          {/* Фиксированное уведомление */}
          {added && (
            <div style={{position: 'fixed', top: 24, right: 24, zIndex: 1000}} className="bg-green-600 text-white px-6 py-3 rounded shadow-lg font-semibold animate-fade-in">
              Товар добавлен в корзину!
            </div>
          )}
          {/* Основные характеристики */}
          <div className="mt-4">
            <div className="font-semibold mb-2">Основные характеристики:</div>
            <ul className="text-sm">
              {mainSpecs.map((spec, idx) => (
                <li key={idx} className="flex justify-between border-b border-dotted border-gray-200 py-1">
                  <span>{spec.label}:</span>
                  <span className="font-medium">{spec.value}</span>
                </li>
              ))}
            </ul>
            <Link to="#" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Все характеристики</Link>
          </div>
        </div>
      </div>
      {/* Описание */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Описание</h2>
        <div className="text-gray-800 text-sm">{product.description}</div>
      </div>
    </div>
  );
}
