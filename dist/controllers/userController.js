"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListItemController = exports.updateCartItemCountController = exports.checkoutOrderController = exports.removeFromCartController = exports.addToCartController = exports.getUserController = exports.updateUserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const updateUserController = async (req, res) => {
    const { id: userId } = req.body;
    try {
        const response = await user_1.default.findByIdAndUpdate(userId, req.body, {
            new: true,
        });
        if (!response?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        res.json(response.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.updateUserController = updateUserController;
const getUserController = async (req, res) => {
    const { id: userId } = req.params;
    try {
        const response = await user_1.default.findById(userId);
        if (!response?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        res.json(response.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.getUserController = getUserController;
const addToCartController = async (req, res) => {
    const { id: userId, item } = req.body;
    try {
        const response = await user_1.default.findByIdAndUpdate(userId, { $push: { cartItems: item } }, {
            new: true,
        });
        if (!response?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        res.json(response.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.addToCartController = addToCartController;
const removeFromCartController = async (req, res) => {
    const { id: userId, itemId } = req.body;
    try {
        const response = await user_1.default.findByIdAndUpdate(userId, { $pull: { cartItems: { item: { $elemMatch: { id: itemId } } } } }, {
            new: true,
        });
        if (!response?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        res.json(response.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.removeFromCartController = removeFromCartController;
const checkoutOrderController = async (req, res) => {
    const { id: userId, items } = req.body;
    try {
        const response = await user_1.default.findByIdAndUpdate(userId, { $push: { orders: { items, ordered: new Date().toISOString() } },
            $set: { cartItems: [] }
        }, {
            new: true,
        });
        if (!response?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        res.json(response.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.checkoutOrderController = checkoutOrderController;
const updateCartItemCountController = async (req, res) => {
    const { id: userId, itemId, count } = req.body;
    try {
        const data = await user_1.default.findById(userId);
        if (!data?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        const updatedCart = data?.toJSON().cartItems?.map((cart) => (cart.item.id === itemId ? { ...cart, count: cart.count + count } : cart));
        const response = await user_1.default.findByIdAndUpdate(userId, { cartItems: updatedCart }, { new: true });
        res.json(response?.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.updateCartItemCountController = updateCartItemCountController;
const wishListItemController = async (req, res) => {
    const { id: userId, item, action } = req.body;
    try {
        const data = await user_1.default.findById(userId);
        if (!data?.toJSON()) {
            res.status(404).send("User not found.");
            return;
        }
        let response;
        if (action === "remove") {
            response = await user_1.default.findByIdAndUpdate(userId, { $pullAll: {
                    wishlistItems: [item],
                } }, { new: true });
        }
        else {
            response = await user_1.default.findByIdAndUpdate(userId, { $push: { wishlistItems: item } }, { new: true });
        }
        res.json(response?.toJSON());
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
};
exports.wishListItemController = wishListItemController;
