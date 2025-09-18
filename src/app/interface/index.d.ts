import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        email: string;
        userId: string;
        role: string;
        walletId?: Types.ObjectId;
        walletEmail?: string;
      };
    }
  }
}

export {};
