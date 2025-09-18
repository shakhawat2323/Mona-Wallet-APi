"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setcookies_1 = require("../../utils/setcookies");
const env_1 = require("../../config/env");
const userToken_1 = require("../../utils/userToken");
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const loginInfo = await auth_service_1.AuthServices.credentialsLogin(req.body);
    (0, setcookies_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    });
});
const getNewaccesToken = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refreshtoken reseive from cookies");
    }
    const tokeninfo = await auth_service_1.AuthServices.getNewaccesToken(refreshToken);
    (0, setcookies_1.setAuthCookie)(res, tokeninfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokeninfo,
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user; // middleware থেকে আসবে
    await auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
const googleCallbackController = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let redirectTo = req.query.state ? req.query.state : "";
    console.log(redirectTo);
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    let user = req.user;
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (!user.wallets || user.wallets.length === 0) {
        user = await (0, auth_service_1.createUserWithWallet)(user);
    }
    const tokenInfo = (0, userToken_1.createUserTokens)(user);
    console.log(tokenInfo);
    (0, setcookies_1.setAuthCookie)(res, tokenInfo);
    console.log(tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
});
const setPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const { password } = req.body;
    await auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
exports.AuthControllers = {
    credentialsLogin,
    getNewaccesToken,
    logout,
    resetPassword,
    googleCallbackController,
    setPassword,
};
