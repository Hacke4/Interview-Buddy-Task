// controllers/userController.js
import User from "../models/user.js";
import Organization from "../models/Organization.js";

// Create user under an organization
// 1️⃣ Create user
export const createUser = async (req, res) => {
  try {
    const { full_name, email, role, phone_number, organization_id } = req.body;
    if (!full_name || !email || !organization_id) {
      return res.status(400).json({
        message: "Full name, email, and organization ID are required",
      });
    }
    const org = await Organization.findByPk(organization_id);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    const user = await User.create({
      full_name,
      email,
      role,
      phone_number,
      organization_id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update(req.body);
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5️⃣ Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTotalUserCount = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ totalUsers: count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Error fetching user count" });
  }
};

import pkg from "sequelize";
const { fn, col } = pkg;

// 6️⃣ User Count by Org
export const getUserCountByOrganization = async (req, res) => {
  try {
    const counts = await User.findAll({
      attributes: [
        "organization_id",
        [fn("COUNT", col("User.id")), "userCount"],
      ],
      group: ["organization_id"],
    });

    res.json(counts);
  } catch (error) {
    console.error("Error fetching user count by organization:", error);
    res
      .status(500)
      .json({ message: "Error fetching user count by organization" });
  }
};
// 7️⃣ Get all users belonging to a specific org
export const getUsersByOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    console.log("✅ Received orgId:", orgId);

    const org = await Organization.findByPk(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const users = await User.findAll({
      where: { organization_id: orgId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "full_name",
        "email",
        "role",
        "phone_number",
        "status",
        "createdAt",
      ],
    });

    res.json({
      organization: org.name,
      organization_id: orgId,
      userCount: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users by organization:", error);
    res.status(500).json({ message: "Error fetching users by organization" });
  }
};
// 8️⃣ User Status toggle
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    await user.update({ status: newStatus });

    res.json({ message: `User status updated to ${newStatus}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
