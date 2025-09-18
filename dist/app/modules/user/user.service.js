"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = __importDefault(require("./user.model"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../wallet/wallet.model");
const createUser = async (payload) => {
    const { email, password, role, ...rest } = payload;
    // Check if user already exists
    const isUserExist = await user_model_1.default.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // Auth provider info
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    // Create user
    const user = await user_model_1.default.create({
        email,
        password: hashedPassword,
        role: role || "USER",
        status: "APPROVED",
        auths: [authProvider],
        ...rest,
    });
    const walletType = user.role === user_interface_1.Role.AGENT ? "BUSINESS" : "PERSONAL";
    // Create wallet automatically with initial balance TK50
    const wallet = await wallet_model_1.Wallet.create({
        user: user._id,
        balance: 50,
        email: user.email,
        currency: "BDT",
        type: walletType,
        status: "ACTIVE",
        isActive: true,
    });
    // Link wallet to user
    user.wallets.push(wallet._id);
    await user.save();
    // return populated user (with wallet info)
    const populatedUser = await user_model_1.default.findById(user._id).populate("wallets");
    return populatedUser;
};
const getAllUsers = async () => {
    const users = await user_model_1.default.find({});
    const totalUsers = await user_model_1.default.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};
const updateUser = async (userId, payload, decodedToken) => {
    const existingUser = await user_model_1.default.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    //  Role change validation
    if (payload.role) {
        if (decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change roles");
        }
        if (payload.role === user_interface_1.Role.ADMIN && decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only ADMIN can assign ADMIN role");
        }
        //  If role changed to AGENT, update wallet type to BUSINESS
        if (payload.role === user_interface_1.Role.AGENT) {
            await wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { type: "BUSINESS" }, { new: true });
        }
        //  If role changed to USER, update wallet type to PERSONAL
        if (payload.role === user_interface_1.Role.USER) {
            await wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { type: "PERSONAL" }, { new: true });
        }
    }
    //  Password hashing
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
};
const getMe = async (userId) => {
    const user = await user_model_1.default.findById(userId)
        .select("-password -__v") // password hide করলাম
        .populate("wallets"); // wallets details আনলো
    return {
        data: user,
    };
};
const updateUserProfile = async (userId, payload) => {
    const existingUser = await user_model_1.default.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.name)
        existingUser.name = payload.name;
    if (payload.phone)
        existingUser.phone = payload.phone;
    await existingUser.save();
    return existingUser;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    updateUserProfile,
};
