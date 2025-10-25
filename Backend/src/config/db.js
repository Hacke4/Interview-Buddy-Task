// src/config/db.js
import * as SequelizeModule from "sequelize";
import dotenv from "dotenv";

dotenv.config();

//  Sequelize's default export is the constructor class
const { Sequelize } = SequelizeModule.default
  ? SequelizeModule.default
  : SequelizeModule;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
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
