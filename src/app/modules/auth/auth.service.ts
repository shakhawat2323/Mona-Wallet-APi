/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";

import { IAuthProvider, IUser } from "../user/user.interface";
import User from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const credentialsLogin = async (Payload: Partial<IUser>) => {
  const { email, password } = Payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email dose Not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }
  const ispasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!ispasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userToken = createUserTokens(isUserExist);

  // delete isUserExist.password;
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,

    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
const getNewaccesToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken._id);
  console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // পুরানো পাসওয়ার্ড match করানো
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  // নতুন পাসওয়ার্ড hash করা
  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();

  return { _id: user._id, email: user.email };
};
export const createUserWithWallet = async (userData: any) => {
  // 1. User create
  const user = await User.create(userData);

  // 2. Wallet create
  const wallet = await Wallet.create({
    user: user._id,
    balance: 50,
    currency: "BDT",
    type: "PERSONAL",
    status: "ACTIVE",
    email: user.email,
    isActive: true,
  });

  if (!user.wallets) {
    user.wallets = [];
  }

  user.wallets.push(wallet._id);
  await user.save();

  return user;
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set you password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewaccesToken,
  resetPassword,
  setPassword,
};
