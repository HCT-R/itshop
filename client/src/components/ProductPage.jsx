import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../fonts/ofont.ru_Roboto-normal.js';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { cart, setCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const initialState = {
    search: '',
    // ... другие фильтры
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_SEARCH':
        return { ...state, search: action.payload };
      // ... другие действия
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

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

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('ofont.ru_Roboto');

      doc.setFontSize(12);
      doc.text("itshop", 10, 12);
      doc.text("Республика Казахстан, г. Астана, ул. Жубанова, 7", 10, 18);
      doc.text("E-mail: info@itshop.kz   Тел.: +7 (777) 000-00-00", 10, 24);

      doc.setFontSize(14);
      doc.text("Ценовое предложение", 105, 36, { align: "center" });
      doc.setFontSize(12);
      doc.text("Уважаемый заказчик!", 10, 46);
      doc.text("По вашему запросу выполнен предварительный расчет заказа.", 10, 52);

      // Только название товара, без описания
      const tableBody = [
        [
          1,
          product.name,
          formatPrice(product.price),
          1,
          formatPrice(product.price)
        ]
      ];

      // Ручной заголовок таблицы
      doc.setFont('ofont.ru_Roboto');
      doc.setFontSize(8);
      doc.setFont('ofont.ru_Roboto', "normal");
      doc.text("№", 12, 65);
      doc.text("Наименование", 22, 65);
      doc.text("Стоимость (тг., за ед.)", 92, 65);
      doc.text("Кол-во (шт.)", 122, 65);
      doc.text("Сумма (тг.)", 142, 65);
      doc.setFont('ofont.ru_Roboto', "normal");

      // Таблица только с body
      autoTable(doc, {
        startY: 68,
        body: tableBody,
        styles: { font: "ofont.ru_Roboto", fontStyle: "normal", fontSize: 10, cellPadding: 2 },
        bodyStyles: { valign: "middle", halign: "center" },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 70, halign: "left" },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 }
        },
        theme: "grid"
      });

      // Итог вручную
      let yTotal = doc.lastAutoTable.finalY + 8;
      doc.setFont('ofont.ru_Roboto', "normal");
      doc.text("Итого:", 122, yTotal);
      doc.text(formatPrice(product.price), 142, yTotal);
      doc.setFont('ofont.ru_Roboto', "normal");

      let y = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(11);
      doc.text(
        "Мы будем рады сотрудничать с Вами, обеспечивая безупречное качество нашей работы, а также рациональный подход к Вашему времени.",
        10, y, { maxWidth: 180 }
      );
      y += 15;
      doc.text("С уважением,", 10, y);
      doc.text("менеджер", 10, y + 7);
      doc.text("itshop", 10, y + 14);
      doc.text(new Date().toLocaleDateString(), 150, y + 14);

      doc.save(`Коммерческое_предложение_${product.name}.pdf`);
    } catch (err) {
      alert('Ошибка при генерации PDF: ' + err.message);
      console.error('PDF error:', err);
    }
  };

  // Форматирование цены с пробелами
  function formatPrice(price) {
    return price?.toLocaleString('ru-RU');
  }

  if (loading) return <div>Загрузка...</div>;
  if (!product) return <div>Товар не найден</div>;

  // Расчет скидки
  const oldPrice = product.oldPrice || (product.price ? Math.round(product.price * 1.06) : null);
  const discount = oldPrice && oldPrice > product.price ? Math.round(100 - (product.price / oldPrice) * 100) : null;
  const economy = oldPrice && oldPrice > product.price ? oldPrice - product.price : null;

  // Шаблоны характеристик для разных типов техники
  const templates = {
    laptop: [
      { key: 'os', label: t('specLabels.os') },
      { key: 'cpu', label: t('specLabels.cpu') },
      { key: 'cpuModel', label: t('specLabels.cpuModel') },
      { key: 'cpuFrequency', label: t('specLabels.cpuFrequency') },
      { key: 'igpu', label: t('specLabels.igpu') },
      { key: 'gpu', label: t('specLabels.gpu') },
      { key: 'ram', label: t('specLabels.ram') },
      { key: 'ramConfig', label: t('specLabels.ramConfig') },
      { key: 'ramSlots', label: t('specLabels.ramSlots') },
      { key: 'storage', label: t('specLabels.storage') },
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
    periphery_mouse: [
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
    all: [] // fallback для всех характеристик
  };

  // Определяем тип техники для выбора шаблона
  const getTemplateKey = (category, specs) => {
    if (!category) return 'laptop';
    const cat = category.toLowerCase();
    if (cat.includes('мыш')) return 'periphery_mouse';
    if (cat.includes('ноутбук')) return 'laptop';
    if (cat.includes('монитор')) return 'monitor';
    if (cat.includes('принтер')) return 'printer';
    if (cat.includes('мфу')) return 'mfu';
    if (cat.includes('коммутатор')) return 'switch';
    if (
      cat.includes('комплект') ||
      cat.includes('ssd') ||
      cat.includes('hdd') ||
      cat.includes('диск') ||
      cat.includes('озу') ||
      cat.includes('память') ||
      cat.includes('ram') ||
      cat.includes('накопител')
    ) return 'pcpart';
    return 'all';
  };

  // fallback: если шаблон не найден, показываем все характеристики
  let specsTemplate;
  const templateKey = getTemplateKey(product.category, product.specs);
  if (templateKey === 'all') {
    specsTemplate = Object.keys(product.specs || {}).map(key => ({ key, label: key, value: product.specs?.[key] || '-' }));
  } else {
    specsTemplate = (templates[templateKey] || []).map(field => ({
      key: field.key,
      label: field.label,
      value: product.specs?.[field.key] || '-'
    }));
  }

  // Индикатор наличия и текст кнопки
  let inStock = typeof product.stock === 'number' ? product.stock : 0;
  let isAvailable = inStock > 0;
  let stockBarWidth = inStock > 10 ? 100 : inStock * 10;
  let buttonText = isAvailable ? 'Купить' : 'Нет в наличии';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 relative animate-fade-in">
        {/* Хлебные крошки */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
          <Link to="/" className="hover:text-blue-600">itshop</Link>
          <span>/</span>
          <Link to="/" className="hover:text-blue-600">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Название и скидка */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
          {discount && <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">{t('product.economy')} -{discount}%</span>}
        </div>

        {/* Основной блок */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Галерея */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src={`http://localhost:3001${product.images[selectedImageIndex]}`}
                alt={product.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-contain bg-gray-50 rounded-lg mb-4 cursor-zoom-in"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                      style={{ flex: '0 0 auto' }}
                    >
                      <img
                        src={`http://localhost:3001${image}`}
                        alt={`${t('product.description')} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Цена и скидка */}
            <div className="flex items-end gap-4 mb-2">
              {oldPrice && oldPrice > product.price && (
                <span className="text-gray-400 line-through text-lg">{formatPrice(oldPrice)} ₸</span>
              )}
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)} ₸</span>
            </div>
            {economy && (
              <div className="text-green-700 text-sm mb-1">{t('product.economy')} {formatPrice(economy)} ₸</div>
            )}
            
            {/* Кредит/рассрочка */}
            <div className="text-sm text-gray-600 mb-2">
              {t('product.credit')}: <b>{formatPrice(Math.ceil(product.price / 60))} ₸ x 60 мес</b> &nbsp;|&nbsp;
              {t('product.installment')}: <b>{formatPrice(Math.ceil(product.price / 12))} ₸ x 12 мес</b>
            </div>

            {/* Индикатор наличия */}
            <div className="flex items-center gap-2 mb-4">
              <span className={isAvailable ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {isAvailable ? `${t('product.inStock')} ${inStock} шт.` : t('product.notInStock')}
              </span>
              <div className="w-32 h-2 bg-green-200 rounded overflow-hidden">
                <div 
                  className={isAvailable ? "bg-green-500 h-2" : "bg-gray-400 h-2"} 
                  style={{ width: `${stockBarWidth}%` }}
                ></div>
              </div>
            </div>

            {/* Кнопка купить */}
            <button
              onClick={addToCart}
              className={`bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg w-full mb-4 transition duration-200 transform hover:scale-105 shadow ${
                !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              disabled={!isAvailable}
            >
              {t('buttons.buy')}
            </button>

            {/* Уведомление о добавлении в корзину */}
            {added && (
              <div 
                style={{position: 'fixed', top: 24, right: 24, zIndex: 1000}} 
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-fade-in"
              >
                {t('messages.addedToCart')}
              </div>
            )}

            {/* Основные характеристики */}
            <div className="mt-4">
              <div className="font-semibold mb-3 text-lg">{t('product.specs')}</div>
              <ul className="text-sm space-y-2">
                {specsTemplate.map((spec, idx) => (
                  <li key={idx} className="flex justify-between border-b border-dotted border-gray-200 py-2">
                    <span className="text-gray-600">{spec.label}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={generatePDF}
              className="mt-2 bg-blue-600 text-white rounded-lg py-2 px-4 font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition"
            >
              Скачать КП
            </button>
          </div>
        </div>

        {/* Описание */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold mb-4">{t('product.description')}</h2>
          <div className="text-gray-800 text-sm leading-relaxed">{product.description}</div>
        </div>

        {/* Модальное окно для просмотра фото */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="relative max-w-4xl w-full">
              <img
                src={`http://localhost:3001${product.images[selectedImageIndex]}`}
                alt={product.name}
                className="w-full h-auto max-h-[90vh] rounded-lg shadow-lg border-4 border-white"
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute top-4 right-4 text-white text-4xl font-bold cursor-pointer hover:text-gray-300 transition"
                onClick={() => setIsModalOpen(false)}
                style={{zIndex: 100}}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
