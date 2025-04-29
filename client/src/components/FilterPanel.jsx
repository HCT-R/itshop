import React from "react";

const availableBrands = ["HP", "ASUS", "Acer", "Apple", "Lenovo"];

export default function FilterPanel({ filters, setFilters }) {
  const toggleBrand = (brand) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: updated });
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <input type="text" placeholder="Поиск..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="border p-2 rounded" />
        <input type="text" placeholder="Категория" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="border p-2 rounded" />
        <input type="number" placeholder="Мин. цена" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="border p-2 rounded w-28" />
        <input type="number" placeholder="Макс. цена" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="border p-2 rounded w-28" />
      </div>
      <div className="flex gap-4 flex-wrap">
        {availableBrands.map((brand) => (
          <label key={brand} className="flex items-center gap-2">
            <input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleBrand(brand)} />
            {brand}
          </label>
        ))}
      </div>
    </div>
  );
}
