const ProductRepository = require("../../../repositories/ProductRepository");
const Product = require("../../../models/Product");

jest.mock("../../../models/Product");

describe("ProductRepository", () => {
  test("findLowStock should call correct query", async () => {
    Product.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await ProductRepository.findLowStock();

    expect(Product.findAll).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });
});
