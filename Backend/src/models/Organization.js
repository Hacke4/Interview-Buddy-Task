import pkg from "sequelize";
const { DataTypes } = pkg;
import sequelize from "../config/db.js";

const Organization = sequelize.define(
  "Organization",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // Basic info (Step 1 form)
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    org_email: { type: DataTypes.STRING, allowNull: false },
    phone_primary: { type: DataTypes.STRING, allowNull: false },

    // Contact details - ADDED FIELDS
    primary_admin_name: { type: DataTypes.STRING },
    primary_admin_email: { type: DataTypes.STRING },
    support_email: { type: DataTypes.STRING },
    phone_alt1: { type: DataTypes.STRING },
    phone_alt2: { type: DataTypes.STRING },

    // Extended info
    max_coordinators: { type: DataTypes.INTEGER, defaultValue: 0 },
    timezone: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    website_url: { type: DataTypes.STRING },
    logo_url: { type: DataTypes.STRING },

    // General
    status: { type: DataTypes.STRING, defaultValue: "Active" },
  },
  { timestamps: true }
);

export default Organization;
