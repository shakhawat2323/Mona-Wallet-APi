import { Schema, model } from "mongoose";
import { IAgent } from "./agent.interface";

const agentSchema = new Schema<IAgent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      unique: true,
    },
    commissionBalance: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

export const Agent = model<IAgent>("Agent", agentSchema);
