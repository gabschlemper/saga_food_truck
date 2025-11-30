import request from "supertest";
import app from "../../app.js"; // importa o app sem subir servidor
import employeeRepository from "../../repositories/employeeRepository.js";
// mock do repositório
jest.mock("../../repositories/employeeRepository.js");

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

  test("should fail login with wrong password", async () => {
    employeeRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "admin@test.com",
      password: "$2b$10$abcdefghijklmnopqrstuv",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "wrongpass" });

    expect(response.status).toBe(401);
    expect(response.body.token).toBeUndefined();
    expect(response.body.error).toBe("Credenciais inválidas");
  });

  test("should fail login with non-existing user", async () => {
    employeeRepository.findByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "notfound@test.com", password: "123456" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Usuário não encontrado");
  });

  test("should fail login when email or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "", password: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email e senha são obrigatórios");
  });

  test("should return a valid JWT token", async () => {
    employeeRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "admin@test.com",
      password: "$2b$10$abcdefghijklmnopqrstuv",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    // opcional: validar formato do JWT
    const tokenParts = response.body.token.split(".");
    expect(tokenParts.length).toBe(3); // header.payload.signature
  });
});
