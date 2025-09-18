import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { IsActive, Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const decoded = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: decoded.email }).populate(
        "wallets"
      );

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (!authRoles.includes(decoded.role)) {
        throw new AppError(403, `You are not authorized as ${decoded.role}`);
      }

      // Wallet block check শুধুমাত্র AGENT/USER এর জন্য
      if (decoded.role === Role.AGENT || decoded.role === Role.USER) {
        const blockedWallet = await Wallet.findOne({
          user: isUserExist._id,
          status: "BLOCKED",
        });

        if (blockedWallet) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "Your wallet is BLOCKED, no transactions allowed"
          );
        }
      }

      let walletId: string | undefined;
      let walletEmail: string | undefined;

      if (decoded.role === Role.AGENT || decoded.role === Role.USER) {
        if (!isUserExist.wallets || isUserExist.wallets.length === 0) {
          throw new Error("User has no wallet");
        }

        const wallet = await Wallet.findById(isUserExist.wallets[0]._id);
        if (!wallet) throw new Error("Wallet not found");

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
    } catch (error) {
      next(error);
    }
  };
