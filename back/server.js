import "dotenv/config";
import express from "express";
import cors from "cors";

import testConnection from "./dbPing.js";
import productsRoutes from "./src/routes/productRoutes.js";
import authRoutes from "./src/routes/employeeRoutes.js";
import ordersRoutes from "./src/routes/ordersRoutes.js";
const app = express();
const PORT = process.env.PORT || 3002;
// Test database connection on startup
testConnection();
// CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});
// 404 handler
app.use("*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});
// Error handler
app.use((error, req, res, next) => {
  console.error("❌ Server Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Saga Food Truck Backend running on port ${PORT}`);
});
