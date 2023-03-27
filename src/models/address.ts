import { model } from "mongoose";
import addressSchema from "../schemas/addressSchema";
import { Models } from "../types";


const AddressModel = model(Models.Address, addressSchema);

export default AddressModel;  