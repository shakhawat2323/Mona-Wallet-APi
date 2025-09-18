# 📖 Digital Wallet API

A secure, modular, and role-based backend API for a **Digital Wallet System** (similar to **bKash/Nagad**) built with **Express.js** and **Mongoose**.

---

## 🚀 Features

- 🔑 **JWT-based Authentication** (User, Agent, Admin roles)
- 🛡 **Role-based Authorization**
- 👛 **Automatic Wallet creation** on registration
- 💰 **Core financial operations**: Top-up, Withdraw, Send Money, Cash-in, Cash-out
- 📜 **Transaction history tracking**
- 👑 **Admin controls**: Block/Unblock wallets, Approve/Suspend agents

---

## 🚀 Live Demo

🔗 **Live Project Link**: [Digital Wallet App](https://digital-wallet-jade.vercel.app)

## 🔗 API Endpoints

### 🏠 Root

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | API Health Check |

---

### 🔑 Auth

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/auth/login`            | Login with credentials     |
| POST   | `/auth/get-verify-token` | Request email verification |
| GET    | `/auth/access-token`     | Get new access token       |
|  |

---

### 👤 User

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | `/user/register`          | Register new user       |
| GET    | `/user/get-all-users`     | List all users          |
| GET    | `/user/request-for-agent` | Request to become agent |
| PATCH  | `/user/update-to-agent`   | Update role to Agent    |
| PATCH  | `/user/edit`              | Edit profile            |
| GET    | `/user/:id`               | Get single user         |

---

### 💰 Agent

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| POST   | `/Agent /cash-in`  | Agent cash-in  |
| POST   | `/Agent /cash-out` | Agent cash-out |

---

### 👛 Wallet

| Method | Endpoint              | Description    |
| ------ | --------------------- | -------------- |
| PATCH  | `/wallet/block/:id`   | Block wallet   |
| PATCH  | `/wallet/unblock/:id` | Unblock wallet |

---

### 👑 Admin

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/admin/users`              | Get all users        |
| GET    | `/admin/agents`             | Get all agents       |
| GET    | `/admin/wallets`            | Get all wallets      |
| GET    | `/admin/transactions`       | Get all transactions |
| PATCH  | `/admin/agents/approve/:id` | Approve agent        |
| PATCH  | `/admin/agents/suspend/:id` | Suspend agent        |
| PATCH  | `/admin/users/role/:id`     | Convert User ⇆ Agent |

---

## 📌 User Registration API

- Route

```http
POST /api/v1/user/register
```

📥 Request Body

```http
{
  "email": "Shakhawatislam@gmail.com",
  "password": "Shakhawat423*"
}

```

📤 Response (201 Created)

```http
{
    "statusCode": 201,
    "success": true,
    "message": "User Created Successfully",
    "data": {
        "_id": "68b2baaaaae6c1a45eb231bb",
        "name": "Md Shakhawat Islam",
        "email": "Shakhawatislam@gmail.com",
        "password": "$2b$10$lkHytlBbjPd8apPdWeHJ5OrrIbmmq9V8a1VBDMVHREXrD4argYNqW",
        "isActive": "ACTIVE",
        "status": "APPROVED",
        "role": "USER",
        "auths": [
            {
                "provider": "credentials",
                "providerId": "Shakhawatislam@gmail.com"
            }
        ],
        "wallets": [
            {
                "_id": "68b2baacaae6c1a45eb231be",
                "user": "68b2baaaaae6c1a45eb231bb",
                "balance": 50,
                "currency": "BDT",
                "type": "PERSONAL",
                "status": "ACTIVE",
                "isActive": true
            }
        ],
        "createdAt": "2025-08-30T08:47:38.994Z",
        "updatedAt": "2025-08-30T08:47:40.941Z"
    }
}

```

### 🛠 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Backend    | Node.js, Express.js               |
| Language   | TypeScript                        |
| Database   | MongoDB + Mongoose                |
| Validation | Zod                               |
| OAuth      | Google OAuth + Passport.js        |
| Deployment | Vercel                            |
| Tools      | Postman, VS Code, MongoDB Compass |
