"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = __importDefault(require("../user/user.model"));
const wallet_model_1 = require("../wallet/wallet.model");
// const now = new Date();
// const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
// const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = async () => {
    // Date filters
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    // === User Counts ===
    const totalUsersPromise = user_model_1.default.countDocuments();
    const totalActiveUsersPromise = user_model_1.default.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInActiveUsersPromise = user_model_1.default.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.default.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUsersInLast7DaysPromise = user_model_1.default.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.default.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.default.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    // === Transaction Counts ===
    const totalTransactionsPromise = transaction_model_1.Transaction.countDocuments();
    const transactionVolumePromise = transaction_model_1.Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalVolume: { $sum: "$amount" },
            },
        },
    ]);
    // === Wallet Counts ===
    const totalWalletsPromise = wallet_model_1.Wallet.countDocuments();
    const blockedWalletsPromise = wallet_model_1.Wallet.countDocuments({ status: "BLOCKED" });
    const unblockedWalletsPromise = wallet_model_1.Wallet.countDocuments({ status: "ACTIVE" });
    // === Agents ===
    const approvedAgentsPromise = user_model_1.default.countDocuments({
        role: "AGENT",
        status: "APPROVED",
    });
    const suspendedAgentsPromise = user_model_1.default.countDocuments({
        role: "AGENT",
        status: "SUSPENDED",
    });
    // === Await All ===
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole, totalTransactions, transactionVolumeAgg, totalWallets, blockedWallets, unblockedWallets, approvedAgents, suspendedAgents,] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise,
        totalTransactionsPromise,
        transactionVolumePromise,
        totalWalletsPromise,
        blockedWalletsPromise,
        unblockedWalletsPromise,
        approvedAgentsPromise,
        suspendedAgentsPromise,
    ]);
    const transactionVolume = transactionVolumeAgg.length > 0 ? transactionVolumeAgg[0].totalVolume : 0;
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole,
        totalTransactions,
        transactionVolume,
        totalWallets,
        blockedWallets,
        unblockedWallets,
        approvedAgents,
        suspendedAgents,
    };
};
const getUserOverview = async (userId) => {
    // 1) ইউজার বের করো
    const user = await user_model_1.default.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    // 2) ইউজারের wallets বের করো
    const wallets = await wallet_model_1.Wallet.find({ user: userId });
    // 3) ঐ wallets দিয়ে transactions ফিল্টার করো
    const walletIds = wallets.map((w) => w._id);
    const transactions = await transaction_model_1.Transaction.find({
        $or: [
            { senderWalletId: { $in: walletIds } },
            { receiverWalletId: { $in: walletIds } },
        ],
    })
        .sort({ createdAt: -1 })
        .lean();
    // Transaction summary (volume)
    let totalDeposit = 0;
    let totalWithdraw = 0;
    let totalTransfer = 0;
    transactions.forEach((tx) => {
        if (tx.type === "DEPOSIT")
            totalDeposit += tx.amount;
        if (tx.type === "WITHDRAW")
            totalWithdraw += tx.amount;
        if (tx.type === "TRANSFER")
            totalTransfer += tx.amount;
    });
    const summary = {
        totalTransactions: transactions.length,
        totalDeposit,
        totalWithdraw,
        totalTransfer,
        totalVolume: totalDeposit + totalWithdraw + totalTransfer,
    };
    return {
        user,
        wallets,
        transactions,
        summary,
    };
};
const getAgentOverview = async (agentId) => {
    // 1) Agent বের করো
    const agent = await user_model_1.default.findById(agentId).select("-password");
    if (!agent) {
        throw new Error("Agent not found");
    }
    // 2) Agent এর wallets বের করো
    const wallets = await wallet_model_1.Wallet.find({ user: agentId });
    const walletIds = wallets.map((w) => w._id);
    // 3) Transactions খুঁজো যেখানে agent sender বা receiver
    const transactions = await transaction_model_1.Transaction.find({
        $or: [
            { senderWalletId: { $in: walletIds } },
            { receiverWalletId: { $in: walletIds } },
        ],
    })
        .sort({ createdAt: -1 })
        .lean();
    // ---------------------------
    // 4) হিসাব শুরু
    // ---------------------------
    // agent overview summary
    let totalCashIn = 0;
    let totalCashOut = 0;
    let totalTransfer = 0;
    transactions.forEach((tx) => {
        if (tx.type === "CASH_IN")
            totalCashIn += tx.amount;
        if (tx.type === "CASH_OUT")
            totalCashOut += tx.amount;
        if (tx.type === "TRANSFER")
            totalTransfer += tx.amount;
    });
    const summary = {
        totalTransactions: transactions.length,
        totalCashIn,
        totalCashOut,
        totalTransfer,
        totalVolume: totalCashIn + totalCashOut + totalTransfer,
    };
    return {
        agent,
        wallets,
        transactions,
        summary,
    };
};
exports.StatsService = {
    getUserStats,
    getUserOverview,
    getAgentOverview,
};
