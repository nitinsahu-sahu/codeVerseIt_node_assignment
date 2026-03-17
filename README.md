# 🍔 Food Order API (Node.js Machine Test)

## 📌 Project Overview

This project is a backend system for a **Food Ordering Platform** built using **Node.js, Express, MongoDB, JWT, Socket.IO, and Redis**.

It supports two types of users:

* **Restaurant Owner**
* **Customer**

The system handles complete **order lifecycle**:

> Created → Accepted → Delivered → Cancelled

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.IO (Real-time notifications)
* Redis (Caching)

---

## 📁 Project Structure

```
src/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── index.js
```

---

## 🔐 Authentication APIs

### ➤ Register User

`POST /auth/register`

### ➤ Login User

`POST /auth/login`

---

## 🍽️ Menu APIs

* `POST /menu` → Add Menu Item (Owner)
* `PATCH /menu/:itemId` → Update Menu Item (Owner)
* `GET /menu/me` → Owner Menu
* `GET /menu` → Public Menu (Filter + Pagination)

---

## 🧾 Order APIs

* `POST /orders` → Create Order (Customer)
* `GET /orders/me` → Customer Orders

---

## 🏪 Order Management APIs

* `GET /orders/restaurant` → Owner Orders
* `PATCH /orders/:orderId/accept`
* `PATCH /orders/:orderId/cancel`

---

## ⚡ Real-Time Features

* New order notification using **Socket.IO**

---

## ⚡ Redis Caching

* Menu listing cached for performance

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/codeVerseIt_node_assignment.git
cd codeVerseIt_node_assignment
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

👉 Copy `.env.example` file and create `.env`

```bash
cp .env.example .env
```

### Example `.env.example`

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection
```

---

## 🔌 Socket.IO Usage

```js
socket.emit("join", userId);
```

---

## 📊 Database Design

### User

* name
* email
* password
* role

### Menu

* name
* price
* category
* owner

### Order

* customer
* restaurant
* items
* totalPrice
* status

---

## 🧪 Testing

* Postman
* Thunder Client

---

## 📈 Performance Optimizations

* Redis caching
* MongoDB indexing
* Pagination

---

## 👨‍💻 Author

**Nitin Sahu**

---

## ⭐ Conclusion

Production-ready backend with real-time and optimized architecture.
