# 🧩 Multi-Level Category Management

A secure, efficient Node.js API to manage nested categories with JWT authentication. Built for Anglara Senior MERN Stack Interview Task using:

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Auth
- Jest, Supertest, mongodb-memory-server

---

## 🔧 Features

- ✅ User Registration & Login (JWT)
- ✅ Protected Category API
- ✅ Multi-level nested categories (tree structure)
- ✅ Recursive inactivation of subcategories
- ✅ Reassign children on delete
- ✅ Fully tested (unit + integration)
- ✅ Request validation via `node-input-validator`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/CodingLearner129/Multi-Level-Category-Management-Node-TS-With-Test-Case.git
cd Multi-Level-Category-Management-Node-TS-With-Test-Case
```

### 2. Installation

```bash
npm install
```

### 3. 📄 Generate .env file from .env.example file

```bash
cp .env.example .env
```

### 4. 🛠️ Configure your database in the .env file

```bash
MONGO_LOCAL=0.0.0.0:27017
MONGO_DB="category_manager"
MONGO_LOCAL_DB="mongodb://${MONGO_LOCAL}/${MONGO_DB}"
MONGO_USER="username"
MONGO_PASSWORD="password"
MONGO_CLUSTER="cluster0.oj1mpxa"
MONGO_APP_NAME="Cluster0"
MONGO_CLUSTER_DB="mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority&appName=${MONGO_APP_NAME}"
# cluster for cluster based connection or local for local connection
MONGO_DB_URI_PREFERENCE="cluster"
```

### 5. 🛠️ Configure your jwt encryption in the .env file

```bash
JWT_ENCRYPTION=secret
```

### 6. 🛠️ Configure port in the .env file

```bash
PORT=3300
```

### 7. 🚀 Run the server

```bash
# run project
npm start
# run project with nodemon
npm run dev
```

### 8. 🧪 Run Tests

```bash
npm test
```

## 🧪 Tests include:

- ✅ Auth (register, login, duplicate)
- ✅ Category (create, tree fetch, update, delete)
- ✅ MongoDB in-memory testing
- ✅ invalid input validation, check unauthorized access, JWT verification

---

## 🔐 API Endpoints

### 🔸 Auth

| Method | Endpoint             | Description           |
|--------|----------------------|------------------------|
| POST   | `/api/auth/register`  | Register new user      |
| POST   | `/api/auth/login`     | Login and get token    |

---

### 🔸 Category (Protected)

| Method | Endpoint              | Description                                       |
|--------|-----------------------|---------------------------------------------------|
| POST   | `/api/category`        | Create category (optional parent_id)              |
| GET    | `/api/category`        | Fetch all categories as a tree                    |
| PUT    | `/api/category/:id`    | Update category name or status, and when a category is marked inactive, all its subcategories should be inactive                  |
| DELETE | `/api/category/:id`    | Delete category and reassign children to parent   |

---

### 📦 Sample API responses

```bash
# POST /api/category
{
    "status": 1,
    "message": "Category created successfully",
    "data": {
        "category": {
            "name": "Tech",
            "status": "active",
            "parent_id": null,
            "user_id": "680b4e808e0c86b26711b8c3",
            "_id": "680b57abb0abc2e200967244",
            "createdAt": "2025-04-25T09:36:43.158Z",
            "updatedAt": "2025-04-25T09:36:43.158Z",
            "__v": 0
        }
    }
}
```

---

## 📬 How to Import Postman Collection & Environment
To test the API easily using Postman:

### 🔁 1. Import the Collection

- Open Postman
- Click on File → Import
- Select the file:
    - Multi-Level Category Management.postman_collection.json
- This will import all pre-configured requests (register, login, create category, etc).

### 🌐 2. Import the Environment
In Postman, go to the Environments tab (top right gear icon).

- Click Import and choose:
    - Multi-Level Category Management.postman_environment.json
- Select it from the environment dropdown in the top-right corner.
- The environment contains:
    - baseUrl → your API base URL (http://localhost:3300)
    - authToken → automatically stores the JWT after login for reuse in requests
