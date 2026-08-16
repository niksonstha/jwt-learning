import type { Request, Response } from "express";
import { userRepository } from "../repositories/user.repository.js";

export const userController = {
  async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  },
};
