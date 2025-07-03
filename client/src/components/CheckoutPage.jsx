import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import { useCart } from "../context/CartContext";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaEnvelope, FaCommentDots, FaSpinner, FaTrash, FaMinus, FaPlus, FaTruck, FaCity, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cities = ["Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Тараз", "Павлодар", "Усть-Каменогорск", "Семей"];
const deliveryTypes = [
  { value: "courier", label: "Курьером по городу", icon: <FaTruck className="inline mr-1" /> },
  { value: "pickup", label: "Самовывоз из магазина", icon: <FaCity className="inline mr-1" /> },
];

function PaymentModal({ total, onPay, onClose, loading }) {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };
  const handlePay = (e) => {
    e.preventDefault();
    if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) {
      setError("Введите корректный номер карты");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      setError("Введите срок действия в формате MM/YY");
      return;
    }
    if (!/^\d{3}$/.test(card.cvv)) {
      setError("Введите CVV");
      return;
    }
    if (!card.name) {
      setError("Введите имя держателя карты");
      return;
    }
    setError("");
    onPay();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold"
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <FaLock className="text-blue-600 text-3xl mb-3" />
          <div className="text-xl font-bold mb-2 text-center">Оплата заказа</div>
          <div className="text-gray-600 mb-2 text-center">
            Сумма к оплате: <span className="font-bold text-blue-700">{total} ₸</span>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handlePay} autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер карты</label>
            <InputMask 
              mask="9999 9999 9999 9999" 
              maskChar=" " 
              name="number" 
              value={card.number} 
              onChange={handleChange}
            >
              {(inputProps) => (
                <input 
                  {...inputProps} 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                />
              )}
            </InputMask>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок действия</label>
              <InputMask 
                mask="99/99" 
                maskChar=" " 
                name="expiry" 
                value={card.expiry} 
                onChange={handleChange}
              >
                {(inputProps) => (
                  <input 
                    {...inputProps} 
                    type="text" 
                    placeholder="MM/YY" 
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  />
                )}
              </InputMask>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <InputMask 
                mask="999" 
                maskChar=" " 
                name="cvv" 
                value={card.cvv} 
                onChange={handleChange}
              >
                {(inputProps) => (
                  <input 
                    {...inputProps} 
                    type="password" 
                    placeholder="123" 
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  />
                )}
              </InputMask>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя держателя карты</label>
            <input 
              name="name" 
              type="text" 
              placeholder="IVAN IVANOV" 
              value={card.name} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase" 
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-semibold mt-1 text-center">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-2 bg-blue-600 text-white rounded-lg py-3 font-bold text-lg flex items-center justify-center gap-2 shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaCreditCard className="inline-block" />} Оплатить
          </button>
        </form>
      </div>
    </div>
  );
}

// Форматирование цены с пробелами
function formatPrice(price) {
  return price?.toLocaleString('ru-RU');
}

export default function CheckoutPage() {
  const context = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: cities[0], address: "", comment: "" });
  const [payment, setPayment] = useState("card");
  const [delivery, setDelivery] = useState("courier");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!context || !context.cart) {
    return <p>Загрузка оформления заказа...</p>;
  }

  const { cart, setCart } = context;
  // Количество товаров
  const handleQty = (idx, delta) => {
    const updated = [...cart];
    updated[idx].qty = Math.max(1, (updated[idx].qty || 1) + delta);
    setCart(updated);
  };
  // Удалить товар
  const handleRemove = (idx) => {
    const updated = [...cart];
    updated.splice(idx, 1);
    setCart(updated);
  };
  // Итоги
  const itemsTotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const deliveryCost = delivery === "courier" ? 1500 : 0;
  const discount = 0; // можно добавить промокод
  const total = itemsTotal + deliveryCost - discount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateEmail = (email) => /.+@.+\..+/.test(email);
  const validatePhone = (phone) => phone.replace(/\D/g, "").length === 11;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Войдите или зарегистрируйтесь для оформления заказа.");
      return;
    }
    if (!form.name || !form.phone || !form.email || !form.city || !form.address) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Введите корректный email.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Введите корректный номер телефона.");
      return;
    }
    if (!agree) {
      setError("Необходимо согласиться с условиями заказа.");
      return;
    }
    setError("");
    if (payment === "card") {
      setShowPayment(true);
    } else {
      await createOrder();
    }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3001/api/orders",
        {
          name: form.name,
          phone: form.phone,
          items: cart.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.images[0],
            qty: item.qty || 1
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      setCart([]);
      navigate("/order-success", { replace: true });
    } catch (err) {
      setLoading(false);
      setError("Ошибка при оформлении заказа. Попробуйте ещё раз.");
    }
  };

  const handlePay = async () => {
    setShowPayment(false);
    await createOrder();
  };

  useEffect(() => {
    if (cart.length === 0 && !loading && !showPayment) {
      // Если корзина пуста и не идёт оформление — редирект на главную
      navigate("/", { replace: true });
    }
  }, [cart, loading, showPayment, navigate]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <form className="flex flex-col gap-6 sm:gap-8 max-w-4xl mx-auto" onSubmit={handleSubmit} autoComplete="off">
        {/* Товары */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
          {cart.length === 0 ? (
            <p>Корзина пуста. Добавьте товары перед оформлением.</p>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-2 text-left">Товар</th>
                      <th className="py-2">Цена</th>
                      <th className="py-2">Кол-во</th>
                      <th className="py-2">Сумма</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-2 flex items-center gap-3">
                          <img src={`http://localhost:3001${item.images[0]}`} alt={item.name} className="w-12 h-12 rounded bg-gray-50 border object-contain" />
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.brand}</div>
                          </div>
                        </td>
                        <td className="text-center font-semibold text-blue-600">{formatPrice(item.price)} ₸</td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={() => handleQty(idx, -1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100"><FaMinus /></button>
                            <span className="w-6 text-center">{item.qty || 1}</span>
                            <button type="button" onClick={() => handleQty(idx, 1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100"><FaPlus /></button>
                          </div>
                        </td>
                        <td className="text-center font-bold">{formatPrice(item.price * (item.qty || 1))} ₸</td>
                        <td className="text-center">
                          <button type="button" onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="border-b last:border-b-0 pb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={`http://localhost:3001${item.images[0]}`} alt={item.name} className="w-16 h-16 rounded bg-gray-50 border object-contain" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
                        <div className="text-sm font-semibold text-blue-600">{formatPrice(item.price)} ₸</div>
                      </div>
                      <button type="button" onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700 p-2">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleQty(idx, -1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100">
                          <FaMinus />
                        </button>
                        <span className="w-6 text-center">{item.qty || 1}</span>
                        <button type="button" onClick={() => handleQty(idx, 1)} className="p-1 rounded bg-gray-100 hover:bg-blue-100">
                          <FaPlus />
                        </button>
                      </div>
                      <div className="font-bold">{formatPrice(item.price * (item.qty || 1))} ₸</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Доставка */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Доставка</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Город</label>
              <select 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                className="border border-gray-200 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Способ доставки</label>
              <div className="flex flex-col sm:flex-row gap-2">
                {deliveryTypes.map(type => (
                  <label 
                    key={type.value}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                      delivery === type.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={type.value}
                      checked={delivery === type.value}
                      onChange={() => setDelivery(type.value)}
                      className="hidden"
                    />
                    {type.icon}
                    <span className="font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label className="block mb-1 font-medium">Адрес доставки</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Улица, дом, квартира"
                className="border border-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Контактные данные */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Контактные данные</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Имя</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ваше имя"
                  className="border border-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Телефон</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputMask
                  mask="+7 (999) 999-99-99"
                  maskChar=" "
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      className="border border-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  )}
                </InputMask>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="border border-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Комментарий к заказу</label>
              <div className="relative">
                <FaCommentDots className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Дополнительная информация"
                  className="border border-gray-200 rounded-2xl pl-10 pr-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Оплата */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4">Способ оплаты</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              payment === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
                className="hidden"
              />
              <FaCreditCard className="text-2xl text-blue-600" />
              <div>
                <div className="font-medium">Банковской картой</div>
                <div className="text-sm text-gray-500">Visa, MasterCard, UnionPay</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              payment === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === 'cash'}
                onChange={() => setPayment('cash')}
                className="hidden"
              />
              <FaMoneyBillWave className="text-2xl text-green-600" />
              <div>
                <div className="font-medium">Наличными при получении</div>
                <div className="text-sm text-gray-500">Оплата курьеру или в магазине</div>
              </div>
            </label>
          </div>
        </div>

        {/* Итого */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4">Итого</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Товары ({cart.length})</span>
              <span>{formatPrice(itemsTotal)} ₸</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Доставка</span>
              <span>{formatPrice(deliveryCost)} ₸</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Скидка</span>
                <span>-{formatPrice(discount)} ₸</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Итого к оплате</span>
                <span className="text-blue-700">{formatPrice(total)} ₸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Согласие и кнопка */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              Я согласен с условиями заказа и обработки персональных данных
            </span>
          </label>
          {error && (
            <div className="mt-4 text-red-600 font-semibold">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white rounded-full py-3 font-bold text-lg flex items-center justify-center gap-2 shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaCreditCard className="inline-block" />} Оформить заказ
          </button>
        </div>
      </form>

      {showPayment && (
        <PaymentModal
          total={total}
          onPay={handlePay}
          onClose={() => setShowPayment(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
