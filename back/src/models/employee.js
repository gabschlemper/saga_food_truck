import { DataTypes } from "sequelize";

export default (sequelize) => {
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
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      tableName: "employees",
    }
  );

  return Employee;
};
