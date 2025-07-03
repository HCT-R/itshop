# ITShop

Магазин техники: фронтенд на React, бэкенд на Node.js (Express), база данных MongoDB.

## Возможности

- Каталог товаров
- Корзина
- Оформление заказа
- Админ-панель
- Авторизация/регистрация

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/HCT-R/itshop.git
cd itshop
```

### 2. Запуск backend

```bash
cd server
npm install
# Создайте файл .env и укажите строку подключения к MongoDB:
# MONGO_URI=mongodb://localhost:27017/itshop
npm start
```

### 3. Запуск frontend

```bash
cd ../client
npm install
npm run dev
```

### 4. Пример .env для backend

Создайте файл `server/.env` со следующим содержимым:

```
MONGO_URI=mongodb://localhost:27017/itshop
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Структура проекта

- `client/` — фронтенд (React, Vite)
- `server/` — бэкенд (Node.js, Express, MongoDB)

## Лицензия

MIT

---

# ITShop (English)

Tech store: frontend on React, backend on Node.js (Express), MongoDB database.

## Features

- Product catalog
- Shopping cart
- Order placement
- Admin panel
- Authentication/registration

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/HCT-R/itshop.git
cd itshop
```

### 2. Start the backend

```bash
cd server
npm install
# Create a .env file and specify your MongoDB connection string:
# MONGO_URI=mongodb://localhost:27017/itshop
npm start
```

### 3. Start the frontend

```bash
cd ../client
npm install
npm run dev
```

### 4. Example .env for backend

Create a file `server/.env` with the following content:

```
MONGO_URI=mongodb://localhost:27017/itshop
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Project structure

- `client/` — frontend (React, Vite)
- `server/` — backend (Node.js, Express, MongoDB)

## License

MIT
```

</rewritten_file>