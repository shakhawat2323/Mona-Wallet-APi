import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";
import { Transaction } from "../transaction/transaction.model";
import User from "../user/user.model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createWallet = async (payload: any) => {
  const { userId, balance, currency, type, isActive } = payload;

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid userId");
  }

  const isWalletExist = await Wallet.findOne({ user: userId });
  if (isWalletExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet already exists for this user"
    );
  }

  const wallet = await Wallet.create({
    user: userId as string,
    balance: balance ?? 50,
    currency: currency ?? "BDT",
    type: type ?? "personal",
    status: "ACTIVE",
    isActive: isActive ?? true,
  });

  return wallet;
};

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

// ✅ Deposit money

const depositMoney = async (email: string, amount: number) => {
  const wallet = await Wallet.findOne({ email });

  if (!wallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Wallet not found with this email"
    );
  }

  wallet.balance += amount;
  await wallet.save();

  const transaction = await Transaction.create({
    senderWalletId: wallet._id,
    receiverWalletId: wallet._id,
    amount,
    email: wallet.email,
    type: "DEPOSIT",
    status: "COMPLETED",
  });

  return { wallet, transaction };
};

// ✅ Withdraw money

const withdrawMoney = async (email: string, amount: number) => {
  const wallet = await Wallet.findOne({ email });

  if (!wallet) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Wallet not found with this email"
    );
  }

  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  const transaction = await Transaction.create({
    senderWalletId: wallet._id,
    receiverWalletId: wallet._id,
    amount,
    type: "WITHDRAW",
    status: "COMPLETED",
  });

  return { wallet, transaction };
};

// ✅ Send money

const sendMoney = async (
  senderEmail: string,
  receiverEmail: string,
  amount: number
) => {
  const senderWallet = await Wallet.findOne({ email: senderEmail });
  const receiverWallet = await Wallet.findOne({ email: receiverEmail });

  if (!senderWallet) throw new AppError(404, "Sender wallet not found");
  if (!receiverWallet) throw new AppError(404, "Receiver wallet not found");

  if (senderWallet.balance < amount) {
    throw new AppError(400, "Insufficient balance");
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  const transaction = await Transaction.create({
    senderWalletId: senderWallet._id,
    receiverWalletId: receiverWallet._id,
    amount,
    type: "TRANSFER",
    status: "COMPLETED",
  });

  return { senderWallet, receiverWallet, transaction };
};

const getUserFullData = async (userId: string) => {
  const userData = await User.findById(userId)
    .populate({
      path: "wallets",
      populate: {
        path: "_id", // wallet populate
      },
    })
    .lean();

  if (!userData) throw new Error("User not found");

  // Wallet এর transactions নিয়ে আসা
  const wallets = await Wallet.find({ user: userId }).lean();
  const walletIds = wallets.map((w) => w._id);

  const transactions = await Transaction.find({
    $or: [
      { senderWalletId: { $in: walletIds } },
      { receiverWalletId: { $in: walletIds } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    user: userData,
    wallets,
    transactions,
  };
};

export const WalletServices = {
  createWallet,
  getMyWallet,
  depositMoney,
  withdrawMoney,
  sendMoney,
  getUserFullData,
};
