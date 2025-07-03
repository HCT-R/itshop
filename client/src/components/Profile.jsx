import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingBag, FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaSpinner, FaEdit, FaSave, FaKey, FaMapMarkerAlt, FaPlus, FaTrash } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({ name: "", email: "", phone: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("Вы не авторизованы.");
      setLoading(false);
      return;
    }
    const fetchUser = () => {
      axios.get("http://localhost:3001/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data.user);
          setEditUser({ name: res.data.user.name, email: res.data.user.email, phone: res.data.user.phone || "" });
          setAddresses(res.data.user.addresses || []);
          fetchOrders();
        })
        .catch(() => { setMessage("Ошибка при получении данных пользователя."); setLoading(false); });
    };
    const fetchOrders = () => {
      axios.get("http://localhost:3001/api/orders/my", { headers: { Authorization: `Bearer ${token }` } })
        .then(res => { setOrders(res.data); setLoading(false); })
        .catch (() => { setMessage("Ошибка при получении заказов."); setLoading (false); });
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEditSave = async () => {
    try {
      await axios.put("http://localhost:3001/api/auth/me", editUser, { headers: { Authorization: `Bearer ${token}` } });
      setUser({ ...user, ...editUser });
      setEditMode(false);
    } catch {
      alert("Ошибка при сохранении данных");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (!passwords.old || !passwords.new1 || !passwords.new2) {
      setPasswordMsg("Заполните все поля");
      return;
    }
    if (passwords.new1 !== passwords.new2) {
      setPasswordMsg("Пароли не совпадают");
      return;
    }
    try {
      await axios.put("http://localhost:3001/api/auth/password", passwords, { headers: { Authorization: `Bearer ${token}` } });
      setShowPasswordForm(false);
      setPasswords({ old: "", new1: "", new2: "" });
      alert("Пароль успешно изменён");
    } catch {
      setPasswordMsg("Ошибка при смене пароля");
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const res = await axios.post("http://localhost:3001/api/auth/address", { address: newAddress }, { headers: { Authorization: `Bearer ${token}` } });
      setAddresses(res.data.addresses);
      setNewAddress("");
    } catch {
      alert("Ошибка при добавлении адреса");
    }
  };

  const handleDeleteAddress = async (idx) => {
    try {
      const res = await axios.delete(`http://localhost:3001/api/auth/address/${idx}`, { headers: { Authorization: `Bearer ${token}` } });
      setAddresses(res.data.addresses);
    } catch {
      alert("Ошибка при удалении адреса");
    }
  };

  const handleShowOrderDetails = (order) => {
    setOrderDetails(order);
  };
  const handleCloseOrderDetails = () => setOrderDetails(null);

  // Форматирование цены с пробелами
  function formatPrice(price) {
    return price?.toLocaleString('ru-RU');
  }

  if (loading) return (<div className="flex justify-center items-center h-40">< FaSpinner className="animate-spin text-2xl text-blue-600" /></div>);
  if (message) return (<p className="p-4 text-red-500">{message}</p>);
  if (!user) return (<p className="p-4">Загрузка...</p>);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 flex flex-col gap-6 animate-fade-in">
      {/* Данные пользователя */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Личный кабинет</h2>
        {editMode ? (
          <>
            <input className="border p-2 rounded mb-2" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} placeholder="Имя" />
            <input className="border p-2 rounded mb-2" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" />
            <input className="border p-2 rounded mb-2" value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} placeholder="Телефон" />
            <button onClick={handleEditSave} className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow flex items-center gap-2"><FaSave />Сохранить</button>
            <button onClick={() => setEditMode(false)} className="text-gray-500 mt-2">Отмена</button>
          </>
        ) : (
          <>
            <p className="flex items-center gap-2"><FaUser className="text-blue-600" /> <strong>Имя:</strong> {user.name} </p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-blue-600" /> <strong>Email:</strong> {user.email} </p>
            <p className="flex items-center gap-2"><strong>Телефон:</strong> {user.phone || '—'} </p>
            <p className="flex items-center gap-2"><FaCalendarAlt className="text-blue-600" /> <strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()} </p>
            <button onClick={() => setEditMode(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow"><FaEdit />Редактировать</button>
          </>
        )}
        <button onClick={handleLogout} className="mt-2 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition shadow">
          <FaSignOutAlt /> Выйти
        </button>
        <button onClick={() => setShowPasswordForm(v => !v)} className="mt-2 inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition shadow"><FaKey />Сменить пароль</button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="mt-2 flex flex-col gap-2">
            <input type="password" className="border p-2 rounded" placeholder="Старый пароль" value={passwords.old} onChange={e => setPasswords({ ...passwords, old: e.target.value })} />
            <input type="password" className="border p-2 rounded" placeholder="Новый пароль" value={passwords.new1} onChange={e => setPasswords({ ...passwords, new1: e.target.value })} />
            <input type="password" className="border p-2 rounded" placeholder="Повторите новый пароль" value={passwords.new2} onChange={e => setPasswords({ ...passwords, new2: e.target.value })} />
            {passwordMsg && <div className="text-red-600 font-semibold">{passwordMsg}</div>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow">Сохранить пароль</button>
          </form>
        )}
      </div>

      {/* Адреса доставки */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600" /> Адреса доставки</h2>
        <div className="flex flex-col gap-2">
          {addresses.length === 0 && <div className="text-gray-500">Нет адресов</div>}
          {addresses.map((addr, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span>{addr}</span>
              <button onClick={() => handleDeleteAddress(idx)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input className="border p-2 rounded w-full" placeholder="Добавить новый адрес" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
          <button onClick={handleAddAddress} className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow flex items-center gap-2"><FaPlus />Добавить</button>
        </div>
      </div>

      {/* История заказов */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FaShoppingBag className="text-blue-600" /> История заказов</h2>
        {orders.length === 0 ? (
          <div className="text-center p-6 text-gray-500">У вас пока нет заказов.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 text-left">Дата</th>
                  <th className="py-2 text-left">Сумма</th>
                  <th className="py-2 text-left">Статус</th>
                  <th className="py-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">{formatPrice(order.items.reduce((sum, item) => sum + (item.price || 0), 0))} ₸</td>
                    <td className="py-2">Оформлен</td>
                    <td className="py-2"><button className="text-blue-600 hover:underline" onClick={() => handleShowOrderDetails(order)}>Подробнее</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Детализация заказа */}
        {orderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
              <button onClick={handleCloseOrderDetails} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold">×</button>
              <h3 className="text-xl font-bold mb-4">Детали заказа</h3>
              <div className="mb-2 text-gray-600">Дата: {new Date(orderDetails.createdAt).toLocaleDateString()}</div>
              <div className="mb-2 text-gray-600">Статус: Оформлен</div>
              <div className="mb-2 text-gray-600">Сумма: {formatPrice(orderDetails.items.reduce((sum, item) => sum + (item.price || 0), 0))} ₸</div>
              <div className="mb-2 text-gray-600">Товары:</div>
              <ul className="mb-2">
                {orderDetails.items.map((item, idx) => (
                  <li key={idx} className="mb-1">{item.name} — {formatPrice(item.price)} ₸ × {item.qty || 1}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
