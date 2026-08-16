import type { Request, Response } from "express";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";
import { taskRepository } from "../repositories/task.repository.js";

export const taskController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    const task = await taskRepository.create({
      title: result.data.title,
      description: result.data.description,
      userId: req.user.id,
    });

    return res.status(201).json({
      task,
    });
  },

  async getMyTasks(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const tasks = await taskRepository.findByUserId(req.user.id);

    return res.status(200).json({
      tasks,
    });
  },

  async getById(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await taskRepository.findByIdAndUserId(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  },

  async update(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    const task = await taskRepository.updateByIdAndUserId(
      taskId,
      req.user.id,
      result.data,
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  },

  async delete(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await taskRepository.deleteByIdAndUserId(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  },
};
