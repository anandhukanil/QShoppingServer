import { Router } from "express";
import authenticationMiddleware from "../middlewares/auth";
import authRouter from "./authRouter";
import productRouter from "./productRouter";
import userRouter from "./userRouter";

const router = Router();

router.get("/", (req, res) => res.send("Welcome!"));

router.use("/auth", authRouter);

router.use(authenticationMiddleware);

router.use("/users", userRouter);
router.use("/products", productRouter);

export default router;