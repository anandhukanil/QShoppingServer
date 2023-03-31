import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user";
import bcrypt from "bcryptjs";
import RefreshTokenModel from "../models/token";
import { generateTokens } from "../functions/helpers";

export const loginController: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  const accessSecret = process.env.JWT_ACCESS_SECRET || "";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "";

  if (username && password) {
    try {
      const user = await UserModel.findOne({ email: username });
      if (!user?.email) {
        res.status(404).send("User not found");
        return;
      }
      const passwordIsValid = bcrypt.compareSync(password, user.hash);

      if (!passwordIsValid) {
        res.status(400).send("Username or password is incorrect");
        return;
      }

      const {accessToken, refreshToken} = generateTokens(user.toJSON(), {accessSecret, refreshSecret});

      await RefreshTokenModel.create({
        token: refreshToken,
      });

      res.json({
        accessToken,
        refreshToken,
        user: user.toJSON()
      });

    } catch (error) {
      res.status(500).send("Something went wrong");
    }    
  } else {
    res.status(400).send("Username or password is incorrect");
  }
};

export const logoutController: RequestHandler = async (req, res) => {
  const { user, token } = req.body;

  if (user && user.email) {
    try {
      await RefreshTokenModel.findOneAndDelete({ token });
    } catch (err) {
      console.error("Token not found");
    }

    res.send("success");
  } else {
    res.status(400).send("User data not found.");
  }
};

export const refreshTokenController: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;
  const accessSecret = process.env.JWT_ACCESS_SECRET || "";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "";

  if(!refreshToken) {
    res.status(401).send("Invalid request");
    return;
  }

  try {
    const validToken = await RefreshTokenModel.findOne({ token: refreshToken });
    if (!validToken?.token) {
      res.status(401).send("Invalid token");
      return;
    }
    const decrypted = await jwt.verify(validToken.token, refreshSecret) as JwtPayload;
    const user = await UserModel.findOne({ email: decrypted.username });
    if (!user?.email) {
      res.status(403).send("Incorrect token");
      return;
    }
    const {accessToken, refreshToken: newRefreshToken} = generateTokens(
      user?.toJSON(), {accessSecret, refreshSecret}
    );

    await RefreshTokenModel.findByIdAndUpdate(validToken.id, { token: newRefreshToken });
    res.status(200).json({accessToken, refreshToken: newRefreshToken, user: user?.toJSON()});        
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

export const signupController: RequestHandler = async (req, res) => {
  const { userData } = req.body;
  const accessSecret = process.env.JWT_ACCESS_SECRET || "";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "";

  if (userData && userData.email && userData.password) {
    try {
      const userExists = await UserModel.findOne({ email: userData.email });
      if (userExists?.toJSON()) {
        res.status(409).send("User already exists");
        return;
      }
      const hash = bcrypt.hashSync(userData.password, 8);
      delete userData.password;

      const user = await UserModel.create({
        ...userData,
        hash,
      });

      const {accessToken, refreshToken} = generateTokens(user.toJSON(), {accessSecret, refreshSecret});

      await RefreshTokenModel.create({
        token: refreshToken,
      });

      res.json({
        accessToken,
        refreshToken,
        user: user.toJSON(),
      });

    } catch (error) {
      console.error(error);
      res.status(500).send(error?.message || "Something went wrong");
    }    
  } else {
    res.status(400).send("Invalid data");
  }
};