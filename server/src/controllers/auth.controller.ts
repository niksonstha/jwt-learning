import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    try {
      const user = await authService.register(result.data);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Email already registered"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten(),
      });
    }

    try {
      const loginResult = await authService.login(validationResult.data);

      return res.status(200).json(loginResult);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};
