// src/App.jsx
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TelaAtendente from "./pages/TelaAtendente";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";

import "./styles.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  // Sem token → volta pro login
  if (!token) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Redireciona "/" → "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/atendente"
            element={
              <ProtectedRoute>
                <TelaAtendente />
              </ProtectedRoute>
            }
          />

          {/* OUTRAS TELAS */}
          <Route path="/test" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/novo-pedido" element={<NewOrder />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
