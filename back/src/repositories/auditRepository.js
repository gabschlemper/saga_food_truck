import OrderAudit from "../models/orderAudit.js";
import ProductAudit from "../models/productAudit.js";
// BASE REPOSITORY
function BaseRepository(model) {
  async function findAll(options = {}) {
    return model.findAll(options);
  }
  async function findById(id, options = {}) {
    return model.findByPk(id, options);
  }
  async function findOne(options = {}) {
    return model.findOne(options);
  }
  async function create(data) {
    return model.create(data);
  }
  async function update(id, data) {
    const entity = await findById(id);
    if (!entity) throw new Error("Record not found");
    return entity.update(data);
  }
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
// REPOSITÓRIOS ESPECÍFICOS
const OrderAuditRepository = {
  ...BaseRepository(OrderAudit),
  async getByOrder(orderId) {
    return OrderAudit.findAll({
      where: { orderId },
      order: [["actionDate", "DESC"]],
    });
  },
};

const ProductAuditRepository = {
  ...BaseRepository(ProductAudit),
  async getByProduct(productId) {
    return ProductAudit.findAll({
      where: { productId },
      order: [["actionDate", "DESC"]],
    });
  },
};
// EXPORTAÇÃO DEFAULT
export default {
  OrderAuditRepository,
  ProductAuditRepository,
};
