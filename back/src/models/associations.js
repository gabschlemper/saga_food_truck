import Order from "./order.js";
import Customer from "./customer.js";
import Employee from "./employee.js";
import OrderItem from "./orderItem.js";

export default function setupAssociations() {
  Order.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
  Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

  Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });
  Employee.hasMany(Order, { foreignKey: "employeeId", as: "orders" });
}
