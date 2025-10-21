import mongoose from "mongoose";

// Define the schema (structure of your data)
const stringSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  properties: {
    length: Number,
    is_palindrome: Boolean,
    unique_characters: Number,
    word_count: Number,
    sha256_hash: String,
    character_frequency_map: Object,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("StringModel", stringSchema);
