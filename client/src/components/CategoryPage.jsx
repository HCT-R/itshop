import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:3001";
const placeholderImg = "/no-image.png";

// Форматирование цены с пробелами
function formatPrice(price) {
  return price?.toLocaleString('ru-RU');
}

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const { products, loading, error } = useProducts();
  const { cart, setCart } = useCart();
  const [selectedImage, setSelectedImage] = useState({});
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewImgIdx, setPreviewImgIdx] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const filteredProducts = products.filter(
    (product) => product.category === categorySlug
  );

  const openPreview = (product, imgIdx = 0) => {
    setPreviewProduct(product);
    setPreviewImgIdx(imgIdx);
  };
  const closePreview = () => setPreviewProduct(null);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setToastText(`Товар "${product.name}" добавлен в корзину!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    closePreview();
  };

  if (loading) {
    return <div className="px-8 py-8">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="px-8 py-8 text-red-600">Ошибка загрузки товаров.</div>;
  }

  return (
    <div className="px-8 py-8 relative">
      {/* Toast уведомление */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold animate-fade-in">
          {toastText}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">Товары категории: {categorySlug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-lg">Нет товаров в этой категории.</div>
        ) : (
          filteredProducts.map((product) => {
            const imgList = product.images && product.images.length > 0 ? product.images : [placeholderImg];
            const currentIdx = selectedImage[product._id] || 0;
            let imgSrc = placeholderImg;
            if (imgList[currentIdx]) {
              imgSrc = imgList[currentIdx].startsWith("/uploads")
                ? `${API_URL}${imgList[currentIdx]}`
                : imgList[currentIdx].startsWith("http")
                  ? imgList[currentIdx]
                  : `${API_URL}/uploads/${imgList[currentIdx]}`;
            }
            return (
              <div
                key={product._id || product.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-center group animate-fade-in relative min-h-[370px]"
                style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}
              >
                <div className="block w-full cursor-zoom-in" onClick={() => openPreview(product, currentIdx)}>
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-32 h-32 object-contain mb-4 mx-auto bg-gray-100 group-hover:scale-110 transition-transform rounded-lg shadow-sm border border-gray-200"
                    onError={e => { e.target.src = placeholderImg; }}
                  />
                </div>
                <Link to={`/product/${product._id || product.id}`} className="block w-full">
                  <h2 className="text-base font-semibold mb-2 group-hover:text-blue-600 transition-colors cursor-pointer min-h-[2.5em] line-clamp-2">{product.name}</h2>
                </Link>
                {/* Галерея миниатюр */}
                {imgList.length > 1 && (
                  <div className="flex gap-2 justify-center mb-2">
                    {imgList.map((img, idx) => {
                      const thumbSrc = img.startsWith("/uploads")
                        ? `${API_URL}${img}`
                        : img.startsWith("http")
                          ? img
                          : `${API_URL}/uploads/${img}`;
                      return (
                        <img
                          key={idx}
                          src={thumbSrc}
                          alt="thumb"
                          className={`w-8 h-8 object-cover rounded-lg border-2 cursor-pointer transition-all duration-150 ${currentIdx === idx ? 'border-blue-600 ring-2 ring-blue-400 scale-110' : 'border-gray-200 opacity-80 hover:opacity-100'}`}
                          onClick={() => setSelectedImage(s => ({ ...s, [product._id]: idx }))}
                          onDoubleClick={() => openPreview(product, idx)}
                          onError={e => { e.target.src = placeholderImg; }}
                        />
                      );
                    })}
                  </div>
                )}
                <div className="text-blue-600 font-bold mb-2 text-lg">{formatPrice(product.price)} ₸</div>
                <Link
                  to={`/product/${product._id || product.id}`}
                  className="mt-2 inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition group-hover:scale-105 text-base"
                >
                  Подробнее
                </Link>
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow">Новинка</span>
                )}
                {typeof product.stock === 'number' && (
                  <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>{product.stock > 0 ? 'В наличии' : 'Нет в наличии'}</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Модальное окно предпросмотра */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in" onClick={closePreview}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in" onClick={e => e.stopPropagation()}>
            <button onClick={closePreview} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold">×</button>
            <img
              src={
                previewProduct.images && previewProduct.images[previewImgIdx]
                  ? previewProduct.images[previewImgIdx].startsWith("/uploads")
                    ? `${API_URL}${previewProduct.images[previewImgIdx]}`
                    : previewProduct.images[previewImgIdx].startsWith("http")
                      ? previewProduct.images[previewImgIdx]
                      : `${API_URL}/uploads/${previewProduct.images[previewImgIdx]}`
                  : placeholderImg
              }
              alt={previewProduct.name}
              className="w-full h-80 object-contain mb-4 bg-gray-100 rounded-lg shadow border"
              onError={e => { e.target.src = placeholderImg; }}
            />
            {/* Миниатюры в модалке */}
            {previewProduct.images && previewProduct.images.length > 1 && (
              <div className="flex gap-2 justify-center mb-4">
                {previewProduct.images.map((img, idx) => {
                  const thumbSrc = img.startsWith("/uploads")
                    ? `${API_URL}${img}`
                    : img.startsWith("http")
                      ? img
                      : `${API_URL}/uploads/${img}`;
                  return (
                    <img
                      key={idx}
                      src={thumbSrc}
                      alt="thumb"
                      className={`w-10 h-10 object-cover rounded-lg border-2 cursor-pointer transition-all duration-150 ${previewImgIdx === idx ? 'border-blue-600 ring-2 ring-blue-400 scale-110' : 'border-gray-200 opacity-80 hover:opacity-100'}`}
                      onClick={() => setPreviewImgIdx(idx)}
                      onError={e => { e.target.src = placeholderImg; }}
                    />
                  );
                })}
              </div>
            )}
            <h2 className="text-xl font-bold mb-2 text-center">{previewProduct.name}</h2>
            <div className="text-blue-600 font-bold text-2xl mb-4 text-center">{formatPrice(previewProduct.price)} ₸</div>
            <div className="flex gap-2 w-full mt-2">
              <button onClick={() => handleAddToCart(previewProduct)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow">В корзину</button>
              <Link to={`/product/${previewProduct._id}`} className="flex-1 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-center shadow">Подробнее</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 