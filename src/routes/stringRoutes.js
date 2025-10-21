import express from "express";
import { createStringEntry, getStringByValue, getAllStrings, filterByNaturalLanguage, deleteStringByValue } from "../controllers/stringController.js";

const router = express.Router();

// Route to create a new string
router.post("/", createStringEntry);

// Static routes first
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.get("/", getAllStrings); // Get all strings, optional filters

// Dynamic route last
router.get("/:value", getStringByValue);
router.delete("/:value", deleteStringByValue); 
export default router
