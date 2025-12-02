export default function BaseRepository(model) {
  async function findAll(options = {}) {
    return model.findAll(options);
  }
  async function getById(id, options = {}) {
    return model.findByPk(id, options); // corrigido
  }
  async function findOne(options = {}) {
    return model.findOne(options);
  }
  async function create(data) {
    return model.create(data);
  }
  async function update(id, data) {
    const entity = await getById(id);
    if (!entity) throw new Error("Record not found");
    return entity.update(data);
  }
  async function remove(id) {
    const entity = await getById(id);
    if (!entity) throw new Error("Record not found");
    return entity.destroy();
  }

  return {
    findAll,
    getById,
    findOne,
    create,
    update,
    remove,
  };
}
