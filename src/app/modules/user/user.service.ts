import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  // Check if user already exists
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // Auth provider info
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || "USER",
    status: "APPROVED",
    auths: [authProvider],
    ...rest,
  });

  const walletType = user.role === Role.AGENT ? "BUSINESS" : "PERSONAL";

  // Create wallet automatically with initial balance TK50
  const wallet = await Wallet.create({
    user: user._id,
    balance: 50,
    email: user.email,
    currency: "BDT",
    type: walletType,
    status: "ACTIVE",
    isActive: true,
  });

  // Link wallet to user
  (user.wallets as JwtPayload).push(wallet._id);
  await user.save();

  // return populated user (with wallet info)
  const populatedUser = await User.findById(user._id).populate("wallets");

  return populatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  //  Role change validation
  if (payload.role) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change roles"
      );
    }

    if (payload.role === Role.ADMIN && decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only ADMIN can assign ADMIN role"
      );
    }

    //  If role changed to AGENT, update wallet type to BUSINESS
    if (payload.role === Role.AGENT) {
      await Wallet.findOneAndUpdate(
        { user: userId },
        { type: "BUSINESS" },
        { new: true }
      );
    }

    //  If role changed to USER, update wallet type to PERSONAL
    if (payload.role === Role.USER) {
      await Wallet.findOneAndUpdate(
        { user: userId },
        { type: "PERSONAL" },
        { new: true }
      );
    }
  }

  //  Password hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password -__v") // password hide করলাম
    .populate("wallets"); // wallets details আনলো

  return {
    data: user,
  };
};
const updateUserProfile = async (
  userId: string,
  payload: { name?: string; phone?: string }
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.name) existingUser.name = payload.name;
  if (payload.phone) existingUser.phone = payload.phone;

  await existingUser.save();
  return existingUser;
};
export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  updateUserProfile,
};
