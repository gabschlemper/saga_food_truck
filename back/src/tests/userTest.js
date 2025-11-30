import request from "supertest";
import app from "../../src/app.js"; // Express app sem listen
import sequelize from "../../database.js"; // conexão Sequelize
// import Order from "../../src/Models/Order.js"; // model de pedidos

beforeAll(async () => {
  // Sincroniza o banco de teste (limpa e recria tabelas)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha a conexão com o banco
  await sequelize.close();
});

describe("Testando rota de pedidos", () => {
  test("POST /orders - cria um novo pedido", async () => {
    const payload = {
      customer: "hebert",
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      total: 99.9,
      status: "pending",
    };

    const response = await request(app).post("/orders").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id"); // garante que criou
    expect(response.body.customer).toBe("hebert");
    expect(response.body.items[0].productId).toBe(1);
  });

  test("GET /orders - lista pedidos", async () => {
    const response = await request(app).get("/orders");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
