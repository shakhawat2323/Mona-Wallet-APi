"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Received");
        }
        const decoded = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = await user_model_1.default.findOne({ email: decoded.email }).populate("wallets");
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (!isUserExist.isVerified) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
        }
        if (!authRoles.includes(decoded.role)) {
            throw new AppError_1.default(403, `You are not authorized as ${decoded.role}`);
        }
        // Wallet block check শুধুমাত্র AGENT/USER এর জন্য
        if (decoded.role === user_interface_1.Role.AGENT || decoded.role === user_interface_1.Role.USER) {
            const blockedWallet = await wallet_model_1.Wallet.findOne({
                user: isUserExist._id,
                status: "BLOCKED",
            });
            if (blockedWallet) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Your wallet is BLOCKED, no transactions allowed");
            }
        }
        let walletId;
        let walletEmail;
        if (decoded.role === user_interface_1.Role.AGENT || decoded.role === user_interface_1.Role.USER) {
            if (!isUserExist.wallets || isUserExist.wallets.length === 0) {
                throw new Error("User has no wallet");
            }
            const wallet = await wallet_model_1.Wallet.findById(isUserExist.wallets[0]._id);
            if (!wallet)
                throw new Error("Wallet not found");
            walletId = wallet._id.toString();
            walletEmail = wallet.email;
        }
        // req.user-এ সব role এর data store করবো
        req.user = {
            _id: isUserExist._id,
            email: decoded.email,
            userId: isUserExist._id.toString(),
            role: decoded.role,
            walletId, // ADMIN এর ক্ষেত্রে undefined হবে
            walletEmail,
        };
        console.log(req.user, "req.user");
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuth = checkAuth;
