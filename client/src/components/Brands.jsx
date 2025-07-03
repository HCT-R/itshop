import React from "react";

const brands = [
  { name: "HP", logo: "/brands/hp.png" },
  { name: "ASUS", logo: "/brands/asus.png" },
  { name: "Apple", logo: "/brands/apple.png" },
  { name: "Acer", logo: "/brands/acer.png" },
  { name: "Lenovo", logo: "/brands/lenovo.png" },
];

export default function Brands() {
  return (
    <section className="my-8 sm:my-12">
      <h3 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 text-gray-900">Популярные бренды</h3>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center">
        {brands.map((brand) => (
          <div key={brand.name} className="bg-white rounded-xl shadow flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 p-2 sm:p-3 transition hover:shadow-lg">
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-h-12 max-w-12 sm:max-h-16 sm:max-w-16 object-contain mx-auto"
              title={brand.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 