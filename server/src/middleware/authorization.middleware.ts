import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

type UserRole = "user" | "admin";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
}
