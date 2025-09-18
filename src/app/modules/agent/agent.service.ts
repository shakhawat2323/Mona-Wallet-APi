import AppError from "../../errorHelpers/AppError";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { Agent } from "./agent.model";

const cashIn = async (
  agentEmail: string,
  userEmail: string,
  amount: number
) => {
  // Agent wallet খুঁজো email দিয়ে
  const agentWallet = await Wallet.findOne({ email: agentEmail });
  if (!agentWallet) throw new AppError(404, "Agent wallet not found");

  if (agentWallet.balance < amount)
    throw new AppError(400, "Insufficient balance");

  // User wallet খুঁজো email দিয়ে
  const userWallet = await Wallet.findOne({ email: userEmail });
  if (!userWallet) throw new AppError(404, "User wallet not found");

  // Transaction Process
  agentWallet.balance -= amount;
  userWallet.balance += amount;

  await agentWallet.save();
  await userWallet.save();

  // Commission (Agent earn)
  const commission = amount * 0.01;
  await Agent.findOneAndUpdate(
    { wallet: agentWallet._id },
    { $inc: { commissionBalance: commission } }
  );

  // Transaction Log
  return await Transaction.create({
    senderWalletId: agentWallet._id,
    receiverWalletId: userWallet._id,
    type: "CASH_IN",
    amount,
    currency: "BDT",
    status: "COMPLETED",
    commission,
    description: `Cash-in by Agent (${agentEmail}) to User (${userEmail})`,
  });
};

const cashOut = async (
  agentEmail: string,
  userEmail: string,
  amount: number
) => {
  const userWallet = await Wallet.findOne({ email: userEmail });
  if (!userWallet) throw new AppError(404, "User wallet not found");

  if (userWallet.balance < amount)
    throw new AppError(400, "Insufficient balance");

  const agentWallet = await Wallet.findOne({ email: agentEmail });
  if (!agentWallet) throw new AppError(404, "Agent wallet not found");

  // Transaction process
  userWallet.balance -= amount;
  agentWallet.balance += amount;

  await userWallet.save();
  await agentWallet.save();

  // Commission (Agent earn)
  const commission = amount * 0.015;
  await Agent.findOneAndUpdate(
    { wallet: agentWallet._id },
    { $inc: { commissionBalance: commission } }
  );

  return await Transaction.create({
    senderWalletId: userWallet._id,
    receiverWalletId: agentWallet._id,
    type: "CASH_OUT",
    amount,
    currency: "BDT",
    status: "COMPLETED",
    commission,
    description: `Cash-out by User (${userEmail}) via Agent (${agentEmail})`,
  });
};

export const AgentServices = {
  cashIn,
  cashOut,
};
