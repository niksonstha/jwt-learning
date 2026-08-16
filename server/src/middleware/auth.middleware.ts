import "dotenv/config";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthUser } from "../types/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const jwtSecret: string = JWT_SECRET;

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (
      typeof payload !== "object" ||
      !payload.sub ||
      (payload.role !== "user" && payload.role !== "admin")
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user: AuthUser = {
      id: payload.sub,
      role: payload.role,
    };

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
