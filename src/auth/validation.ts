import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";

const validation = (schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(httpError(400, "missing required name field"));
    }
    next();
  };
};

export default validation;
