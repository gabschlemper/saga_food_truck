const jwt = require("jsonwebtoken");

describe("JWT Utils", () => {
  const SECRET = "abc";

  test("should sign token", () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    expect(token).toBeDefined();
  });

  test("should verify token", () => {
    const token = jwt.sign({ id: 1 }, SECRET);
    const decoded = jwt.verify(token, SECRET);

    expect(decoded.id).toBe(1);
  });
});
