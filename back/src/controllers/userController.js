const userService = require("../services/userService");

// ---------- Função genérica de tratamento de erros ----------
function handleError(res, error, notFoundMessage = "Usuário não encontrado") {
  console.error(error);

  if (error.message?.includes("not found")) {
    return res.status(404).json({ success: false, message: notFoundMessage });
  }

  if (error.name === "SequelizeValidationError") {
    const errors = error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return res
      .status(400)
      .json({ success: false, message: "Erro de validação", errors });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    const field = error.errors[0]?.path;
    const message =
      field === "email" ? "Email já cadastrado" : "Matrícula já cadastrada";
    return res.status(409).json({ success: false, message });
  }

  return res
    .status(500)
    .json({ success: false, message: "Erro interno do servidor" });
}

// ---------- CREATE USER ----------
async function createUser(req, res) {
  try {
    const { name, email, password, userType, registry } = req.body;

    if (!name || !email || !password || !registry) {
      return res.status(400).json({
        success: false,
        message: "Nome, email, senha e matrícula são obrigatórios",
      });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      userType,
      registry,
    });
    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: userService.toSafeJSON(user),
    });
  } catch (error) {
    handleError(res, error);
  }
}

// ---------- GET ALL USERS ----------
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.json({ success: true, data: users.map(userService.toSafeJSON) });
  } catch (error) {
    handleError(res, error);
  }
}

// ---------- GET USER BY ID ----------
async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    return res.json({ success: true, data: userService.toSafeJSON(user) });
  } catch (error) {
    handleError(res, error);
  }
}

// ---------- UPDATE USER ----------
async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.json({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: userService.toSafeJSON(user),
    });
  } catch (error) {
    handleError(res, error);
  }
}

// ---------- DELETE USER ----------
async function deleteUser(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.json({
      success: true,
      message: "Usuário desativado com sucesso",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
}

// ---------- EXPORTA TODAS AS FUNÇÕES ----------
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
