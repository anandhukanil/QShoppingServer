import { Schema } from "mongoose";
import { IRefreshToken } from "../types";


const refreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true },
  validity: String
});

export default refreshTokenSchema;