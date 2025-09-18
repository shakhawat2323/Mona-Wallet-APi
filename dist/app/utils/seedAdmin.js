"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const seedAdmin = async () => {
    try {
        const isAdminExist = await user_model_1.default.findOne({
            email: env_1.envVars.ADMIN_EMAIL,
        });
        if (isAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin...");
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.ADMIN_EMAIL,
        };
        const payload = {
            name: "admin",
            role: user_interface_1.Role.ADMIN,
            email: env_1.envVars.ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider],
            wallets: [],
        };
        const admin = await user_model_1.default.create(payload);
        console.log("Super Admin Created Successfuly! \n");
        console.log(admin);
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedAdmin = seedAdmin;
