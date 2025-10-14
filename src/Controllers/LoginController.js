require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../Models/User"); // Model User, já com passwordHash

class loginController {
  login = async (req, res) => {
    try {
      const { email, registry, password } = req.body;

      if (!email || !registry || !password) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos obrigatórios.",
        });
      }

      // Busca o usuário no banco pelo email e registry
      const user = await user.findOne({
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
          user_Type: user.user_Type,
        },
        process.env.DB_SECRET,
        { expiresIn: "8h" }
      );

      // Retorna dados do usuário
      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.getFullName(),
          email: user.email,
          registry: user.registry,
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

module.exports = loginController;
