import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user";
import bcrypt from "bcryptjs";
import  { OAuth2Client, TokenPayload } from "google-auth-library";
import RefreshTokenModel from "../models/token";
import { generateTokens, getDataFromGoogle } from "../functions/helpers";
import { IUser } from "../types";

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
      } else if (!user?.hash) {
        res.status(404).send("Please login with google");
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

export const loginWithGoogleController: RequestHandler = async (req, res) => {
  const { credential } = req.body;
  const accessSecret = process.env.JWT_ACCESS_SECRET || "";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "";
  const clientId = process.env.OAuthClientID || "";

  if (credential) {
    try {
      const client = new OAuth2Client(clientId);
     
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId, 
      });
      const payload = ticket.getPayload();
      const userData = getDataFromGoogle(payload as TokenPayload);

      let user = await UserModel.findOne({ email: userData?.email });
      if (!user?.toJSON()?.email) {
        user = await UserModel.create({
          ...userData,
        });
      }

      const {accessToken, refreshToken} = generateTokens(
        user?.toJSON() as IUser, {accessSecret, refreshSecret}
      );

      await RefreshTokenModel.create({
        token: refreshToken,
      });

      res.json({
        accessToken,
        refreshToken,
        user: user?.toJSON()
      });

    } catch (error) {
      res.status(500).send("Something went wrong");
    }    
  } else {
    res.status(400).send("Credentials not found");
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
      const securityAnswerHash = bcrypt.hashSync(userData.securityAnswer, 8);
      delete userData.password;
      delete userData.id;

      const user = await UserModel.create({
        ...userData,
        securityAnswer: securityAnswerHash,
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

export const resetController: RequestHandler = async (req, res) => {
  const { username, securityQuestion, securityAnswer, password } = req.body;

  if (username && password && securityAnswer && securityQuestion) {
    try {
      const user = await UserModel.findOne({ email: username });
      if (!user?.email) {
        res.status(404).send("User not found");
        return;
      } else if (!user?.hash) {
        res.status(404).send("Please login with google");
        return;
      }
      const answerIsValid = bcrypt.compareSync(securityAnswer, user.securityAnswer as string);

      if (!((user.securityQuestion === securityQuestion) && answerIsValid)) {
        res.status(400).send("Security question or answer is not correct");
        return;
      }

      const hash = bcrypt.hashSync(password, 8);

      await UserModel.findByIdAndUpdate(user?.toJSON().id, {
        hash,
      });

      res.send({ success: true });

    } catch (error) {
      res.status(500).send("Something went wrong");
    }    
  } else {
    res.status(400).send("Username or security question is incorrect");
  }
};