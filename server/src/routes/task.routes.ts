import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { taskController } from "../controllers/task.controller.js";

const router = Router();

router.post("/", authenticate, taskController.create);

router.get("/", authenticate, taskController.getMyTasks);

router.get("/:id", authenticate, taskController.getById);

router.patch("/:id", authenticate, taskController.update);

router.delete("/:id", authenticate, taskController.delete);

export default router;
