"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
// Wallet Schema
const walletSchema = new mongoose_1.Schema({
    user: { type: String },
    balance: { type: Number, default: 50 },
    currency: {
        type: String,
        enum: Object.values(wallet_interface_1.Currency),
        required: true,
        default: wallet_interface_1.Currency.BDT,
    },
    email: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletType),
        default: wallet_interface_1.WalletType.PERSONAL,
    },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.Status),
        default: wallet_interface_1.Status.ACTIVE,
    },
    isActive: { type: Boolean, default: true },
}, { versionKey: false });
// Wallet Model
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
