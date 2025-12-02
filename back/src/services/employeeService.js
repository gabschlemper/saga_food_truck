import EmployeeRepository from "../repositories/employeeRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Buscar todos
async function getAll() {
  return EmployeeRepository.findAll();
}
// Buscar por ID
async function getById(id) {
  const employee = await EmployeeRepository.getById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}
// Buscar por email (para login)
async function findByEmail(email) {
  return EmployeeRepository.findByEmail(email);
}
// Criar novo funcionário (já com senha criptografada)
async function create(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return EmployeeRepository.create({ ...data, password: hashedPassword });
}
// Atualizar
async function update(id, data) {
  const employee = await getById(id);
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return employee.update(data);
}
// Remover
async function remove(id) {
  const employee = await getById(id);
  return employee.destroy();
}
// Login
async function login(email, password) {
  const employee = await findByEmail(email);
  if (!employee) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "10h" }
  );

  return { employee, token };
}
// Exportações
export default {
  getAll,
  getById,
  findByEmail,
  create,
  update,
  remove,
  login,
};
