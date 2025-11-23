const BaseRepository = require("./baseRepository");
const Employee = require("../models/employee");

const base = BaseRepository(Employee);

module.exports = {
  ...base,

  async findByEmail(email) {
    return Employee.findOne({ where: { email } });
  },
};
