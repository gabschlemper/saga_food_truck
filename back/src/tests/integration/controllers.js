const orderService = require("../../../services/OrderService");
const OrderController = require("../../../controllers/OrderController");

jest.mock("../../../services/OrderService");

describe("OrderController", () => {
  test("getAll should return 200", async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    orderService.getAll.mockResolvedValue([{ id: 1 }]);

    await OrderController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});
