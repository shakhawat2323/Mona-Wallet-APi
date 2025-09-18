"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const createUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = await user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const UpdateUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken._id);
    if (!result.data) {
        res.status(http_status_codes_1.default.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your profile retrieved successfully",
        data: result.data,
    });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
const updateUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const { name, phone } = req.body;
    const existingUser = await user_model_1.default.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    existingUser.name = name || existingUser.name;
    existingUser.phone = phone || existingUser.phone;
    await existingUser.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User profile updated successfully",
        data: existingUser,
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    UpdateUser,
    getMe,
    getMyOverview,
    updateUserProfile,
};
