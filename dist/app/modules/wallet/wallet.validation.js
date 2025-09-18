"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoneySchema = exports.withdrawSchema = exports.depositSchema = exports.createWalletSchema = void 0;
const zod_1 = require("zod");
const wallet_interface_1 = require("./wallet.interface");
// Create Wallet Validation
exports.createWalletSchema = zod_1.z.object({
    balance: zod_1.z.number().min(0, "Balance must be minimum 0").default(50),
    currency: zod_1.z.enum(Object.values(wallet_interface_1.Currency)).default(wallet_interface_1.Currency.BDT),
    type: zod_1.z
        .enum(Object.values(wallet_interface_1.WalletType))
        .default(wallet_interface_1.WalletType.PERSONAL),
    isActive: zod_1.z.boolean().default(true),
});
// Deposit Validation
exports.depositSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    amount: zod_1.z.number().positive("Deposit amount must be greater than 0"),
});
// Withdraw Validation
exports.withdrawSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    amount: zod_1.z.number().positive("Withdraw amount must be greater than 0"),
});
exports.sendMoneySchema = zod_1.z.object({
    receiverEmail: zod_1.z.email("Receiver email must be a valid email address"),
    amount: zod_1.z
        .number()
        .positive("Amount must be a positive number")
        .min(10, "Minimum transfer amount is 10 BDT"),
});
