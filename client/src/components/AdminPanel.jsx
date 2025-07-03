import React, { useState, useEffect } from "react";
import axios from "axios";
import { categories as catalogCategories } from "../data/categories";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
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
      screen: ""
    }
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [existingCategories, setExistingCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState('laptop');

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
    screen: ""
  };

  const templates = {
    laptop: [
      { key: 'os', label: 'ОС' },
      { key: 'cpu', label: 'Процессор' },
      { key: 'cpuModel', label: 'Модель процессора' },
      { key: 'cpuFrequency', label: 'Частота процессора' },
      { key: 'igpu', label: 'Встроенная графика' },
      { key: 'gpu', label: 'Видеокарта' },
      { key: 'ram', label: 'Оперативная память' },
      { key: 'ramConfig', label: 'Конфигурация ОЗУ' },
      { key: 'ramSlots', label: 'Слоты ОЗУ' },
      { key: 'storage', label: 'Накопитель' },
      { key: 'screen', label: 'Экран' },
    ],
    printer: [
      { key: 'type', label: 'Тип печати' },
      { key: 'speed', label: 'Скорость печати (стр/мин)' },
      { key: 'color', label: 'Цветная печать' },
      { key: 'format', label: 'Формат бумаги' },
      { key: 'resource', label: 'Ресурс картриджа' },
    ],
    monitor: [
      { key: 'diagonal', label: 'Диагональ' },
      { key: 'resolution', label: 'Разрешение' },
      { key: 'matrix', label: 'Тип матрицы' },
      { key: 'refreshRate', label: 'Частота обновления' },
      { key: 'ports', label: 'Порты' },
    ],
    mfu: [
      { key: 'functions', label: 'Функции (копир, сканер, принтер)' },
      { key: 'speed', label: 'Скорость печати (стр/мин)' },
      { key: 'format', label: 'Формат бумаги' },
      { key: 'color', label: 'Цветная печать' },
    ],
    pcpart: [
      { key: 'partType', label: 'Тип комплектующего' },
      { key: 'spec', label: 'Характеристика' },
      { key: 'interface', label: 'Интерфейс/разъём' },
      { key: 'capacity', label: 'Ёмкость/объём' },
    ],
    periphery: [
      { key: 'deviceType', label: 'Тип устройства', options: [
        'Клавиатуры',
        'Мыши',
        'Комплекты клавиатура+мышь',
        'Игровые наборы',
        'Коврики для мыши',
        'Микрофоны',
        'Наушники и гарнитуры',
        'Колонки',
        'Графические планшеты',
        'Внешние накопители данных',
        'Веб-камеры',
        'Аксессуары для периферии',
        'Док-станции и USB-разветвители',
        'Разветвители и преобразователи видеосигнала',
        'Кабели',
        'Крепления для мониторов',
        'Универсальные адаптеры питания',
        'Защита и элементы питания',
        'Полезные аксессуары',
        'Подставки для мониторов',
      ] },
      { key: 'warranty', label: 'Гарантия продавца' },
      { key: 'country', label: 'Страна-производитель' },
      { key: 'model', label: 'Модель' },
      { key: 'mainColor', label: 'Основной цвет' },
      { key: 'cableBraiding', label: 'Тканевая оплетка кабеля' },
      { key: 'backlight', label: 'Подсветка' },
      { key: 'style', label: 'Стилизация' },
      { key: 'buttonsCount', label: 'Общее количество кнопок' },
      { key: 'memory', label: 'Встроенная память мыши' },
      { key: 'extraButtons', label: 'Дополнительные кнопки' },
      { key: 'programmableButtonsCount', label: 'Количество программируемых кнопок' },
      { key: 'programmableButtons', label: 'Программируемые кнопки' },
      { key: 'sensorResolution', label: 'Максимальное разрешение датчика' },
      { key: 'sensorSpeed', label: 'Скорость (IPS)' },
      { key: 'sensorAcceleration', label: 'Максимальное ускорение' },
      { key: 'sensorType', label: 'Тип сенсора мыши' },
      { key: 'sensorModel', label: 'Модель сенсора мыши' },
      { key: 'pollingRate', label: 'Частота опроса' },
      { key: 'sensorModes', label: 'Режимы работы датчика' },
      { key: 'material', label: 'Материал изготовления' },
      { key: 'coating', label: 'Материал покрытия' },
      { key: 'grip', label: 'Хват' },
      { key: 'weightAdjustment', label: 'Система регулировки веса' },
      { key: 'silentButtons', label: 'Бесшумные кнопки' },
      { key: 'connectionType', label: 'Тип подключения' },
      { key: 'connectionInterface', label: 'Интерфейс подключения' },
      { key: 'pcPort', label: 'Разъем подключения к ПК' },
      { key: 'wirelessType', label: 'Тип беспроводного подключения' },
      { key: 'mousePort', label: 'Разъем проводного подключения к мышке' },
      { key: 'dongleInterface', label: 'Интерфейс донгла' },
      { key: 'cableLength', label: 'Длина кабеля' },
      { key: 'wirelessRange', label: 'Радиус действия' },
      { key: 'multiDevice', label: 'Функция одновременной работы с несколькими устройствами' },
      { key: 'powerType', label: 'Тип источника питания' },
      { key: 'batteryLife', label: 'Время автономной работы' },
      { key: 'voltage', label: 'Напряжение питания' },
      { key: 'tech', label: 'Поддержка технологий' },
      { key: 'bundle', label: 'Комплектация' },
      { key: 'features', label: 'Особенности, дополнительно' },
      { key: 'width', label: 'Ширина' },
      { key: 'length', label: 'Длина' },
      { key: 'height', label: 'Высота' },
      { key: 'weight', label: 'Вес мыши' },
      { key: 'extra', label: 'Дополнительные характеристики' },
    ],
    switch: [
      { key: 'warranty', label: 'Гарантия продавца / производителя' },
      { key: 'type', label: 'Тип' },
      { key: 'model', label: 'Модель' },
      { key: 'view', label: 'Вид' },
      { key: 'level', label: 'Уровень коммутатора' },
      { key: 'placement', label: 'Размещение' },
      { key: 'cooling', label: 'Охлаждение' },
      { key: 'poeSupport', label: 'Поддержка PoE' },
      { key: 'poePorts', label: 'Количество портов PoE' },
      { key: 'poeStandards', label: 'Стандарты PoE' },
      { key: 'poeBudget', label: 'Бюджет PoE' },
      { key: 'ethernetInterface', label: 'Интерфейс Ethernet' },
      { key: 'baseSpeed', label: 'Базовая скорость передачи данных' },
      { key: 'totalPorts', label: 'Общее количество портов коммутатора' },
      { key: 'rj45Ports', label: 'Количество медных портов (RJ-45)' },
      { key: 'rj45Speed', label: 'Скорость медных портов (RJ-45)' },
      { key: 'ports1g', label: 'Количество портов 1 Гбит / сек' },
      { key: 'ports10g', label: 'Количество портов 10 Гбит / сек' },
      { key: 'sfpPorts', label: 'Количество SFP-портов' },
      { key: 'sfpSpeed', label: 'Скорость SFP-портов' },
      { key: 'comboPorts', label: 'Комбинированные порты (RJ-45 / SFP)' },
      { key: 'consolePort', label: 'Консольный порт' },
      { key: 'macTable', label: 'Размер таблицы МАС адресов' },
      { key: 'bandwidth', label: 'Внутренняя пропускная способность' },
      { key: 'packetRate', label: 'Скорость обслуживания пакетов' },
      { key: 'packetBuffer', label: 'Буфер пакетов' },
      { key: 'standards', label: 'Поддержка стандартов' },
      { key: 'protocols', label: 'Поддержка протоколов' },
      { key: 'ipv6', label: 'IPv6' },
      { key: 'management', label: 'Управление' },
      { key: 'functions', label: 'Функции' },
      { key: 'qos', label: 'Приоритизация QoS' },
      { key: 'lightningProtection', label: 'Грозозащита' },
      { key: 'security', label: 'Безопасность' },
      { key: 'workTemp', label: 'Рабочая температура' },
      { key: 'workHumidity', label: 'Рабочая влажность' },
      { key: 'powerType', label: 'Тип и напряжение питания' },
      { key: 'powerUsage', label: 'Потребляемая мощность' },
      { key: 'indicators', label: 'Индикаторы' },
      { key: 'kit', label: 'Комплектация' },
      { key: 'width', label: 'Ширина' },
      { key: 'depth', label: 'Глубина' },
      { key: 'height', label: 'Высота' },
      { key: 'packWidth', label: 'Ширина упаковки' },
      { key: 'packHeight', label: 'Высота упаковки' },
      { key: 'packDepth', label: 'Глубина упаковки' },
      { key: 'packWeight', label: 'Вес в упаковке' },
    ],
  };

  const templateOptions = [
    { value: 'laptop', label: 'Ноутбук' },
    { value: 'printer', label: 'Принтер' },
    { value: 'monitor', label: 'Монитор' },
    { value: 'mfu', label: 'МФУ' },
    { value: 'pcpart', label: 'Комплектующие для ПК' },
    { value: 'periphery', label: 'Периферия и аксессуары' },
    { value: 'switch', label: 'Коммутатор' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/products");
      setProducts(res.data);
      const categories = [...new Set(res.data.map(p => p.category).filter(Boolean))].sort();
      setExistingCategories(categories);
    } catch (err) {
      setError("Ошибка при загрузке товаров");
      console.error(err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 10;
    const currentImages = form.images ? form.images.length : 0;
    
    if (currentImages + files.length > maxFiles) {
      setError(`Можно загрузить максимум ${maxFiles} изображений. У вас уже ${currentImages} изображений.`);
      e.target.value = null;
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);
  };

  const handleDeleteImage = async (productId, imageIndex) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${productId}/images/${imageIndex}`);
      await fetchProducts();
    } catch (err) {
      setError("Ошибка при удалении изображения");
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
    setSelectedFiles([]);
  };

  const handleChangeSpecs = (key, value) => {
    setForm({ ...form, specs: { ...form.specs, [key]: value } });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Название обязательно";
    if (!form.price.trim()) return "Цена обязательна";
    if (isNaN(form.price) || Number(form.price) <= 0) return "Цена должна быть положительным числом";
    if (!form.category && !customCategory.trim()) return "Категория обязательна";
    if (!editId && selectedFiles.length === 0) return "Добавьте хотя бы одно изображение";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("brand", form.brand);
      formData.append("category", form.category === "custom" ? customCategory.trim() : form.category);
      formData.append("stock", form.stock ? form.stock : "0");
      
      // Добавляем характеристики
      Object.entries(form.specs).forEach(([key, value]) => {
        formData.append(`specs[${key}]`, value);
      });

      // Добавляем изображения
      selectedFiles.forEach(file => {
        formData.append("images", file);
      });

      if (editId) {
        await axios.put(`http://localhost:3001/api/products/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post("http://localhost:3001/api/products", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
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
    setForm({ 
      name: "", 
      description: "", 
      price: "", 
      images: [], 
      brand: "", 
      category: "", 
      stock: "", 
      specs: { ...defaultSpecs } 
    });
    setCustomCategory("");
    setError("");
    setSelectedFiles([]);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Шаблон товара</label>
        <select
          className="border p-1 w-full mb-2"
          value={selectedTemplate}
          onChange={e => {
            setSelectedTemplate(e.target.value);
            // Сохраняем текущие характеристики при смене шаблона
            const currentSpecs = { ...form.specs };
            setForm({ ...form, specs: currentSpecs });
          }}
        >
          {templateOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
        
        {/* Поле для загрузки изображений */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изображения (до 10 шт.)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Поддерживаются форматы: JPG, PNG, GIF. Максимум 10 изображений.
          </p>
        </div>

        {/* Отображение существующих изображений при редактировании */}
        {editId && form.images && form.images.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-semibold mb-2">Текущие изображения:</p>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={`http://localhost:3001${image}`}
                    alt={`Товар ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteImage(editId, index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Динамические характеристики по шаблону */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {templates[selectedTemplate].map(field => (
            <input
              key={field.key}
              className="border p-1 w-full"
              placeholder={field.label}
              value={form.specs[field.key] || ''}
              onChange={e => handleChangeSpecs(field.key, e.target.value)}
            />
          ))}
        </div>

        <select
          className="border p-1 w-full"
          value={form.category}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, category: value });
            setError("");
            // Автоматический выбор шаблона по категории
            if (value && value.toLowerCase().includes('мыш')) {
              setSelectedTemplate('periphery');
            } else if (value && value.toLowerCase().includes('ноутбук')) {
              setSelectedTemplate('laptop');
            } else if (value && value.toLowerCase().includes('монитор')) {
              setSelectedTemplate('monitor');
            } else if (value && value.toLowerCase().includes('принтер')) {
              setSelectedTemplate('printer');
            } else if (value && value.toLowerCase().includes('мфу')) {
              setSelectedTemplate('mfu');
            } else if (value && value.toLowerCase().includes('коммутатор')) {
              setSelectedTemplate('switch');
            } else if (value && (
              value.toLowerCase().includes('комплект') ||
              value.toLowerCase().includes('ssd') ||
              value.toLowerCase().includes('hdd') ||
              value.toLowerCase().includes('диск') ||
              value.toLowerCase().includes('озу') ||
              value.toLowerCase().includes('память') ||
              value.toLowerCase().includes('ram') ||
              value.toLowerCase().includes('накопител')
            )) {
              setSelectedTemplate('pcpart');
            }
          }}
        >
          <option value="">Выберите категорию</option>
          {catalogCategories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
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
              {product.images && product.images.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001${image}`}
                      alt={`Товар ${index + 1}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}
                </div>
              )}
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
