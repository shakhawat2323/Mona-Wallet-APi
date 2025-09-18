"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_model_1 = require("../transaction/transaction.model");
const wallet_model_1 = require("../wallet/wallet.model");
const agent_model_1 = require("./agent.model");
const cashIn = async (agentEmail, userEmail, amount) => {
    // Agent wallet খুঁজো email দিয়ে
    const agentWallet = await wallet_model_1.Wallet.findOne({ email: agentEmail });
    if (!agentWallet)
        throw new AppError_1.default(404, "Agent wallet not found");
    if (agentWallet.balance < amount)
        throw new AppError_1.default(400, "Insufficient balance");
    // User wallet খুঁজো email দিয়ে
    const userWallet = await wallet_model_1.Wallet.findOne({ email: userEmail });
    if (!userWallet)
        throw new AppError_1.default(404, "User wallet not found");
    // Transaction Process
    agentWallet.balance -= amount;
    userWallet.balance += amount;
    await agentWallet.save();
    await userWallet.save();
    // Commission (Agent earn)
    const commission = amount * 0.01;
    await agent_model_1.Agent.findOneAndUpdate({ wallet: agentWallet._id }, { $inc: { commissionBalance: commission } });
    // Transaction Log
    return await transaction_model_1.Transaction.create({
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
const cashOut = async (agentEmail, userEmail, amount) => {
    const userWallet = await wallet_model_1.Wallet.findOne({ email: userEmail });
    if (!userWallet)
        throw new AppError_1.default(404, "User wallet not found");
    if (userWallet.balance < amount)
        throw new AppError_1.default(400, "Insufficient balance");
    const agentWallet = await wallet_model_1.Wallet.findOne({ email: agentEmail });
    if (!agentWallet)
        throw new AppError_1.default(404, "Agent wallet not found");
    // Transaction process
    userWallet.balance -= amount;
    agentWallet.balance += amount;
    await userWallet.save();
    await agentWallet.save();
    // Commission (Agent earn)
    const commission = amount * 0.015;
    await agent_model_1.Agent.findOneAndUpdate({ wallet: agentWallet._id }, { $inc: { commissionBalance: commission } });
    return await transaction_model_1.Transaction.create({
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
exports.AgentServices = {
    cashIn,
    cashOut,
};
