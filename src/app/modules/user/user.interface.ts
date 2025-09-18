import { Types } from "mongoose";

/** User Roles */
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}
export enum AgentActive {
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

/** Account Status */
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

/** Auth Provider */
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
/** User Schema */
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  // isDeleted?: boolean;
  status?: AgentActive;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;

  wallet?: string;
  auths: IAuthProvider[];
  wallets?: Types.ObjectId[];
}

/** Transaction Types */
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
}

/** Transaction Status */
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

/** Transaction Schema */
export interface ITransaction {
  _id?: Types.ObjectId;
  wallet: Types.ObjectId;
  toWallet?: Types.ObjectId; //
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  reference?: string;
  description?: string;
}

/** Payment Method Schema */
export enum PaymentMethodType {
  CARD = "CARD",
  BANK = "BANK",
  MOBILE_MONEY = "MOBILE_MONEY",
}

export interface IPaymentMethod {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  type: PaymentMethodType;
  provider: string;
  accountNumber: string;
  isDefault?: boolean;
}

/** Notification Schema */
export interface INotification {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
}

/** KYC (Know Your Customer) Schema */
export interface IKYC {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  nidNumber: string;
  documentUrl: string;
  verified: boolean;
}
