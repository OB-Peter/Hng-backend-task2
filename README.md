

# 📝 HNG Backend Task 2

## 🚀 Overview

This project is a **Node.js/Express backend API** for managing string entries.
It supports creating, retrieving, deleting, and filtering strings, including **palindromic detection** and natural language queries.

---

## ✨ Features

* ➕ **Create a new string entry**
* 🔍 **Retrieve all strings** with optional filters:

  * 🔁 Palindromic or non-palindromic
  * 🔢 Word count
  * 📏 String length
  * 🔤 Contains specific character
* 📄 **Retrieve a string by value**
* ❌ **Delete a string by value**
* 🗣 **Filter strings using natural language queries**, e.g.:

  * `"all single word palindromic strings"`
  * `"strings longer than 10 characters"`

---

## 🛠 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/OB-Peter/Hng-backend-task2.git
cd Hng-backend-task2
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables** in a `.env` file (example):

```
PORT=3000
MONGO_URI=<Your MongoDB connection string>
```

4. **Start the server:**

```bash
npm run dev
```

* The API will run at: `http://localhost:3000`

---

## 📌 API Endpoints

### 1️⃣ Create String

```
POST /api/strings
```

**Body Example:**

```json
{
  "value": "level"
}
```

---

### 2️⃣ Get All Strings

```
GET /api/strings
```

**Optional Query Parameters:**

* `is_palindrome` (true/false)
* `min_length`, `max_length`
* `word_count`
* `contains_character`

---

### 3️⃣ Get String By Value

```
GET /api/strings/:value
```

---

### 4️⃣ Delete String By Value

```
DELETE /api/strings/:value
```

* ✅ **204 No Content** on success
* ⚠️ **404 Not Found** if string does not exist

---

### 5️⃣ Filter By Natural Language

```
GET /api/strings/filter-by-natural-language?query=<your query>
```

**Examples:**

* `all single word palindromic strings`
* `strings longer than 10 characters`
* `palindromic strings that contain the first vowel`
* `strings containing the letter z`

---

## 💻 Technologies

* Node.js
* Express.js
* MongoDB (Mongoose)
* JavaScript (ES6 Modules)

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m "Add some feature"`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

---

Love you all
thanks to HNG
