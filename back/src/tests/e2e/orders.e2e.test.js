import request from "supertest";
import app from "../../app.js";
import sequelize from "../../../database.js";
import Order from "../../models/order.js";

beforeAll(async () => {
  // Sincroniza o banco de teste (limpa e recria tabelas)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha a conexão com o banco
  await sequelize.close();
});

describe("Orders E2E - persistência no banco", () => {
  test("POST /orders - cria pedido e valida no banco", async () => {
    const payload = {
      employeeId: 1,
      customerName: "Hebert",
      total: 150.75,
      paymentMethod: "Pix",
      paymentStatus: "Pendente",
      status: "Aguardando Pagamento",
      notes: "Pedido de teste",
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    // cria via API
    const response = await request(app).post("/orders").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");

    // consulta direto no banco
    const orderInDb = await Order.findByPk(response.body.id);

    expect(orderInDb).not.toBeNull();
    expect(orderInDb.customerName).toBe("Hebert");
    // Sequelize retorna DECIMAL como string
    expect(orderInDb.total).toBe("150.75");
  });

  test("GET /orders - lista pedidos e valida total", async () => {
    const response = await request(app).get("/orders");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // valida que o campo total existe e é string decimal
    expect(response.body[0]).toHaveProperty("total");
    expect(typeof response.body[0].total).toBe("string");
  });
});
