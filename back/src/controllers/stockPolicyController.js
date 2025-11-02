const { StockPolicy } = require("../Models/StockPolicy");

// ------------------- LISTAR TODAS AS POLÍTICAS -------------------
async function index(req, res) {
  try {
    const policies = await StockPolicy.findAll();
    return res.json(policies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------- CRIAR NOVA POLÍTICA -------------------
async function create(req, res) {
  try {
    const policy = await StockPolicy.create(req.body);
    return res.status(201).json(policy);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// ------------------- ATUALIZAR POLÍTICA EXISTENTE -------------------
async function update(req, res) {
  try {
    const { id } = req.params;
    const policy = await StockPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({ error: "Política não encontrada" });
    }

    await policy.update(req.body);
    return res.json(policy);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// ------------------- DELETAR POLÍTICA -------------------
async function remove(req, res) {
  try {
    const { id } = req.params;
    const policy = await StockPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({ error: "Política não encontrada" });
    }

    await policy.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------- EXPORTAÇÃO -------------------
module.exports = {
  index,
  create,
  update,
  remove,
};
