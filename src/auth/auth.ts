import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";
import jwt from "jsonwebtoken";

import pool from "../db";
import { findUserById, checkToken } from "./queries";

interface CustomRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    accesstoken: string;
    refreshtoken: string;
  };
}

const { ACCESS_SECRET_KEY } = process.env;

const auth = (req: CustomRequest, _res: Response, next: NextFunction) => {
  try {
    const { authorization = "" } = req.headers;
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      return next(httpError(401, "Not autorized"));
    }
    const payload: any =
      ACCESS_SECRET_KEY?.length && jwt.verify(token, ACCESS_SECRET_KEY);

    pool.query(findUserById, [payload.id], (error, result) => {
      if (error) throw error;

      if (!result.rows.length) {
        return next(httpError(401, "Not autorized"));
      }

      pool.query(checkToken, [token], (error, result) => {
        if (error) throw error;

        if (!result.rows.length) {
          return next(httpError(401, "Not autorized"));
        }
        req.user = result.rows[0];

        next();
      });
    });
  } catch (error: any) {
    if (error.message === "invalid signature") {
      return next(httpError(401, "Not autorized"));
    }

    next(error);
  }
};

export default auth;
