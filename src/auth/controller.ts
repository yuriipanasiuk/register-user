import { Response, Request, NextFunction } from "express";
import httpError from "http-errors";
import bscrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "../db";

import {
  addUser,
  checkEmailExist,
  findUserById,
  updateUser,
  findUserByToken,
} from "./queries";

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface CustomRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    accesstoken: string;
    refreshtoken: string;
  };
}

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const singUp = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  pool.query(checkEmailExist, [email], async (error, result) => {
    if (error) throw error;

    const isEmailExist = result.rows.length;

    if (isEmailExist) {
      return next(httpError(409, "Email in use"));
    }

    const hashPassword = await bscrypt.hash(password, 10);

    pool.query(addUser, [name, email, hashPassword], (error, _result) => {
      if (error) throw error;

      res.status(201).json({
        user: {
          name,
          email,
          hashPassword,
        },
      });
    });
  });
};

const logIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  pool.query(checkEmailExist, [email], async (error, result) => {
    if (error) throw error;

    const user: IUser[] = result.rows;

    if (!user[0]) {
      return next(httpError(401, "Email or password is wrong"));
    }

    const comparePassword = await bscrypt.compare(password, user[0].password);

    if (!comparePassword) {
      return next(httpError(401, "Email or password is wrong"));
    }

    const payload = {
      id: user[0].id,
    };

    const accessToken =
      ACCESS_SECRET_KEY?.length &&
      jwt.sign(payload, ACCESS_SECRET_KEY, {
        expiresIn: "7h",
      });

    const refreshToken =
      REFRESH_SECRET_KEY?.length &&
      jwt.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: "7h",
      });

    pool.query(findUserById, [user[0].id], (error, _result) => {
      if (error) throw error;

      pool.query(
        updateUser,
        [user[0].id, accessToken, refreshToken],
        (error, _result) => {
          if (error) throw error;
        }
      );

      res.json({
        accessToken,
        refreshToken,
      });
    });
  });
};

const logOut = (req: CustomRequest, res: Response, _next: NextFunction) => {
  const { id } = req.user || {};
  console.log(id);

  pool.query(updateUser, [id, null, null], (error, _result) => {
    if (error) throw error;
  });

  res.json({ message: "user logged out" });
};

const getCurrent = (req: CustomRequest, res: Response, _next: NextFunction) => {
  const { name, email } = req.user || {};
  res.json({
    user: {
      name,
      email,
    },
  });
};

const refresh = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: token } = req.body;

  try {
    const verify: any =
      REFRESH_SECRET_KEY?.length && jwt.verify(token, REFRESH_SECRET_KEY);

    pool.query(findUserByToken, [token], (error, result) => {
      if (error) throw error;

      if (!result.rows.length) {
        return next(httpError(403, "Token is invalid"));
      }

      const payload = {
        id: verify.id,
      };

      const accessToken =
        ACCESS_SECRET_KEY?.length &&
        jwt.sign(payload, ACCESS_SECRET_KEY, {
          expiresIn: "7h",
        });

      const refreshToken =
        REFRESH_SECRET_KEY?.length &&
        jwt.sign(payload, REFRESH_SECRET_KEY, {
          expiresIn: "7h",
        });

      res.json({
        accessToken,
        refreshToken,
      });
    });
  } catch (error) {
    next(error);
  }
};

export { singUp, logIn, logOut, getCurrent, refresh };
