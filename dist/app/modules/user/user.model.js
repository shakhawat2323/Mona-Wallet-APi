"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, { _id: false, versionKey: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    // isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.AgentActive),
        default: user_interface_1.AgentActive.APPROVED,
    },
    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
        required: true,
    },
    auths: { type: [authProviderSchema] },
    wallets: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" }],
}, { timestamps: true, versionKey: false });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
