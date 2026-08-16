import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

import { taskRepository } from "../repositories/task.repository.js";

import { AppError } from "../errors/app-error.js";

import { asyncHandler } from "../utils/async-handler.js";

import type { AuthenticatedRequest } from "../types/auth.js";

export const taskController = {
  create: asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Validation failed", 400, result.error.flatten());
    }

    const task = await taskRepository.create({
      title: result.data.title,
      description: result.data.description,
      userId: req.user.id,
    });

    return res.status(201).json({
      task,
    });
  }),

  getMyTasks: asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const tasks = await taskRepository.findByUserId(req.user.id);

    return res.status(200).json({
      tasks,
    });
  }),

  getById: asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await taskRepository.findByIdAndUserId(taskId, req.user.id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      task,
    });
  }),

  update: asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      throw new AppError("Invalid task ID", 400);
    }

    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Validation failed", 400, result.error.flatten());
    }

    const task = await taskRepository.updateByIdAndUserId(
      taskId,
      req.user.id,
      result.data,
    );

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      task,
    });
  }),

  delete: asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await taskRepository.deleteByIdAndUserId(taskId, req.user.id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  }),
};
