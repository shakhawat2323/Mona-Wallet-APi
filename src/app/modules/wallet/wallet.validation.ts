import { z } from "zod";

import { Currency, WalletType } from "./wallet.interface";

// Create Wallet Validation
export const createWalletSchema = z.object({
  balance: z.number().min(0, "Balance must be minimum 0").default(50),
  currency: z.enum(Object.values(Currency)).default(Currency.BDT),
  type: z
    .enum(Object.values(WalletType) as [string])
    .default(WalletType.PERSONAL),
  isActive: z.boolean().default(true),
});

// Deposit Validation
export const depositSchema = z.object({
  email: z.email("Invalid email format"),
  amount: z.number().positive("Deposit amount must be greater than 0"),
});

// Withdraw Validation
export const withdrawSchema = z.object({
  email: z.email("Invalid email format"),
  amount: z.number().positive("Withdraw amount must be greater than 0"),
});

export const sendMoneySchema = z.object({
  receiverEmail: z.email("Receiver email must be a valid email address"),
  amount: z
    .number()
    .positive("Amount must be a positive number")
    .min(10, "Minimum transfer amount is 10 BDT"),
});
