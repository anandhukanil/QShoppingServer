"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema_1 = __importDefault(require("./addressSchema"));
const productSchema_1 = __importDefault(require("./productSchema"));
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, immutable: true },
    firstName: { type: String, required: true },
    hash: { type: String },
    id: String,
    lastName: String,
    age: Number,
    mobileNumber: Number,
    address: addressSchema_1.default,
    cartItems: [{
            item: { type: productSchema_1.default, required: true },
            count: { type: Number, required: true }
        }],
    orders: [{
            items: [{
                    item: { type: productSchema_1.default, required: true },
                    count: { type: Number, required: true }
                }],
            ordered: { type: Date, require: true }
        }],
    wishlistItems: [productSchema_1.default]
}, {
    toJSON: {
        transform: (doc, converted) => {
            converted.id = converted._id?.toString();
            delete converted._id;
            delete converted.hash;
        }
    }
});
exports.default = userSchema;
