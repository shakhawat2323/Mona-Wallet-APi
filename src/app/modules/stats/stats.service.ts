import { Transaction } from "../transaction/transaction.model";
import { IsActive } from "../user/user.interface";
import User from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

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
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  // === Transaction Counts ===
  const totalTransactionsPromise = Transaction.countDocuments();
  const transactionVolumePromise = Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalVolume: { $sum: "$amount" },
      },
    },
  ]);

  // === Wallet Counts ===
  const totalWalletsPromise = Wallet.countDocuments();
  const blockedWalletsPromise = Wallet.countDocuments({ status: "BLOCKED" });
  const unblockedWalletsPromise = Wallet.countDocuments({ status: "ACTIVE" });

  // === Agents ===
  const approvedAgentsPromise = User.countDocuments({
    role: "AGENT",
    status: "APPROVED",
  });
  const suspendedAgentsPromise = User.countDocuments({
    role: "AGENT",
    status: "SUSPENDED",
  });

  // === Await All ===
  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
    totalTransactions,
    transactionVolumeAgg,
    totalWallets,
    blockedWallets,
    unblockedWallets,
    approvedAgents,
    suspendedAgents,
  ] = await Promise.all([
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

  const transactionVolume =
    transactionVolumeAgg.length > 0 ? transactionVolumeAgg[0].totalVolume : 0;

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

const getUserOverview = async (userId: string) => {
  // 1) ইউজার বের করো
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  // 2) ইউজারের wallets বের করো
  const wallets = await Wallet.find({ user: userId });

  // 3) ঐ wallets দিয়ে transactions ফিল্টার করো
  const walletIds = wallets.map((w) => w._id);

  const transactions = await Transaction.find({
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
    if (tx.type === "DEPOSIT") totalDeposit += tx.amount;
    if (tx.type === "WITHDRAW") totalWithdraw += tx.amount;
    if (tx.type === "TRANSFER") totalTransfer += tx.amount;
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

const getAgentOverview = async (agentId: string) => {
  // 1) Agent বের করো
  const agent = await User.findById(agentId).select("-password");

  if (!agent) {
    throw new Error("Agent not found");
  }

  // 2) Agent এর wallets বের করো
  const wallets = await Wallet.find({ user: agentId });
  const walletIds = wallets.map((w) => w._id);

  // 3) Transactions খুঁজো যেখানে agent sender বা receiver
  const transactions = await Transaction.find({
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
    if (tx.type === "CASH_IN") totalCashIn += tx.amount;
    if (tx.type === "CASH_OUT") totalCashOut += tx.amount;
    if (tx.type === "TRANSFER") totalTransfer += tx.amount;
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
export const StatsService = {
  getUserStats,
  getUserOverview,
  getAgentOverview,
};
