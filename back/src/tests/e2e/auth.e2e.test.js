const request = require("supertest");
const app = require("../../app");
const employeeRepository = require("../../repositories/EmployeeRepository");

jest.mock("../../repositories/EmployeeRepository");

describe("Auth E2E", () => {
  test("should login successfully", async () => {
    employeeRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "admin@test.com",
      password: "$2b$10$abcdefghijklmnopqrstuv", // bcrypt mock
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
