/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import User from "../user/user.model";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";

// Create Wallet
const createWallet = catchAsync(async (req: Request, res: Response) => {
  const wallet = await WalletServices.createWallet(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Wallet created successfully",
    data: wallet,
  });
});
// Get My Wallet
const getMyWallet = catchAsync(async (req: any, res: Response) => {
  const wallet = await WalletServices.getMyWallet(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet fetched successfully",
    data: wallet,
  });
});

// Deposit
const depositMoney = catchAsync(async (req: Request, res: Response) => {
  const { email, amount } = req.body;

  const wallet = await WalletServices.depositMoney(email, amount);

  sendResponse(res, {
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
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { email, amount } = req.body;
  const wallet = await WalletServices.withdrawMoney(email, amount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Withdraw successful",
    data: wallet,
  });
});
// Send Money

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const senderEmail = req.user?.walletEmail;
  const { receiverEmail, amount } = req.body;

  const result = await WalletServices.sendMoney(
    senderEmail as string,
    receiverEmail,
    amount
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Money sent successfully",
    data: result,
  });
});
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

export const WalletControllers = {
  createWallet,
  getMyWallet,
  depositMoney,
  withdrawMoney,
  sendMoney,
  getMyOverview,
};
