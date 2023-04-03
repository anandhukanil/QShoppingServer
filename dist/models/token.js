"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema_1 = __importDefault(require("../schemas/tokenSchema"));
const types_1 = require("../types");
const RefreshTokenModel = (0, mongoose_1.model)(types_1.Models.RefreshToken, tokenSchema_1.default);
exports.default = RefreshTokenModel;
