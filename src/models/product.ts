import { model } from "mongoose";
import productSchema from "../schemas/productSchema";
import { Models } from "../types";


const ProductModel = model(Models.Product, productSchema);

export default ProductModel;