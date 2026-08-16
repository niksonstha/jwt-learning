import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),

  description: z.string().max(2000).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),

  description: z.string().max(2000).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
