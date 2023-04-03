"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    validity: String
});
exports.default = refreshTokenSchema;
