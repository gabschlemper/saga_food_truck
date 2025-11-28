import BaseRepository from "./baseRepository.js";
import OrderItem from "../models/orderItem.js";

const baseRepository = BaseRepository(OrderItem);

const OrderItemRepository = {
  ...baseRepository,
  // Aqui você pode adicionar métodos específicos de OrderItem se precisar
};

export default OrderItemRepository;
