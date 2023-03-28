import { Router } from "express";
import { getUserController, updateUserController } from "../controllers/userController";

const router = Router();

router.get("/:id", getUserController);
router.post("/update", updateUserController);


export default router;