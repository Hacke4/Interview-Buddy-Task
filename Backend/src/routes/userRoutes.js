import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTotalUserCount,
  toggleUserStatus,
  getUserCountByOrganization,
  getUsersByOrganization,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/count", getTotalUserCount);
router.get("/count/organization", getUserCountByOrganization);
router.get("/organization/:orgId", getUsersByOrganization);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/status", toggleUserStatus);

export default router;
