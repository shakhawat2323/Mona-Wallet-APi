"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletControllers = void 0;
const wallet_service_1 = require("./wallet.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const wallet_model_1 = require("./wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
// Create Wallet
const createWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const wallet = await wallet_service_1.WalletServices.createWallet(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Wallet created successfully",
        data: wallet,
    });
});
// Get My Wallet
const getMyWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const wallet = await wallet_service_1.WalletServices.getMyWallet(req.user._id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Wallet fetched successfully",
        data: wallet,
    });
});
// Deposit
const depositMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, amount } = req.body;
    const wallet = await wallet_service_1.WalletServices.depositMoney(email, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Deposit successful",
        data: {
            wallet: {
                email: wallet.wallet.email,
                balance: wallet.wallet.balance,
            },
            transaction: {
                id: wallet.transaction._id,
                type: wallet.transaction.type,
                status: wallet.transaction.status,
                amount: wallet.transaction.amount,
            },
        },
    });
});
// Withdraw
const withdrawMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, amount } = req.body;
    const wallet = await wallet_service_1.WalletServices.withdrawMoney(email, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Withdraw successful",
        data: wallet,
    });
});
// Send Money
const sendMoney = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const senderEmail = req.user?.walletEmail;
    const { receiverEmail, amount } = req.body;
    const result = await wallet_service_1.WalletServices.sendMoney(senderEmail, receiverEmail, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Money sent successfully",
        data: result,
    });
});
const getMyOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const user = await user_model_1.default.findById(userId).lean();
    if (!user)
        throw new AppError_1.default(404, "User not found");
    const wallets = await wallet_model_1.Wallet.find({ user: userId }).lean();
    const walletIds = wallets.map((w) => w._id);
    const transactions = await transaction_model_1.Transaction.find({
        $or: [
            { senderWalletId: { $in: walletIds } },
            { receiverWalletId: { $in: walletIds } },
        ],
    })
        .populate("senderWalletId", "user balance")
        .populate("receiverWalletId", "user balance")
        .sort({ createdAt: -1 })
        .lean();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User overview fetched successfully",
        data: {
            user,
            wallets,
            transactions,
        },
    });
});
exports.WalletControllers = {
    createWallet,
    getMyWallet,
    depositMoney,
    withdrawMoney,
    sendMoney,
    getMyOverview,
};
