import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import stringRoutes from "./src/routes/stringRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB first
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/strings", stringRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("✅ Welcome to my String Analysis API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
