import { Document, Types } from "mongoose";

export interface IAgent extends Document {
  user: Types.ObjectId;
  wallet: Types.ObjectId; // Agent’s Wallet
  commissionBalance: number; // Total commission earned
}
