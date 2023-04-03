"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.get("/search", productController_1.searchProductsController);
router.get("/:id", productController_1.getProductController);
router.get("/", productController_1.getAllProductsController);
exports.default = router;
