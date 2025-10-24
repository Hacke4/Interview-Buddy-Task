import express from "express";
import upload from "../middleware/upload.js";
import Organization from "../models/Organization.js";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  toggleOrganizationStatus,
  getUsersByOrganization,
} from "../controllers/OrganizationController.js";

const router = express.Router();

router.post("/", createOrganization);
router.get("/organization/:orgId", getUsersByOrganization);
router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);
router.patch("/:id/status", toggleOrganizationStatus);
router.post("/:id/logo", upload.single("logo"), async (req, res) => {
  try {
    const org = await Organization.findByPk(req.params.id);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    org.logo_url = `/uploads/${req.file.filename}`;
    await org.save();

    res.json({
      message: "Logo uploaded successfully",
      logo_url: org.logo_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
