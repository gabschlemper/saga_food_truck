import BaseRepository from "./baseRepository.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Customer from "../models/customer.js";
import Employee from "../models/employee.js";

const baseRepository = BaseRepository(Order);

const OrderRepository = {
  ...baseRepository,
  // Busca um pedido com relações (Employee, Customer, OrderItem)
  async findWithRelations(id) {
    return Order.findByPk(id, {
      include: [
        { model: Employee, attributes: ["id", "name"] },
        { model: Customer, attributes: ["id", "name"] },
        { model: OrderItem },
      ],
    });
  },
  // Busca todos os pedidos com relações
  async findAllWithRelations() {
    return Order.findAll({
      include: [{ model: Employee }, { model: Customer }, { model: OrderItem }],
    });
  },
};

export default OrderRepository;
