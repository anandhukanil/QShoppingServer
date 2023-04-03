"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema_1 = __importDefault(require("../schemas/productSchema"));
const types_1 = require("../types");
const ProductModel = (0, mongoose_1.model)(types_1.Models.Product, productSchema_1.default);
exports.default = ProductModel;
