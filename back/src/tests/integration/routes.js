const request = require("supertest");
const app = require("../../../app");

jest.mock(
  "../../../middleware/authMiddleware",
  () => (req, res, next) => next()
);

describe("Products Routes", () => {
  test("GET /products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });
});
