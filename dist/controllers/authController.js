"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = exports.refreshTokenController = exports.logoutController = exports.loginWithGoogleController = exports.loginController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const token_1 = __importDefault(require("../models/token"));
const helpers_1 = require("../functions/helpers");
const loginController = async (req, res) => {
    const { username, password } = req.body;
    const accessSecret = process.env.JWT_ACCESS_SECRET || "";
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "";
    if (username && password) {
        try {
            const user = await user_1.default.findOne({ email: username });
            if (!user?.email) {
                res.status(404).send("User not found");
                return;
            }
            else if (!user?.hash) {
                res.status(404).send("Please login with google");
                return;
            }
            const passwordIsValid = bcryptjs_1.default.compareSync(password, user.hash);
            if (!passwordIsValid) {
                res.status(400).send("Username or password is incorrect");
                return;
            }
            const { accessToken, refreshToken } = (0, helpers_1.generateTokens)(user.toJSON(), { accessSecret, refreshSecret });
            await token_1.default.create({
                token: refreshToken,
            });
            res.json({
                accessToken,
                refreshToken,
                user: user.toJSON()
            });
        }
        catch (error) {
            res.status(500).send("Something went wrong");
        }
    }
    else {
        res.status(400).send("Username or password is incorrect");
    }
};
exports.loginController = loginController;
const loginWithGoogleController = async (req, res) => {
    const { credential } = req.body;
    const accessSecret = process.env.JWT_ACCESS_SECRET || "";
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "";
    const clientId = process.env.OAuthClientID || "";
    if (credential) {
        try {
            const client = new google_auth_library_1.OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: clientId,
            });
            const payload = ticket.getPayload();
            const userData = (0, helpers_1.getDataFromGoogle)(payload);
            let user = await user_1.default.findOne({ email: userData?.email });
            if (!user?.toJSON()?.email) {
                user = await user_1.default.create({
                    ...userData,
                });
            }
            const { accessToken, refreshToken } = (0, helpers_1.generateTokens)(user?.toJSON(), { accessSecret, refreshSecret });
            await token_1.default.create({
                token: refreshToken,
            });
            res.json({
                accessToken,
                refreshToken,
                user: user?.toJSON()
            });
        }
        catch (error) {
            res.status(500).send("Something went wrong");
        }
    }
    else {
        res.status(400).send("Credentials not found");
    }
};
exports.loginWithGoogleController = loginWithGoogleController;
const logoutController = async (req, res) => {
    const { user, token } = req.body;
    if (user && user.email) {
        try {
            await token_1.default.findOneAndDelete({ token });
        }
        catch (err) {
            console.error("Token not found");
        }
        res.send("success");
    }
    else {
        res.status(400).send("User data not found.");
    }
};
exports.logoutController = logoutController;
const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.body;
    const accessSecret = process.env.JWT_ACCESS_SECRET || "";
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "";
    if (!refreshToken) {
        res.status(401).send("Invalid request");
        return;
    }
    try {
        const validToken = await token_1.default.findOne({ token: refreshToken });
        if (!validToken?.token) {
            res.status(401).send("Invalid token");
            return;
        }
        const decrypted = await jsonwebtoken_1.default.verify(validToken.token, refreshSecret);
        const user = await user_1.default.findOne({ email: decrypted.username });
        if (!user?.email) {
            res.status(403).send("Incorrect token");
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, helpers_1.generateTokens)(user?.toJSON(), { accessSecret, refreshSecret });
        await token_1.default.findByIdAndUpdate(validToken.id, { token: newRefreshToken });
        res.status(200).json({ accessToken, refreshToken: newRefreshToken, user: user?.toJSON() });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
};
exports.refreshTokenController = refreshTokenController;
const signupController = async (req, res) => {
    const { userData } = req.body;
    const accessSecret = process.env.JWT_ACCESS_SECRET || "";
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "";
    if (userData && userData.email && userData.password) {
        try {
            const userExists = await user_1.default.findOne({ email: userData.email });
            if (userExists?.toJSON()) {
                res.status(409).send("User already exists");
                return;
            }
            const hash = bcryptjs_1.default.hashSync(userData.password, 8);
            delete userData.password;
            delete userData.id;
            const user = await user_1.default.create({
                ...userData,
                hash,
            });
            const { accessToken, refreshToken } = (0, helpers_1.generateTokens)(user.toJSON(), { accessSecret, refreshSecret });
            await token_1.default.create({
                token: refreshToken,
            });
            res.json({
                accessToken,
                refreshToken,
                user: user.toJSON(),
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error?.message || "Something went wrong");
        }
    }
    else {
        res.status(400).send("Invalid data");
    }
};
exports.signupController = signupController;
