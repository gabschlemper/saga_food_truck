const { Employee } = require("../models");

async function list(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    return res.json({
      data: rows,
      meta: { total: count, page, limit },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar funcionários" });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await Employee.findByPk(id);

    if (!employee)
      return res.status(404).json({ error: "Funcionário não encontrado" });

    return res.json(employee);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
}

async function create(req, res) {
  try {
    const { name, email, password, role, active } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email e password são obrigatórios" });
    }

    // TODO: aplicar hash da senha no service antes de salvar
    const employee = await Employee.create({
      name,
      email,
      password,
      role,
      active,
    });

    return res.status(201).json(employee);
  } catch (err) {
    console.error(err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    return res.status(500).json({ error: "Erro ao criar funcionário" });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await Employee.findByPk(id);

    if (!employee)
      return res.status(404).json({ error: "Funcionário não encontrado" });

    const { name, email, password, role, active } = req.body;

    // TODO: se password for alterada, fazer hash antes de atualizar
    await employee.update({ name, email, password, role, active });

    return res.json(employee);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar funcionário" });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const employee = await Employee.findByPk(id);

    if (!employee)
      return res.status(404).json({ error: "Funcionário não encontrado" });

    await employee.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir funcionário" });
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
