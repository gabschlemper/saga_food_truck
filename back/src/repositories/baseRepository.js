export default function BaseRepository(model) {
  // BUSCAR TODOS
  async function findAll(options = {}) {
    return model.findAll(options);
  }
  // BUSCAR POR ID
  async function findById(id, options = {}) {
    return model.findByPk(id, options);
  }
  // BUSCAR UM REGISTRO
  async function findOne(options = {}) {
    return model.findOne(options);
  }
  // CRIAR
  async function create(data) {
    return model.create(data);
  }
  // ATUALIZAR
  async function update(id, data) {
    const entity = await findById(id);
    if (!entity) throw new Error("Record not found");
    return entity.update(data);
  }
  // REMOVER
  async function remove(id) {
    const entity = await findById(id);
    if (!entity) throw new Error("Record not found");
    return entity.destroy();
  }

  return {
    findAll,
    findById,
    findOne,
    create,
    update,
    remove,
  };
}
