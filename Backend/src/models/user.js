// models/User.js
import pkg from "sequelize";
const { DataTypes } = pkg;
import sequelize from "../config/db.js";
import Organization from "./organization.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Coordinator", "Viewer"),
      defaultValue: "Coordinator",
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    organization_id: {
      type: DataTypes.INTEGER,
      references: { model: "Organizations", key: "id" }, // ✅ Keep as string model name here
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

Organization.hasMany(User, { foreignKey: "organization_id" });
User.belongsTo(Organization, { foreignKey: "organization_id" });

export default User;
