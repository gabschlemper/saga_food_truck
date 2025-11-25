function BaseRepository(model) {
  // ============================
  // FIND ALL
  // ============================
  async function findAll(options = {}) {
    return model.findAll(options);
  }

  // ============================
  // FIND BY ID
  // ============================
  async function findById(id, options = {}) {
    return model.findByPk(id, options);
  }

  // ============================
  // CREATE
  // ============================
  async function create(data) {
    return model.create(data);
  }

  // ============================
  // UPDATE
  // ============================
  async function update(id, data) {
    const entity = await findById(id);
    if (!entity) throw new Error("Record not found");
    return entity.update(data);
  }

  // ============================
  // DELETE
  // ============================
  async function remove(id) {
    const entity = await findById(id);
    if (!entity) throw new Error("Record not found");
    return entity.destroy();
  }

  // retornar funções públicas
  return {
    findAll,
    findById,
    create,
    update,
    delete: remove, // mantém nome compatível
  };
}

module.exports = BaseRepository;
