import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    stock: "",
    specs: {
      os: "",
      cpu: "",
      cpuModel: "",
      cpuFrequency: "",
      igpu: "",
      gpu: "",
      ram: "",
      ramConfig: "",
      ramSlots: "",
      storage: "",
      screen: "",
      ratio: "",
      pixelSize: ""
    }
  });
  const [editId, setEditId] = useState(null);
  const [existingCategories, setExistingCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");

  const defaultSpecs = {
    os: "",
    cpu: "",
    cpuModel: "",
    cpuFrequency: "",
    igpu: "",
    gpu: "",
    ram: "",
    ramConfig: "",
    ramSlots: "",
    storage: "",
    screen: "",
    ratio: "",
    pixelSize: ""
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/products");
      setProducts(res.data);
      // Получаем уникальные категории и сортируем их
      const categories = [...new Set(res.data.map(p => p.category).filter(Boolean))].sort();
      setExistingCategories(categories);
    } catch (err) {
      setError("Ошибка при загрузке товаров");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`);
      await fetchProducts();
    } catch (err) {
      setError("Ошибка при удалении товара");
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      specs: { ...defaultSpecs, ...product.specs }
    });
    setEditId(product._id);
    setCustomCategory("");
    setError("");
  };

  const handleChangeSpecs = (key, value) => {
    setForm({ ...form, specs: { ...form.specs, [key]: value } });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Название обязательно";
    if (!form.price.trim()) return "Цена обязательна";
    if (isNaN(form.price) || Number(form.price) <= 0) return "Цена должна быть положительным числом";
    if (!form.category && !customCategory.trim()) return "Категория обязательна";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const finalForm = {
        ...form,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : 0,
        category: form.category === "custom" ? customCategory.trim() : form.category,
        specs: { ...form.specs }
      };

      if (editId) {
        await axios.put(`http://localhost:3001/api/products/${editId}`, finalForm);
      } else {
        await axios.post("http://localhost:3001/api/products", finalForm);
      }
      
      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при сохранении товара");
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", description: "", price: "", image: "", brand: "", category: "", stock: "", specs: { ...defaultSpecs } });
    setCustomCategory("");
    setError("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Админ-панель</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <input 
          className="border p-1 w-full" 
          placeholder="Название" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        <input 
          className="border p-1 w-full" 
          placeholder="Описание" 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
        />
        <input 
          className="border p-1 w-full" 
          placeholder="Цена" 
          type="number" 
          value={form.price} 
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
        />
        <input 
          className="border p-1 w-full" 
          placeholder="Ссылка на картинку" 
          value={form.image} 
          onChange={(e) => setForm({ ...form, image: e.target.value })} 
        />
        <input 
          className="border p-1 w-full" 
          placeholder="Бренд" 
          value={form.brand} 
          onChange={(e) => setForm({ ...form, brand: e.target.value })} 
        />
        <input
          className="border p-1 w-full"
          placeholder="Наличие (шт.)"
          type="number"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="border p-1 w-full" placeholder="Тип матрицы (os)" value={form.specs.os} onChange={e => handleChangeSpecs('os', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Диагональ экрана, дюйм (screen)" value={form.specs.screen} onChange={e => handleChangeSpecs('screen', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Соотношение сторон (ratio)" value={form.specs.ratio} onChange={e => handleChangeSpecs('ratio', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Размер пикселя, мм (pixelSize)" value={form.specs.pixelSize} onChange={e => handleChangeSpecs('pixelSize', e.target.value)} />
          <input className="border p-1 w-full" placeholder="CPU" value={form.specs.cpu} onChange={e => handleChangeSpecs('cpu', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Модель CPU" value={form.specs.cpuModel} onChange={e => handleChangeSpecs('cpuModel', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Частота CPU" value={form.specs.cpuFrequency} onChange={e => handleChangeSpecs('cpuFrequency', e.target.value)} />
          <input className="border p-1 w-full" placeholder="iGPU" value={form.specs.igpu} onChange={e => handleChangeSpecs('igpu', e.target.value)} />
          <input className="border p-1 w-full" placeholder="GPU" value={form.specs.gpu} onChange={e => handleChangeSpecs('gpu', e.target.value)} />
          <input className="border p-1 w-full" placeholder="RAM" value={form.specs.ram} onChange={e => handleChangeSpecs('ram', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Конфиг RAM" value={form.specs.ramConfig} onChange={e => handleChangeSpecs('ramConfig', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Слоты RAM" value={form.specs.ramSlots} onChange={e => handleChangeSpecs('ramSlots', e.target.value)} />
          <input className="border p-1 w-full" placeholder="Хранилище (storage)" value={form.specs.storage} onChange={e => handleChangeSpecs('storage', e.target.value)} />
        </div>

        <select
          className="border p-1 w-full"
          value={form.category}
          onChange={(e) => {
            setForm({ ...form, category: e.target.value });
            setError("");
          }}
        >
          <option value="">Выберите категорию</option>
          {existingCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="custom">📝 Ввести свою</option>
        </select>

        {form.category === "custom" && (
          <input
            className="border p-1 w-full mt-2"
            placeholder="Новая категория"
            value={customCategory}
            onChange={(e) => {
              setCustomCategory(e.target.value);
              setError("");
            }}
          />
        )}

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {editId ? "Обновить товар" : "Добавить товар"}
          </button>
          {editId && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={resetForm}
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product._id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{product.name}</div>
              <div className="text-sm">{product.description}</div>
              <div className="text-sm text-gray-500">Бренд: {product.brand}</div>
              <div className="text-sm text-gray-500">Категория: {product.category}</div>
              <div className="text-sm text-green-600">{product.price} ₸</div>
            </div>
            <div className="flex gap-2">
              <button 
                className="text-blue-600 font-bold hover:text-blue-800" 
                onClick={() => handleEdit(product)}
              >
                Редактировать
              </button>
              <button 
                className="text-red-600 font-bold hover:text-red-800" 
                onClick={() => handleDelete(product._id)}
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
