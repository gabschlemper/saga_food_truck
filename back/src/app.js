import express from "express";

const app = express();
app.use(express.json());

// rota de saúde
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// rotas de produtos
import productRoutes from "./routes/productRoutes.js";
app.use("/products", productRoutes);

// registre a rota
import authRoutes from "./routes/employeeRoutes.js";
app.use("/api/auth/login", authRoutes);

import orderRoutes from "./routes/ordersRoutes.js";
app.use("/orders", orderRoutes);
// rota de saúde
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
