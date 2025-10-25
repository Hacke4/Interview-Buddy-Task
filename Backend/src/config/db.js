import * as SequelizeModule from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { Sequelize } = SequelizeModule.default
  ? SequelizeModule.default
  : SequelizeModule;

// Use DATABASE_URL if available (production), otherwise use individual variables (local)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || "interviewbuddy_db",
      process.env.DB_USER || "root",
      process.env.DB_PASS || "",
      {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        port: process.env.DB_PORT || 3306,
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
