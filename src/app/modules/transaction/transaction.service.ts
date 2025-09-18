import { Transaction } from "./transaction.model";

const createTransaction = async (
  type: "deposit" | "withdraw" | "send",
  amount: number,
  from?: string,
  to?: string
) => {
  const transaction = await Transaction.create({
    type,
    amount,
    from,
    to,
    status: "COMPLETED",
  });
  return transaction;
};

export const TransactionServices = {
  createTransaction,
};
