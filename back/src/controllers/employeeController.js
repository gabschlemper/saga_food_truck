import EmployeeService from "../services/employeeService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// LOGIN
async function loginController(req, res) {
  try {
    console.log("📩 [LOGIN] Body recebido:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.warn("⚠️ [LOGIN] Email ou senha não enviados");
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const employee = await EmployeeService.findByEmail(email);
    console.log("👤 [LOGIN] Employee encontrado:", employee);

    if (!employee) {
      console.warn(
        "❌ [LOGIN] Nenhum funcionário encontrado com email:",
        email
      );
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    console.log(
      "🔑 [LOGIN] Resultado da comparação de senha:",
      isPasswordValid
    );

    if (!isPasswordValid) {
      console.warn("❌ [LOGIN] Senha inválida para:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "10h" }
    );

    console.log("✅ [LOGIN] Token gerado:", token);

    // 🔥 Retorno compatível com o mock
    return res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error("💥 [LOGIN] Erro inesperado:", err);
    return res.status(500).json({ error: "Erro no login" });
  }
}

// LISTAR FUNCIONÁRIOS COM PAGINAÇÃO
async function list(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await EmployeeService.findAndCountAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    return res.json({
      data: rows.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        role: e.role,
      })),
      meta: { total: count, page, limit },
    });
  } catch (err) {
    console.error("💥 [LIST] Erro:", err);
    return res.status(500).json({ error: "Erro ao listar funcionários" });
  }
}

// BUSCAR POR ID
async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await EmployeeService.getById(id);

    if (!employee) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    return res.json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
  } catch (err) {
    console.error("💥 [GET BY ID] Erro:", err);
    return res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
}

// CRIAR FUNCIONÁRIO
async function create(req, res) {
  try {
    const { name, email, password, role, active } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email e password são obrigatórios" });
    }

    const employee = await EmployeeService.create({
      name,
      email,
      password,
      role,
      active,
    });

    return res.status(201).json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
  } catch (err) {
    console.error("💥 [CREATE] Erro:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    return res.status(500).json({ error: "Erro ao criar funcionário" });
  }
}

// ATUALIZAR FUNCIONÁRIO
async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await EmployeeService.getById(id);

    if (!employee) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    const { name, email, password, role, active } = req.body;
    await EmployeeService.update(id, { name, email, password, role, active });

    const updatedEmployee = await EmployeeService.getById(id);

    return res.json({
      id: updatedEmployee.id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
    });
  } catch (err) {
    console.error("💥 [UPDATE] Erro:", err);
    return res.status(500).json({ error: "Erro ao atualizar funcionário" });
  }
}

// REMOVER FUNCIONÁRIO
async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await EmployeeService.getById(id);

    if (!employee) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    await EmployeeService.remove(id);
    return res.status(204).send();
  } catch (err) {
    console.error("💥 [REMOVE] Erro:", err);
    return res.status(500).json({ error: "Erro ao excluir funcionário" });
  }
}

// EXPORT DEFAULT
export default {
  loginController,
  list,
  getById,
  create,
  update,
  remove,
};
