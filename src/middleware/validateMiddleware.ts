import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/httpException";
import { ValidateLoginData, ValidateRegisterData } from "../utils/validate";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = ValidateRegisterData(req.body);
  if (error) throw new HttpException(400, error.details[0].message);
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = ValidateLoginData(req.body);
  if (error) throw new HttpException(400, error.details[0].message);
  next();
};
