/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices, createUserWithWallet } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setcookies";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { Wallet } from "../wallet/wallet.model";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);

const getNewaccesToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refreshtoken reseive from cookies"
      );
    }
    const tokeninfo = await AuthServices.getNewaccesToken(
      refreshToken as string
    );

    setAuthCookie(res, tokeninfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Retrived Successfully",
      data: tokeninfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user as JwtPayload; // middleware থেকে আসবে

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    console.log(redirectTo);
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    let user = req.user as IUser;
    console.log(user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    if (!user.wallets || user.wallets.length === 0) {
      user = await createUserWithWallet(user);
    }

    const tokenInfo = createUserTokens(user);
    console.log(tokenInfo);
    setAuthCookie(res, tokenInfo);
    console.log(tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewaccesToken,
  logout,
  resetPassword,
  googleCallbackController,
  setPassword,
};
