import { HttpException } from "../utils/httpException";
import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const scholar = (req as any).user;

  if (scholar.role !== "admin") {
    throw new HttpException(403, "Access denied, Admin only");
  }
  next();
};
