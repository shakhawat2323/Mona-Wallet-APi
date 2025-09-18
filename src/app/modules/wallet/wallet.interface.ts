import { Types } from "mongoose";

/** Wallet Types */
export enum WalletType {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
}
export enum Status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}
// Wallet Interface
export interface IWallet {
  user: string;
  balance: number;
  status: "ACTIVE" | "BLOCKED";
}
export enum Currency {
  USD = "USD",
  BDT = "BDT",
  EUR = "EUR",
  INR = "INR",
}
export enum AgentActive {
  APPROVED = "APPROVED",
  BLOCKED = "BLOCKED",
}

/** Wallet Schema */
export interface IWallet {
  _id?: Types.ObjectId;
  user: string;
  email: string;

  balance: number;
  currency: Currency;
  type: WalletType;
  isActive?: boolean;
  createdAt?: Date;
}
