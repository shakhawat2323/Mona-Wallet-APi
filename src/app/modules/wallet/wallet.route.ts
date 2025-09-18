import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  depositSchema,
  sendMoneySchema,
  withdrawSchema,
} from "./wallet.validation";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/me",
  checkAuth(Role.USER), //
  WalletControllers.getMyWallet
);

router.post(
  "/add-money",
  checkAuth(Role.USER),
  validateRequest(depositSchema),
  WalletControllers.depositMoney
);
router.get("/overview", checkAuth(Role.USER), WalletControllers.getMyOverview);

router.post(
  "/withdraw",
  checkAuth(Role.USER),
  validateRequest(withdrawSchema),
  WalletControllers.withdrawMoney
);
router.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(sendMoneySchema),
  WalletControllers.sendMoney
);

export const WalletRoutes = router;
