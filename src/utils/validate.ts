import Joi from "joi";
import { LoginDTO, RegisterDTO } from "../Model/dto";

export const ValidateRegisterData = (userInput: RegisterDTO) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return registerSchema.validate(userInput);
};

export const ValidateLoginData = (userInput: LoginDTO) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return loginSchema.validate(userInput);
};
