import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  senderWalletId: Schema.Types.ObjectId;
  receiverWalletId: Schema.Types.ObjectId;
  amount: number;
  type:
    | "DEPOSIT"
    | "WITHDRAW"
    | "TRANSFER"
    | "PAYMENT"
    | "CASH_OUT"
    | "CASH_IN";
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
}
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

const transactionSchema = new Schema<ITransaction>(
  {
    senderWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        "DEPOSIT",
        "WITHDRAW",
        "TRANSFER",
        "PAYMENT",
        "CASH_IN",
        "CASH_OUT",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
