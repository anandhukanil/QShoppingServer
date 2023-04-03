"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    thumbnail: { type: String, required: true },
});
productSchema.index({ title: "text", brand: "text", category: "text", description: "text" });
exports.default = productSchema;
