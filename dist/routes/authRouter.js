"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/login", authController_1.loginController);
router.post("/google-login", authController_1.loginWithGoogleController);
router.post("/signup", authController_1.signupController);
router.post("/refresh", authController_1.refreshTokenController);
router.use(auth_1.default);
router.post("/logout", authController_1.logoutController);
exports.default = router;
