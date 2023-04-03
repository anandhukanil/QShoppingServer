"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressSchema_1 = __importDefault(require("../schemas/addressSchema"));
const types_1 = require("../types");
const AddressModel = (0, mongoose_1.model)(types_1.Models.Address, addressSchema_1.default);
exports.default = AddressModel;
