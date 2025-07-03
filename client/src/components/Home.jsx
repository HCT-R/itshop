import React, { useEffect, useState, useMemo, useReducer, useRef, useCallback } from "react";
import axios from "axios";
import FilterPanel from "./FilterPanel";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Banner from "./Banner";
import Advantages from "./Advantages";
import Brands from "./Brands";
import Reviews from "./Reviews";
import QuickViewModal from "./QuickViewModal";
import { FaSearch, FaTag } from "react-icons/fa";

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_MIN_PRICE':
      return { ...state, minPrice: action.payload };
    case 'SET_MAX_PRICE':
      return { ...state, maxPrice: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    default:
      return state;
  }
}

const SearchInput = React.memo(({ value, onChange }) => (
  <div className="relative w-full mb-4">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
    <input
      type="text"
      placeholder="Поиск..."
      value={value}
      onChange={onChange}
      className="border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full text-lg shadow-sm placeholder:text-base placeholder:text-gray-400 hover:shadow-md"
      style={{ minWidth: 0, maxWidth: '100%', fontWeight: 500 }}
    />
  </div>
));

const CategoryInput = React.memo(({ value, onChange }) => (
  <div className="relative w-full mb-4">
    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
    <input
      type="text"
      placeholder="Категория"
      value={value}
      onChange={onChange}
      className="border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full text-lg shadow-sm placeholder:text-base placeholder:text-gray-400 hover:shadow-md"
      style={{ minWidth: 0, maxWidth: '100%', fontWeight: 500 }}
    />
  </div>
));

// Форматирование цены с пробелами
function formatPrice(price) {
  return price?.toLocaleString('ru-RU');
}

function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filters, dispatch] = useReducer(filtersReducer, {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    brands: [],
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const { cart, setCart } = useCart();

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    }
  }, [products]);

  useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: search });
  }, [search]);

  useEffect(() => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  }, [category]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const openQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchName = search ? product.name?.toLowerCase().includes(search.toLowerCase()) : true;
      const matchCategory = category ? product.category?.toLowerCase().includes(category.toLowerCase()) : true;
      const matchMinPrice = filters.minPrice ? product.price >= Number(filters.minPrice) : true;
      const matchMaxPrice = filters.maxPrice ? product.price <= Number(filters.maxPrice) : true;
      const matchBrand = filters.brands.length > 0 ? filters.brands.includes(product.brand) : true;
      return matchName && matchCategory && matchMinPrice && matchMaxPrice && matchBrand;
    });
    if (sort === "price-asc") result = result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = result.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") result = result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") result = result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [products, search, category, filters.minPrice, filters.maxPrice, filters.brands, sort]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Banner />
      <Advantages />
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="w-full lg:w-1/4">
          <div className="flex flex-col gap-2 mb-4">
            <SearchInput value={search} onChange={handleSearchChange} />
            <CategoryInput value={category} onChange={handleCategoryChange} />
          </div>
          <FilterPanel
            filters={filters}
            dispatch={dispatch}
            sort={sort}
            setSort={setSort}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-md p-3 sm:p-4 flex flex-col items-center min-h-[180px] sm:min-h-[340px] transition-transform duration-200 hover:scale-105 hover:shadow-xl border border-gray-100 relative w-full">
                {product.isNew && (
                  <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full animate-pulse">Новинка</span>
                )}
                {typeof product.stock === 'number' && (
                  <span className={`absolute top-2 sm:top-3 right-2 sm:right-3 text-xs font-bold px-2 sm:px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>{product.stock > 0 ? 'В наличии' : 'Нет в наличии'}</span>
                )}
                <button onClick={() => openQuickView(product)} className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-blue-100 text-blue-600 rounded-full p-2 shadow hover:bg-blue-200 transition z-10" title="Быстрый просмотр">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z' /></svg>
                </button>
                <Link to={`/product/${product._id}`} className="w-full flex items-center justify-center mb-2 sm:mb-3">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-lg overflow-hidden border bg-gray-50">
                    <img
                      src={`http://localhost:3001${product.images[0]}`}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ width: '100%', height: '100%' }} />
                  </div>
                </Link>
                <h3 className="text-sm sm:text-base font-semibold text-center mb-1 line-clamp-2 min-h-[2.2em]">{product.name}</h3>
                <p className="text-xs text-gray-500 text-center mb-1 line-clamp-2 min-h-[2.2em]">{product.description}</p>
                <div className="flex justify-between w-full mt-auto mb-2">
                  <span className="text-xs text-gray-400">{t('product.brand')}: <span className="text-gray-700 font-medium">{product.brand}</span></span>
                  <span className="text-xs text-gray-400">{t('product.category')}: <span className="text-gray-700 font-medium">{product.category}</span></span>
                </div>
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-blue-600 font-bold text-base sm:text-lg">{formatPrice(product.price)} ₸</span>
                </div>
                <div className="flex flex-row gap-2 sm:gap-3 w-full mt-2 justify-center">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center gap-2 font-semibold shadow transition hover:bg-blue-700 bg-blue-600 text-white rounded-full text-xs sm:text-sm px-3 sm:px-4 w-full sm:w-[140px] h-[38px] sm:h-[44px] min-h-[38px] sm:min-h-[44px]"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9' /></svg>
                    {t('buttons.addToCart')}
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    className="flex items-center justify-center gap-2 font-semibold shadow transition hover:bg-blue-50 bg-white border border-blue-600 text-blue-600 rounded-full text-xs sm:text-sm px-3 sm:px-4 w-full sm:w-[140px] h-[38px] sm:h-[44px] min-h-[38px] sm:min-h-[44px]"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12H9m12 0A9 9 0 113 12a9 9 0 0118 0z' /></svg>
                    {t('buttons.more')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Brands />
      <Reviews />
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={closeQuickView} onAddToCart={() => { addToCart(quickViewProduct); closeQuickView(); }} />
      )}
      {showAddedNotification && (
        <div
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000 }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-fade-in"
        >
          Товар добавлен в корзину
        </div>
      )}
    </div>
  );
}

export default React.memo(Home);