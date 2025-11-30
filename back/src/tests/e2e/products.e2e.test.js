import request from "supertest";
import app from "../../app.js"; // Express app sem listen
import sequelize from "../../../database.js"; // conexão Sequelize
import Product from "../../models/product.js"; // seu model de produtos

beforeAll(async () => {
  // Sincroniza o banco de teste (limpa e recria tabelas)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fecha a conexão com o banco
  await sequelize.close();
});

describe("Products E2E - cobertura total", () => {
  let productId;

  test("POST /products - cria um novo produto", async () => {
    const payload = {
      name: "Pizza Calabresa",
      price: 45.5,
      stock: 10,
      category: "Pizza",
    };

    const response = await request(app).post("/products").send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Pizza Calabresa");
    expect(response.body.price).toBe("45.50"); // DECIMAL vem como string

    productId = response.body.id;

    // valida direto no banco
    const productInDb = await Product.findByPk(productId);
    expect(productInDb).not.toBeNull();
    expect(productInDb.name).toBe("Pizza Calabresa");
  });

  test("GET /products - lista produtos", async () => {
    const response = await request(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name");
  });

  test("PUT /products/:id - atualiza produto", async () => {
    const payload = {
      name: "Pizza Portuguesa",
      price: 50.0,
      stock: 8,
      category: "Pizza",
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Pizza Portuguesa");
    expect(response.body.price).toBe("50.00");

    // valida direto no banco
    const productInDb = await Product.findByPk(productId);
    expect(productInDb.name).toBe("Pizza Portuguesa");
    expect(productInDb.price).toBe("50.00");
  });

  test("DELETE /products/:id - remove produto", async () => {
    const response = await request(app).delete(`/products/${productId}`);

    expect(response.statusCode).toBe(204);

    // valida direto no banco
    const productInDb = await Product.findByPk(productId);
    expect(productInDb).toBeNull();
  });
});
