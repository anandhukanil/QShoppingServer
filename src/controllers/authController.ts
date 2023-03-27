import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const loginHandler: RequestHandler = (req, res, next) => {
  const { user } = req.body;
  const accessSecret = process.env.JWT_ACCESS_SECRET || "";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "";

  if (user) {

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessSecret,
      { expiresIn: "20m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      refreshSecret
    );

    // refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken
    });
  } else {
    res.send("Username or password incorrect");
  }
};