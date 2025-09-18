import { model, Schema } from "mongoose";
import { AgentActive, IsActive, IUser, Role } from "./user.interface";
const authProviderSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    // isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    status: {
      type: String,
      enum: Object.values(AgentActive),
      default: AgentActive.APPROVED,
    },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      required: true,
    },
    auths: { type: [authProviderSchema] },
    wallets: [{ type: Schema.Types.ObjectId, ref: "Wallet" }],
  },
  { timestamps: true, versionKey: false }
);
const User = model<IUser>("User", userSchema);
export default User;
