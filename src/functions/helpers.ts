import { IUser } from "../types";
import jwt from "jsonwebtoken";
import { TokenPayload } from "google-auth-library";

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

export const getDataFromGoogle = (data: TokenPayload): Omit<IUser, "id"> => ({
  firstName: data.given_name as string,
  lastName: data.family_name as string,
  email: data.email as string,
});

interface ITokenResponse {
  refreshToken: string;
  accessToken: string;
}
interface ISecrets {
  accessSecret: string;
  refreshSecret: string;
}