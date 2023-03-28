import { IUser } from "../types";
import jwt from "jsonwebtoken";

export const generateTokens = (user: IUser, secrets: ISecrets, expiresIn = "20m"):ITokenResponse  => {
  const accessToken = jwt.sign(
    { username: user.email, id: user.id },
    secrets.accessSecret,
    { expiresIn }
  );

  const refreshToken = jwt.sign(
    { username: user.email, id: user.id },
    secrets.refreshSecret,
  );

  return {refreshToken, accessToken};
};

interface ITokenResponse {
  refreshToken: string;
  accessToken: string;
}
interface ISecrets {
  accessSecret: string;
  refreshSecret: string;
}