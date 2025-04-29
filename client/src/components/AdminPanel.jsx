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
    category: ""
  });
  const [editId, setEditId] = useState(null);
  const [existingCategories, setExistingCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost:3001/api/products").then((res) => {
      setProducts(res.data);
      const categories = [...new Set(res.data.map(p => p.category).filter(Boolean))];
      setExistingCategories(categories);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/api/products/${id}`).then(fetchProducts);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
    setCustomCategory("");
  };

  const handleSubmit = () => {
    const finalForm = { ...form };
    if (form.category === "custom" && customCategory.trim()) {
      finalForm.category = customCategory.trim();
    }

    if (editId) {
      axios.put(`http://localhost:3001/api/products/${editId}`, finalForm).then(() => {
        resetForm();
        fetchProducts();
      });
    } else {
      axios.post("http://localhost:3001/api/products", finalForm).then(() => {
        resetForm();
        fetchProducts();
      });
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", description: "", price: "", image: "", brand: "", category: "" });
    setCustomCategory("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Админ-панель</h2>

      <div className="space-y-2 mb-4">
        <input className="border p-1 w-full" placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-1 w-full" placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border p-1 w-full" placeholder="Цена" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-1 w-full" placeholder="Ссылка на картинку" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="border p-1 w-full" placeholder="Бренд" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />

        <select
          className="border p-1 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
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
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          {editId ? "Обновить товар" : "Добавить товар"}
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product._id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{product.name}</div>
              <div className="text-sm">{product.description}</div>
              <div className="text-sm text-gray-500">Бренд: {product.brand}</div>
              <div className="text-sm text-gray-500">Категория: {product.category}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 font-bold" onClick={() => handleEdit(product)}>Редактировать</button>
              <button className="text-red-600 font-bold" onClick={() => handleDelete(product._id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
