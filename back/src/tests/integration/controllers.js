import orderService from "../../../services/OrderService.js";
import OrderController from "../../../controllers/OrderController.js";

// mock do service
jest.mock("../../../services/OrderService.js");

describe("OrderController", () => {
  test("getAll should return 200", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // simula retorno do service
    orderService.getAll.mockResolvedValue([{ id: 1 }]);

    await OrderController.getAll(req, res);

    // garante que status foi chamado
    expect(res.status).toHaveBeenCalledWith(200);
    // garante que json foi chamado com os dados
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});
