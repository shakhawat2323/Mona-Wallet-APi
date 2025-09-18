"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = exports.createUserWithWallet = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const userToken_1 = require("../../utils/userToken");
const wallet_model_1 = require("../wallet/wallet.model");
const credentialsLogin = async (Payload) => {
    const { email, password } = Payload;
    const isUserExist = await user_model_1.default.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email dose Not exist");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    const ispasswordMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
    if (!ispasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password");
    }
    const userToken = (0, userToken_1.createUserTokens)(isUserExist);
    // delete isUserExist.password;
    const { password: pass, ...rest } = isUserExist.toObject();
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest,
    };
};
const getNewaccesToken = async (refreshToken) => {
    const newAccessToken = await (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
};
const resetPassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.default.findById(decodedToken._id);
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User does not exist");
    }
    // পুরানো পাসওয়ার্ড match করানো
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not match");
    }
    // নতুন পাসওয়ার্ড hash করা
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    await user.save();
    return { _id: user._id, email: user.email };
};
const createUserWithWallet = async (userData) => {
    // 1. User create
    const user = await user_model_1.default.create(userData);
    // 2. Wallet create
    const wallet = await wallet_model_1.Wallet.create({
        user: user._id,
        balance: 50,
        currency: "BDT",
        type: "PERSONAL",
        status: "ACTIVE",
        email: user.email,
        isActive: true,
    });
    if (!user.wallets) {
        user.wallets = [];
    }
    user.wallets.push(wallet._id);
    await user.save();
    return user;
};
exports.createUserWithWallet = createUserWithWallet;
const setPassword = async (userId, plainPassword) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.password &&
        user.auths.some((providerObject) => providerObject.provider === "google")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update");
    }
    const hashedPassword = await bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    await user.save();
};
exports.AuthServices = {
    credentialsLogin,
    getNewaccesToken,
    resetPassword,
    setPassword,
};
