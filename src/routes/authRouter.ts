import { Router } from "express";
import {
  loginController, loginWithGoogleController, logoutController, refreshTokenController, signupController,
} from "../controllers/authController";
import authenticationMiddleware from "../middlewares/auth";

const router = Router();

router.post("/login", loginController);
router.post("/google-login", loginWithGoogleController);
router.post("/signup", signupController);
router.post("/refresh", refreshTokenController);
router.use(authenticationMiddleware);
router.post("/logout", logoutController);

export default router;