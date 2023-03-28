import { Router } from "express";
import {
  getAllProductsController, getProductController, searchProductsController,
} from "../controllers/productController";

const router = Router();

router.get("/search", searchProductsController);
router.get("/:id", getProductController);
router.get("/", getAllProductsController);


export default router;