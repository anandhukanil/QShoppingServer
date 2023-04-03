"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductsController = exports.getProductController = exports.getAllProductsController = void 0;
const product_1 = __importDefault(require("../models/product"));
const getAllProductsController = async (req, res) => {
    const { limit } = req.query;
    try {
        const data = await product_1.default.find().limit((limit && Number(limit)));
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
};
exports.getAllProductsController = getAllProductsController;
const getProductController = async (req, res) => {
    const { id: productId } = req.params;
    try {
        const data = await product_1.default.findOne({ id: productId });
        if (!data?.toJSON()) {
            res.sendStatus(404);
            return;
        }
        res.json(data.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
};
exports.getProductController = getProductController;
const searchProductsController = async (req, res) => {
    const { query } = req.query;
    try {
        const data = await product_1.default.find({ $text: { $search: query } });
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
};
exports.searchProductsController = searchProductsController;
