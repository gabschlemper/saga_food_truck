const request = require("supertest");
const app = require("../app"); // seu express app
const sequelize = require("../database");
const Sale = require("../src/Models/Sale");

beforeAll(async () => {
  // Sincroniza o banco de teste
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha a conexão com o banco
  await sequelize.close();
});

describe("Testando rota de vendas", () => {
  test("POST /sales - cria uma nova venda", async () => {
    const payload = {
    "customer": "hebert",
    "order": [
        {
            "item": "pizza",
            "qtd": 1
        }
    ],
    "total_payable": 45.6,
    "paid": false,
    "payment_method": "pix"
}

    const response = await request(app).post("/sales").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.customer).toBe("Teste Unit");
    expect(response.body.order[0].item).toBe("pizza");
  });

  test("GET /sales - lista vendas", async () => {
    const response = await request(app).get("/sales");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
