import ProductService from "../services/productService.js";
import { Op } from "sequelize";

// LISTAR PRODUTOS COM PAGINAÇÃO E FILTRO
async function list(req, res) {
  try {
    const q = req.query.q || "";
    const category = req.query.category;
    const status = req.query.status;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = { active: true };
    if (q) where.name = { [Op.iLike]: `%${q}%` };
    if (category) where.category = category;
    if (status) where.status = status;

    // 👇 agora chamamos getAllPaged em vez de findAndCountAll
    const { count, rows } = await ProductService.getAllPaged({
      where,
      order: [["name", "ASC"]],
      limit,
      offset,
    });

    return res.json({ data: rows, meta: { total: count, page, limit } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar produtos" });
  }
}

// BUSCAR POR ID
async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getById(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
}

// CRIAR PRODUTO
async function create(req, res) {
  try {
    const {
      name,
      description,
      price,
      stock = 0,
      minimumStock = 0,
      category = "Outros",
      active = true,
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: "name e price são obrigatórios" });
    }

    const product = await ProductService.create({
      name,
      description,
      price,
      stock,
      minimumStock,
      category,
      active,
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar produto" });
  }
}

// ATUALIZAR PRODUTO
async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getById(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const { name, description, price, stock, minimumStock, category, active } =
      req.body;

    await ProductService.update(id, {
      name,
      description,
      price,
      stock,
      minimumStock,
      category,
      active,
    });

    const updatedProduct = await ProductService.getById(id);
    return res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

// REMOVER PRODUTO
async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getById(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await ProductService.remove(id);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir produto" });
  }
}

// AJUSTAR ESTOQUE (manualmente)
async function adjustStock(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { delta } = req.body;

    if (typeof delta !== "number") {
      return res.status(400).json({ error: "delta (number) obrigatório" });
    }

    const product = await ProductService.getById(id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const newStock = product.stock + delta;
    if (newStock < 0) {
      return res
        .status(400)
        .json({ error: "Resultado do estoque não pode ser negativo" });
    }

    await ProductService.update(id, { stock: newStock });
    const updatedProduct = await ProductService.getById(id);

    return res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao ajustar estoque" });
  }
}

// EXPORT DEFAULT
export default {
  list,
  getById,
  create,
  update,
  remove,
  adjustStock,
};
