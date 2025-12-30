import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/HttpException";

export const ErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    res.status(err.status).json({ success: false, message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
