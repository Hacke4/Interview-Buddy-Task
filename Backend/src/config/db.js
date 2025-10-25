// src/config/db.js
import * as SequelizeModule from "sequelize";
import dotenv from "dotenv";

dotenv.config();

//  Sequelize's default export is the constructor class
const { Sequelize } = SequelizeModule.default
  ? SequelizeModule.default
  : SequelizeModule;

const sequelize = new Sequelize(
  process.env.DB_NAME || "interviewbuddy_db", // ← Fallback for local
  process.env.DB_USER || "root", // ← Fallback for local
  process.env.DB_PASS || "", // ← Fallback for local
  {
    host: process.env.DB_HOST || "localhost", // ← Fallback for local
    dialect: process.env.DB_DIALECT || "mysql", // ← Auto-switch!
    port:
      process.env.DB_PORT ||
      (process.env.DB_DIALECT === "postgres" ? 5432 : 3306),
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: { require: true, rejectUnauthorized: false },
          }
        : {},
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
}

export default sequelize;
