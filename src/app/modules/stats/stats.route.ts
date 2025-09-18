import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get("/user", checkAuth(Role.ADMIN), StatsController.getUserStats);
router.get(
  "/overiew",
  checkAuth(Role.USER, Role.ADMIN),
  StatsController.getMyOverview
);
router.get(
  "/agent-overview",
  checkAuth(Role.AGENT),
  StatsController.getAgentOverview
);
export const StatsRoutes = router;
