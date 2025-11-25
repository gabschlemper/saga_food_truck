const BaseRepository = require("./baseRepository");
const OrderItem = require("../models/orderItem");

const base = BaseRepository(OrderItem);

module.exports = {
  ...base,
};
