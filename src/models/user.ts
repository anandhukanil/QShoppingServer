import { model } from "mongoose";
import userSchema from "../schemas/userSchema";
import { Models } from "../types";


const UserModel = model(Models.User, userSchema);

export default UserModel;