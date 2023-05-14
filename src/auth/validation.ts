import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";
import Joi from "joi";

interface IValidateSchema {
  name?: string;
  email: string;
  password: string;
}

const validation = (schema: Joi.Schema<IValidateSchema>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(httpError(400, "missing required name field"));
    }
    next();
  };
};

export default validation;
