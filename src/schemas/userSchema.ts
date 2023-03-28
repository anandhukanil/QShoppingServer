import { Schema } from "mongoose";
import { IUserData } from "../types";
import addressSchema from "./addressSchema";

const userSchema = new Schema<IUserData>({
  email: { type: String, required: true, immutable: true },
  firstName: { type: String, required: true },
  hash: { type: String, required: true },
  id: String,
  lastName: String,
  age: Number,
  mobileNumber: Number,
  address: addressSchema,
}, {
  toJSON: {
    transform: (doc, converted) => {
      converted.id = converted._id?.toString();
      delete converted._id;
      delete converted.hash;
    }
  }
});

export default userSchema;