/*// repositories/userRepository.js
const User = require("../models/user");

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function findById(id) {
  return User.findByPk(id);
}

async function createUser(data) {
  return User.create(data);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};*/

const BaseRepository = require("./baseRepository");
const User = require("../models/user");

const base = BaseRepository(User);

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

module.exports = {
  ...base,
  findByEmail,
};
