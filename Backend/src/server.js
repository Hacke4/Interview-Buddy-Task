import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (for logo uploads)
app.use("/uploads", express.static("uploads"));

// ✅ ROOT ROUTES (Add these BEFORE API routes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Organization Management API 🚀",
    status: "running",
    version: "1.0.0",
    endpoints: {
      root: "/",
      api: "/api",
      organizations: "/api/organizations",
      users: "/api/users",
    },
    documentation: "Visit /api for API details",
  });
});

// API root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "API is running successfully ✅",
    version: "1.0.0",
    endpoints: {
      organizations: {
        getAll: "GET /api/organizations",
        getById: "GET /api/organizations/:id",
        create: "POST /api/organizations",
        update: "PUT /api/organizations/:id",
        delete: "DELETE /api/organizations/:id",
        uploadLogo: "POST /api/organizations/:id/logo",
        toggleStatus: "PATCH /api/organizations/:id/status",
      },
      users: {
        getAll: "GET /api/users",
        getById: "GET /api/users/:id",
        create: "POST /api/users",
        update: "PUT /api/users/:id",
        delete: "DELETE /api/users/:id",
        getByOrg: "GET /api/organizations/:orgId/users",
      },
    },
  });
});

// ✅ API ROUTES
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);

// ✅ 404 Handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    message: "The requested endpoint does not exist",
    availableEndpoints: {
      root: "/",
      api: "/api",
      organizations: "/api/organizations",
      users: "/api/users",
    },
  });
});

// ✅ Database sync and server start
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`📍 API Docs: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
