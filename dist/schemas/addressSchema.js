"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: Number, required: true },
    state: { type: String, required: true },
});
exports.default = addressSchema;
