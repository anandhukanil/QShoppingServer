"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const authRouter_1 = __importDefault(require("./authRouter"));
const productRouter_1 = __importDefault(require("./productRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => res.send("Welcome!"));
router.use("/auth", authRouter_1.default);
router.use("/products", productRouter_1.default);
router.use(auth_1.default);
router.use("/users", userRouter_1.default);
exports.default = router;
