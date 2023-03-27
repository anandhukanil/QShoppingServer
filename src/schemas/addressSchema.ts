import { Schema } from "mongoose";
import { IAddress } from "../types";


const addressSchema = new Schema<IAddress>({
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: Number, required: true },
  state: { type: String, required: true },
});

export default addressSchema;