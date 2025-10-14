const userService = require("../Services/UserService");
const { Op } = require("sequelize");
const service = new userService();

class userController {
  // Função genérica para tratamento de erros
  handleError = (res, error, notFoundMessage = "Usuário não encontrado") => {
    console.error(error);

    if (error.message?.includes("not found")) {
      return res.status(404).json({ success: false, message: notFoundMessage });
    }

    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
      return res.status(400).json({ success: false, message: "Erro de validação", errors });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path;
      const message = field === "email" ? "Email já cadastrado" : "Matrícula já cadastrada";
      return res.status(409).json({ success: false, message });
    }

    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  };

  createUser = async (req, res) => {
    try {
      const { name, email, password, user_Type, registry } = req.body;

      if (!name || !email || !password || !registry) {
        return res.status(400).json({
          success: false,
          message: "Nome, email, senha e matrícula são obrigatórios",
        });
      }

      const user = await service.createUser({ name, email, password, user_Type, registry });
      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        data: user.toSafeJSON(),
      });

    } catch (error) {
      this.handleError(res, error);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await service.getAllUsers();
      return res.json({ success: true, data: users });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await service.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      return res.json({ success: true, data: user });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateUser = async (req, res) => {
    try {
      const user = await service.updateUser(req.params.id, req.body);
      return res.json({ success: true, message: "Usuário atualizado com sucesso", data: user });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      const result = await service.deleteUser(req.params.id);
      return res.json({ success: true, message: "Usuário desativado com sucesso", data: result });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

module.exports = userController;
