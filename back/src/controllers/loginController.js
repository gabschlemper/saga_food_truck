const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const DB_SECRET = process.env.DB_SECRET;
const JWT_EXPIRES = "8h"; // tempo de expiração do token

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email e senha são obrigatórios" });
    }

    const user = await userService.findByEmail(email, true);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res
        .status(401)
        .json({ success: false, message: "Senha incorreta" });

    // Gera token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.userType },
      DB_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      success: true,
      data: userService.toSafeJSON(user),
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor" });
  }
}

module.exports = { login };
