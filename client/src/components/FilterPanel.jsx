import React, { useState, useCallback } from "react";
import {
  FaMoneyBillWave,
  FaTrademark,
  FaSortAmountDown,
  FaFilter,
} from "react-icons/fa";

const availableBrands = ["HP", "ASUS", "Acer", "Apple", "Lenovo"];

function FilterPanel({ filters, dispatch, sort, setSort, priceRange }) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleBrand = useCallback(
    (brand) => {
      const updated = filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand];
      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    [filters.brands, dispatch]
  );

  const handleMinPriceChange = useCallback(
    (e) => {
      const value = Number(e.target.value);
      dispatch({
        type: "SET_MIN_PRICE",
        payload: Math.min(value, filters.maxPrice || priceRange.max),
      });
    },
    [dispatch, filters.maxPrice, priceRange.max]
  );

  const handleMaxPriceChange = useCallback(
    (e) => {
      const value = Number(e.target.value);
      dispatch({
        type: "SET_MAX_PRICE",
        payload: Math.max(value, filters.minPrice || priceRange.min),
      });
    },
    [dispatch, filters.minPrice, priceRange.min]
  );

  const FilterContent = () => (
    <>
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap flex-1 items-start sm:items-center">
        <div className="flex flex-col items-start sm:items-center w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-1">
            <FaMoneyBillWave className="text-gray-400" />
            <span className="text-xs text-gray-500">Цена</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.minPrice || priceRange.min}
                onChange={handleMinPriceChange}
                className="w-full sm:w-24 accent-blue-600"
              />
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice || priceRange.max}
                onChange={handleMaxPriceChange}
                className="w-full sm:w-24 accent-blue-600"
              />
            </div>
            <span className="text-xs text-gray-500">
              {filters.minPrice || priceRange.min}₸ -{" "}
              {filters.maxPrice || priceRange.max}₸
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 max-w-xs mx-auto mb-3">
          <FaSortAmountDown className="text-gray-400 text-lg" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent outline-none border-none focus:ring-0 text-base min-w-[120px] max-w-[140px]"
          >
            <option value="default">Сортировка</option>
            <option value="price-asc">Сначала дешёвые</option>
            <option value="price-desc">Сначала дорогие</option>
            <option value="name-asc">По названию (А-Я)</option>
            <option value="name-desc">По названию (Я-А)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center mt-4 sm:mt-0">
        {availableBrands.map((brand) => (
          <label
            key={brand}
            className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full cursor-pointer border border-blue-200 hover:bg-blue-100 transition"
          >
            <FaTrademark className="text-blue-400" />
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              className="accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">{brand}</span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <button
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
      >
        <FaFilter />
        <span>{isMobileFiltersOpen ? "Скрыть фильтры" : "Показать фильтры"}</span>
      </button>

      <div className="hidden lg:block">
        <FilterContent />
      </div>

      <div className={`lg:hidden ${isMobileFiltersOpen ? "block" : "hidden"}`}>
        <FilterContent />
      </div>
    </div>
  );
}

export default FilterPanel;
