const request = require("supertest");
const app = require("../../app");

jest.mock("../../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});

describe("Orders E2E", () => {
  test("GET /orders", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(200);
  });
});
