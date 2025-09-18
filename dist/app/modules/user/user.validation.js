"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
//  Create User Zod Schema
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.default
        .string({ error: "Enter Your country code" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    picture: zod_1.default
        .string()
        .url({ message: "Picture must be a valid URL" })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isDeleted: zod_1.default.boolean().default(false).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).default("ACTIVE"),
    isVerified: zod_1.default.boolean().default(false).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).default(user_interface_1.Role.USER),
    wallets: zod_1.default.array(zod_1.default.string()).optional(),
    //   auths: z.array(z.object({ provider: z.string(), providerId: z.string() })),
});
//  Update User Zod Schema
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    })
        .optional(),
    phone: zod_1.default
        .string({ error: "Enter Your country code" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Enter Your country code. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    picture: zod_1.default
        .string()
        .url({ message: "Picture must be a valid URL" })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isVerified: zod_1.default.boolean().optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    wallets: zod_1.default.array(zod_1.default.string()).optional(),
    auths: zod_1.default
        .array(zod_1.default.object({ provider: zod_1.default.string(), providerId: zod_1.default.string() }))
        .optional(),
});
