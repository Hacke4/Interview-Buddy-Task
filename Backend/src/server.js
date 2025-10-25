import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import organizationRoutes from "./routes/OrganizationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json());
// org Logo
app.use("/uploads", express.static("uploads"));

// Base Routes
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running... 🚀");
});

// Sync DB + start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
