"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = __importDefault(require("../user/user.model"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createWallet = async (payload) => {
    const { userId, balance, currency, type, isActive } = payload;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid userId");
    }
    const isWalletExist = await wallet_model_1.Wallet.findOne({ user: userId });
    if (isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet already exists for this user");
    }
    const wallet = await wallet_model_1.Wallet.create({
        user: userId,
        balance: balance ?? 50,
        currency: currency ?? "BDT",
        type: type ?? "personal",
        status: "ACTIVE",
        isActive: isActive ?? true,
    });
    return wallet;
};
const getMyWallet = async (userId) => {
    const wallet = await wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
};
// ✅ Deposit money
const depositMoney = async (email, amount) => {
    const wallet = await wallet_model_1.Wallet.findOne({ email });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found with this email");
    }
    wallet.balance += amount;
    await wallet.save();
    const transaction = await transaction_model_1.Transaction.create({
        senderWalletId: wallet._id,
        receiverWalletId: wallet._id,
        amount,
        email: wallet.email,
        type: "DEPOSIT",
        status: "COMPLETED",
    });
    return { wallet, transaction };
};
// ✅ Withdraw money
const withdrawMoney = async (email, amount) => {
    const wallet = await wallet_model_1.Wallet.findOne({ email });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found with this email");
    }
    if (wallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    wallet.balance -= amount;
    await wallet.save();
    const transaction = await transaction_model_1.Transaction.create({
        senderWalletId: wallet._id,
        receiverWalletId: wallet._id,
        amount,
        type: "WITHDRAW",
        status: "COMPLETED",
    });
    return { wallet, transaction };
};
// ✅ Send money
const sendMoney = async (senderEmail, receiverEmail, amount) => {
    const senderWallet = await wallet_model_1.Wallet.findOne({ email: senderEmail });
    const receiverWallet = await wallet_model_1.Wallet.findOne({ email: receiverEmail });
    if (!senderWallet)
        throw new AppError_1.default(404, "Sender wallet not found");
    if (!receiverWallet)
        throw new AppError_1.default(404, "Receiver wallet not found");
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(400, "Insufficient balance");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    await senderWallet.save();
    await receiverWallet.save();
    const transaction = await transaction_model_1.Transaction.create({
        senderWalletId: senderWallet._id,
        receiverWalletId: receiverWallet._id,
        amount,
        type: "TRANSFER",
        status: "COMPLETED",
    });
    return { senderWallet, receiverWallet, transaction };
};
const getUserFullData = async (userId) => {
    const userData = await user_model_1.default.findById(userId)
        .populate({
        path: "wallets",
        populate: {
            path: "_id", // wallet populate
        },
    })
        .lean();
    if (!userData)
        throw new Error("User not found");
    // Wallet এর transactions নিয়ে আসা
    const wallets = await wallet_model_1.Wallet.find({ user: userId }).lean();
    const walletIds = wallets.map((w) => w._id);
    const transactions = await transaction_model_1.Transaction.find({
        $or: [
            { senderWalletId: { $in: walletIds } },
            { receiverWalletId: { $in: walletIds } },
        ],
    })
        .sort({ createdAt: -1 })
        .lean();
    return {
        user: userData,
        wallets,
        transactions,
    };
};
exports.WalletServices = {
    createWallet,
    getMyWallet,
    depositMoney,
    withdrawMoney,
    sendMoney,
    getUserFullData,
};
