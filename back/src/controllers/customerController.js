import CustomerService from "../services/customerService.js";
import { Op } from "sequelize";
// LISTAR CLIENTES COM PAGINAÇÃO E FILTRO
async function list(req, res) {
  try {
    const q = req.query.q || "";
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = q ? { name: { [Op.iLike]: `%${q}%` } } : {};

    const { count, rows } = await CustomerService.findAndCountAll({
      where,
      order: [["name", "ASC"]],
      limit,
      offset,
    });

    return res.json({
      data: rows,
      meta: { total: count, page, limit },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar clientes" });
  }
}
// BUSCAR POR ID
async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const customer = await CustomerService.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.json(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar cliente" });
  }
}
// CRIAR CLIENTE
async function create(req, res) {
  try {
    const { name, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name é obrigatório" });
    }

    const customer = await CustomerService.create({ name, phone, email });

    return res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar cliente" });
  }
}
// ATUALIZAR CLIENTE
async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const customer = await CustomerService.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const { name, phone, email } = req.body;
    await CustomerService.update(id, { name, phone, email });

    const updatedCustomer = await CustomerService.findByPk(id);
    return res.json(updatedCustomer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
}
// REMOVER CLIENTE
async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const customer = await CustomerService.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await CustomerService.remove(id);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir cliente" });
  }
}
// EXPORT DEFAULT
export default {
  list,
  getById,
  create,
  update,
  remove,
};
