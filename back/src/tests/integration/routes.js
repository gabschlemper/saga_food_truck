import request from "supertest";
import app from "../../../app.js"; // importa o app sem listen

jest.mock("../../../middleware/authMiddleware.js", () => {
  return (req, res, next) => next();
});

describe("Products Routes", () => {
  test("GET /products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });
});
