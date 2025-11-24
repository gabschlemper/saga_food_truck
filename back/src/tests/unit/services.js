const orderService = require("../../../services/OrderService");
const orderRepository = require("../../../repositories/OrderRepository");
const productRepository = require("../../../repositories/ProductRepository");

jest.mock("../../../repositories/OrderRepository");
jest.mock("../../../repositories/ProductRepository");

describe("OrderService", () => {
  test("should not create order if product stock is insufficient", async () => {
    productRepository.findById.mockResolvedValue({
      stock: 2,
    });

    const payload = {
      items: [{ productId: 1, quantity: 10 }],
    };

    await expect(orderService.create(payload)).rejects.toThrow(
      "Insufficient stock for product 1"
    );
  });
});

const employeeService = require("../../../services/EmployeeService");
const employeeRepository = require("../../../repositories/EmployeeRepository");

jest.mock("../../../repositories/EmployeeRepository");

describe("EmployeeService", () => {
  test("should return all employees", async () => {
    employeeRepository.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await employeeService.getAll();

    expect(result).toHaveLength(1);
    expect(employeeRepository.findAll).toHaveBeenCalled();
  });

  test("should throw error when employee not found", async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(employeeService.getById(999)).rejects.toThrow(
      "Employee not found"
    );
  });
});
