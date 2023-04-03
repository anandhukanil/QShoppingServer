import { Schema } from "mongoose";
import { IUserData } from "../types";
import addressSchema from "./addressSchema";
import productSchema from "./productSchema";

const userSchema = new Schema<IUserData>({
  email: { type: String, required: true, immutable: true },
  firstName: { type: String, required: true },
  hash: { type: String },
  id: String,
  lastName: String,
  age: Number,
  mobileNumber: Number,
  address: addressSchema,
  cartItems: [{
    item: { type: productSchema, required: true },
    count: { type: Number, required: true }
  }],
  orders: [{
    items: [{
      item: { type: productSchema, required: true },
      count: { type: Number, required: true }
    }],
    ordered: { type: Date, require: true }
  }],
  wishlistItems: [productSchema]
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