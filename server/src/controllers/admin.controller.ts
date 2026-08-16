import type { Request, Response } from "express";

export const adminController = {
  dashboard(req: Request, res: Response) {
    return res.status(200).json({
      message: "Welcome to the admin dashboard",
      user: req.user,
    });
  },
};
