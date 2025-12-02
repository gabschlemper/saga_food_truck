import BaseRepository from "./baseRepository.js";
import Employee from "../models/employee.js";

const baseRepository = BaseRepository(Employee);

const EmployeeRepository = {
  ...baseRepository,
  // Busca um funcionário pelo e-mail
  async findByEmail(email) {
    const employee = await Employee.findOne({ where: { email } });
    return employee || null; // garante que retorne null se não encontrar
  },
};

export default EmployeeRepository;
