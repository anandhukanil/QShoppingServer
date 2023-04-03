import { Router } from "express";
import { 
  addToCartController, checkoutOrderController, getUserController,
  removeFromCartController, updateCartItemCountController, updateUserController, wishListItemController, 
} from "../controllers/userController";

const router = Router();

router.get("/:id", getUserController);
router.post("/update", updateUserController);
router.post("/add-to-cart", addToCartController);
router.post("/remove-from-cart", removeFromCartController);
router.post("/update-cart", updateCartItemCountController);
router.post("/wishlist", wishListItemController);
router.post("/checkout", checkoutOrderController);



export default router;