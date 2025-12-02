import { DataTypes } from "sequelize";
import sequelize from "../../database.js";
import bcrypt from "bcrypt";

const Employee = sequelize.define(
  "Employee",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "atendente"),
      defaultValue: "atendente",
    },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "employee",
    timestamps: true, // usa createdAt / updatedAt
    underscored: false, // não converte para snake_case
    hooks: {
      async beforeCreate(employee) {
        if (employee.password) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
      async beforeUpdate(employee) {
        if (employee.changed("password")) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
    },
  }
);

export default Employee;
