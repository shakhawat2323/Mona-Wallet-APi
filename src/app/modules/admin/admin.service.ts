/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

import User from "../user/user.model";

import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { AgentActive, IsActive, Role } from "../user/user.interface";

//  Get all users
const getUsers = async () => {
  const users = await User.find({});
  const total = await User.countDocuments();
  return {
    data: users,
    meta: { total },
  };
};

//  Get all agents (with user + wallet populated)
const getAgents = async () => {
  const agents = await User.find({ role: Role.AGENT });
  const total = await User.countDocuments({ role: Role.AGENT });

  return {
    data: agents,
    meta: { total },
  };
};

//  Get all wallets
const getWallets = async () => {
  const wallets = await Wallet.find({});
  const total = await Wallet.countDocuments();
  return {
    data: wallets,
    meta: { total },
  };
};

//  Get all transactions (sorted by latest first)
const getTransactions = async () => {
  const transactions = await Transaction.find({}).sort({ createdAt: -1 });
  const total = await Transaction.countDocuments();
  return {
    data: transactions,
    meta: { total },
  };
};

const blockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId).populate("user"); // user populate

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // wallet block
  wallet.status = "BLOCKED";
  wallet.isActive = false;
  await wallet.save();

  // wallet block
  wallet.status = "BLOCKED";
  wallet.isActive = false;
  await wallet.save();

  // user status block
  if (wallet.user) {
    const userId =
      typeof wallet.user === "object" ? (wallet.user as any)._id : wallet.user;
    await User.findByIdAndUpdate(userId, { status: "BLOCKED" });
  }

  return wallet;
};

// Unblock wallet
const unblockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId).populate("user");

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // wallet unblock
  wallet.status = "ACTIVE";
  wallet.isActive = true;
  await wallet.save();

  // user status approved
  if (wallet.user) {
    const userId =
      typeof wallet.user === "object" ? (wallet.user as any)._id : wallet.user;
    await User.findByIdAndUpdate(userId, { status: "APPROVED" });
  }

  return wallet;
};

// Approve Agent
const approveAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (agent.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  agent.status = AgentActive.APPROVED;
  agent.isActive = IsActive.ACTIVE; // agent active
  await agent.save();

  return agent;
};

// Suspend Agent
const suspendAgent = async (agentId: string) => {
  const agent = await User.findById(agentId);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }
  if (agent.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  agent.status = AgentActive.SUSPENDED;
  agent.isActive = IsActive.BLOCKED; // agent inactive
  await agent.save();

  return agent;
};

const getBlockedWallets = async () => {
  const wallets = await Wallet.find({ status: "BLOCKED" });
  const total = await Wallet.countDocuments({ status: "BLOCKED" });

  return {
    data: wallets,
    meta: { total },
  };
};

const getSuspendedAgents = async () => {
  const agents = await User.find({
    role: Role.AGENT,
    status: AgentActive.SUSPENDED,
  });

  const total = await User.countDocuments({
    role: Role.AGENT,
    status: AgentActive.SUSPENDED,
  });

  return {
    data: agents,
    meta: { total },
  };
};
export const AdminServices = {
  getUsers,
  getAgents,
  getWallets,
  getTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
  getBlockedWallets, // ✅ এখন কাজ করবে
  getSuspendedAgents, // ✅ এখন কাজ করবে
};
