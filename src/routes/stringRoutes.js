import express from "express";
import {
  createStringEntry,
  getStringByValue,
  getAllStrings,
  filterByNaturalLanguage,
  deleteStringByValue,
} from "../controllers/stringController.js";

const router = express.Router();

/**
 * ROUTES ORDER IS IMPORTANT ⚡
 * Place static routes before dynamic ones
 */

// 🧩 1️⃣ Natural language filter (must come first)
router.get("/filter-by-natural-language", filterByNaturalLanguage);

// 🆕 2️⃣ Create new string
router.post("/", createStringEntry);

// 🔍 3️⃣ Get all strings with optional filters
router.get("/", getAllStrings);

// 🎯 4️⃣ Get specific string by value
router.get("/:value", getStringByValue);

// ❌ 5️⃣ Delete string by value
router.delete("/:value", deleteStringByValue);

export default router;
