"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromGoogle = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (user, secrets, expiresIn = "20m") => {
    const accessToken = jsonwebtoken_1.default.sign({ username: user.email, id: user.id }, secrets.accessSecret, { expiresIn });
    const refreshToken = jsonwebtoken_1.default.sign({ username: user.email, id: user.id }, secrets.refreshSecret);
    return { refreshToken, accessToken };
};
exports.generateTokens = generateTokens;
const getDataFromGoogle = (data) => ({
    firstName: data.given_name,
    lastName: data.family_name,
    email: data.email,
});
exports.getDataFromGoogle = getDataFromGoogle;
