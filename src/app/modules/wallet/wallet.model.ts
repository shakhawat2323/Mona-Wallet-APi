import { model, Schema } from "mongoose";
import { Currency, IWallet, Status, WalletType } from "./wallet.interface";

// Wallet Schema
const walletSchema = new Schema<IWallet>(
  {
    user: { type: String },
    balance: { type: Number, default: 50 },
    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      default: Currency.BDT,
    },
    email: { type: String, required: true },

    type: {
      type: String,
      enum: Object.values(WalletType),
      default: WalletType.PERSONAL,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false }
);

// Wallet Model
export const Wallet = model<IWallet>("Wallet", walletSchema);
