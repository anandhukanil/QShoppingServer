import { model } from "mongoose";
import refreshTokenSchema from "../schemas/tokenSchema";
import { Models } from "../types";


const RefreshTokenModel = model(Models.RefreshToken, refreshTokenSchema);

export default RefreshTokenModel;