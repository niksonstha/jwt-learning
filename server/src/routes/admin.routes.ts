import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/authorization.middleware.js";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  requireRole("admin"),
  adminController.dashboard,
);

export default router;
