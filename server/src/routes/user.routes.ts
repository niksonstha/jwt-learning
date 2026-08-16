import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, userController.me);

export default router;
