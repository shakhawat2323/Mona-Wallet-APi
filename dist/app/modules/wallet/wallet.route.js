"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), //
wallet_controller_1.WalletControllers.getMyWallet);
router.post("/add-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.depositSchema), wallet_controller_1.WalletControllers.depositMoney);
router.get("/overview", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), wallet_controller_1.WalletControllers.getMyOverview);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.withdrawSchema), wallet_controller_1.WalletControllers.withdrawMoney);
router.post("/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.sendMoneySchema), wallet_controller_1.WalletControllers.sendMoney);
exports.WalletRoutes = router;
