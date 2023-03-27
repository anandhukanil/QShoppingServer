import { Schema } from "mongoose";
import { IUser } from "../types";
import addressSchema from "./addressSchema";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
  age: Number,
  mobileNumber: Number,
  address: addressSchema,
});

export default userSchema;