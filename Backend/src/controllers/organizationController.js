import Organization from "../models/Organization.js";
import User from "../models/User.js";
import pkg from "sequelize";
const { Op } = pkg;

// ✅ MUST be exported functions

export const createOrganization = async (req, res) => {
  try {
    const { name, slug, org_email, phone_primary } = req.body;
    if (!name || !slug || !org_email || !phone_primary)
      return res.status(400).json({ message: "All fields are required" });

    const org = await Organization.create({
      name,
      slug,
      org_email,
      phone_primary,
    });

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
        { org_email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;

    const organizations = await Organization.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id"] }],
    });

    const data = organizations.map((org) => ({
      ...org.toJSON(),
      userCount: org.Users?.length || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id, { include: [User] });
    if (!org)
      return res.status(404).json({ message: "Organization not found" });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });
    await org.update(req.body);
    res.json({ message: "Organization updated successfully", org });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });
    await org.destroy();
    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleOrganizationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findByPk(id);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    const newStatus = org.status === "Active" ? "Inactive" : "Active";
    await org.update({ status: newStatus });

    res.json({ message: `Organization status updated to ${newStatus}`, org });
  } catch (error) {
    console.error("Error toggling organization status:", error);
    res.status(500).json({ message: "Error updating organization status" });
  }
};
// 6️⃣ Get all users belonging to a specific organization
export const getUsersByOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Check if org exists first (optional but cleaner)
    const org = await Organization.findByPk(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Fetch all users linked to that organization
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
