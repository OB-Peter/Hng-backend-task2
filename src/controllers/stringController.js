import crypto from "crypto";
import StringModel from "../models/StringModel.js";

// 🧮 Helper function to analyze a string
const analyzeString = (value) => {
  const length = value.length;
  const is_palindrome =
    value.toLowerCase() === value.toLowerCase().split("").reverse().join("");
  const unique_characters = new Set(value).size;
  const word_count = value.trim().split(/\s+/).length;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  // Frequency map
  const character_frequency_map = {};
  for (let char of value) {
    character_frequency_map[char] =
      (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};

// ✳️ POST /api/strings
export const createStringEntry = async (req, res) => {
  try {
    const { value } = req.body;

    // Validate the request
    if (!value) {
      return res
        .status(400)
        .json({ message: 'Bad Request: Missing "value" field' });
    }

    if (typeof value !== "string") {
      return res
        .status(422)
        .json({ message: 'Unprocessable Entity: "value" must be a string' });
    }

    // Analyze the string
    const properties = analyzeString(value);

    // Check if string already exists by hash
    const existingString = await StringModel.findOne({
      "properties.sha256_hash": properties.sha256_hash,
    });

    if (existingString) {
      return res.status(409).json({
        message: "Conflict: String already exists in the system",
      });
    }

    // Create and save new entry
    const newString = await StringModel.create({
      value,
      properties,
      created_at: new Date(),
    });

    // Return formatted response
    res.status(201).json({
      id: properties.sha256_hash,
      value,
      properties,
      created_at: newString.created_at,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};




export const getStringByValue = async (req, res) => {
  try {
    const { value } = req.params;  // must match the route name

    const foundString = await StringModel.findOne({ value });

    if (!foundString) {
      return res.status(404).json({ message: "String not found" });
    }

    res.status(200).json({
      id: foundString.properties?.sha256_hash,
      value: foundString.value,
      properties: foundString.properties,
      created_at: foundString.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//third tasks handler

// Utility to check palindrome correctly (ignoring spaces, punctuation, and case)
const isPalindrome = (str) => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
};

export const getAllStrings = async (req, res) => {
  try {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    // Build MongoDB query dynamically
    const query = {};

    // ✅ Handle is_palindrome filter (normalized)
    if (is_palindrome !== undefined) {
      if (is_palindrome !== "true" && is_palindrome !== "false") {
        return res.status(400).json({ message: "Invalid value for is_palindrome" });
      }
      query["properties.is_palindrome"] = is_palindrome === "true";
    }

    // ✅ Handle min_length
    if (min_length) {
      if (isNaN(min_length))
        return res.status(400).json({ message: "min_length must be a number" });
      query["properties.length"] = {
        ...query["properties.length"],
        $gte: parseInt(min_length),
      };
    }

    // ✅ Handle max_length
    if (max_length) {
      if (isNaN(max_length))
        return res.status(400).json({ message: "max_length must be a number" });
      query["properties.length"] = {
        ...query["properties.length"],
        $lte: parseInt(max_length),
      };
    }

    // ✅ Handle word_count
    if (word_count) {
      if (isNaN(word_count))
        return res.status(400).json({ message: "word_count must be a number" });
      query["properties.word_count"] = parseInt(word_count);
    }

    // ✅ Handle contains_character
    if (contains_character) {
      if (typeof contains_character !== "string" || contains_character.length !== 1) {
        return res
          .status(400)
          .json({ message: "contains_character must be a single character" });
      }
      query.value = { $regex: contains_character, $options: "i" }; // case-insensitive search
    }

    // 🔍 Fetch from MongoDB
    const strings = await StringModel.find(query);

    // ✅ Optional double-check of palindrome logic before responding (for consistency)
    const formattedData = strings.map((str) => ({
      id: str._id,
      value: str.value,
      properties: {
        ...str.properties,
        // ensure palindrome field is computed correctly even if stored wrong
        is_palindrome: isPalindrome(str.value),
      },
      created_at: str.created_at,
    }));

    // 🧾 Send success response
    return res.status(200).json({
      data: formattedData,
      count: formattedData.length,
      filters_applied: {
        ...(is_palindrome && { is_palindrome: is_palindrome === "true" }),
        ...(min_length && { min_length: parseInt(min_length) }),
        ...(max_length && { max_length: parseInt(max_length) }),
        ...(word_count && { word_count: parseInt(word_count) }),
        ...(contains_character && { contains_character }),
      },
    });
  } catch (error) {
    console.error("Error fetching strings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const filterByNaturalLanguage = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Missing 'query' parameter" });
    }

    // Convert query to lowercase
    const text = query.toLowerCase();
    const filters = {};

    // === Simple keyword-based parsing ===
    if (text.includes("palindromic") || text.includes("palindrome")) {
      filters["properties.is_palindrome"] = true;
    }

    if (text.includes("not palindrome")) {
      filters["properties.is_palindrome"] = false;
    }

    // Word count filters
    if (text.includes("single word")) filters["properties.word_count"] = 1;
    if (text.includes("two word")) filters["properties.word_count"] = 2;
    if (text.includes("three word")) filters["properties.word_count"] = 3;

    // Length filters
    const longerMatch = text.match(/longer than (\d+)/);
    if (longerMatch) filters["properties.length"] = { $gt: parseInt(longerMatch[1]) };

    const shorterMatch = text.match(/shorter than (\d+)/);
    if (shorterMatch) filters["properties.length"] = { $lt: parseInt(shorterMatch[1]) };

    // Character filter
    const letterMatch = text.match(/letter ([a-z])/);
    if (letterMatch) filters.value = { $regex: letterMatch[1], $options: "i" };

    // Heuristic example
    if (text.includes("first vowel")) filters.value = { $regex: "[aeiou]", $options: "i" };

    // If no filters matched, return 400
    if (Object.keys(filters).length === 0) {
      return res.status(400).json({ message: "Unable to parse natural language query" });
    }

    const strings = await StringModel.find(filters);

    return res.status(200).json({
      data: strings,
      count: strings.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (error) {
    console.error("Error filtering strings by natural language:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteStringByValue = async (req, res) => {
  try {
    const { value } = req.params;

    const deletedString = await StringModel.findOneAndDelete({ value: value.trim() });

    if (!deletedString) {
      return res.status(404).json({ message: "String does not exist in the system" });
    }

    res.status(200).json({ message: "String deleted successfully", deleted: deletedString });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
