import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/httpException";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new HttpException(401, "No token provided");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    throw new HttpException(401, "Invalid or expired token");
  }
};
