import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequest } from "../types";

const auth = (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_ACCESS_SECRET as string;

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user as string;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default auth;