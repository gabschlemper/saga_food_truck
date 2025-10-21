/*require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Model User, já com passwordHash

class loginController {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos obrigatórios.",
        });
      }

      // Busca o usuário no banco pelo email
      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      // Compara a senha recebida com a hash do banco
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Senha incorreta.",
        });
      }

      // Gera token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.DB_SECRET,
        { expiresIn: "24h" }
      );

      // Retorna dados do usuário
      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.getFullName(),
          email: user.email,
          role: user.getTextUserType(),
        },
      });
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor.",
      });
    }
  };
}

module.exports = loginController;*/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta"; // melhor definir em .env
const JWT_EXPIRES = "1h"; // tempo de expiração do token

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email e senha são obrigatórios" });
    }

    const user = await userService.findByEmail(email, true);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ success: false, message: "Senha incorreta" });

    // Gera token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.userType },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      success: true,
      data: userService.toSafeJSON(user),
      token
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}

module.exports = { login };
