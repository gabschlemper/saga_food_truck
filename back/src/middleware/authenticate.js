const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acesso requerido",
      });
    }

    const decoded = jwt.verify(token, process.env.DB_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Usuário não encontrado ou inativo",
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      permissions:
        typeof user.getPermissions === "function" ? user.getPermissions() : [],
    };

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(403).json({
      success: false,
      message: "Token inválido ou expirado",
    });
  }
};

module.exports = authenticate;
