/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import User from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const UpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await UserServices.getMe(decodedToken._id);

    if (!result.data) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your profile retrieved successfully",
      data: result.data,
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMyOverview = catchAsync(async (req: any, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId).lean();
  if (!user) throw new AppError(404, "User not found");

  const wallets = await Wallet.find({ user: userId }).lean();
  const walletIds = wallets.map((w) => w._id);

  const transactions = await Transaction.find({
    $or: [
      { senderWalletId: { $in: walletIds } },
      { receiverWalletId: { $in: walletIds } },
    ],
  })
    .populate("senderWalletId", "user balance")
    .populate("receiverWalletId", "user balance")
    .sort({ createdAt: -1 })
    .lean();

  sendResponse(res, {
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

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { name, phone } = req.body;

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  existingUser.name = name || existingUser.name;
  existingUser.phone = phone || existingUser.phone;

  await existingUser.save();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: existingUser,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  UpdateUser,
  getMe,
  getMyOverview,
  updateUserProfile,
};
