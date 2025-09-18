"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const stats_controller_1 = require("./stats.controller");
const router = express_1.default.Router();
router.get("/user", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), stats_controller_1.StatsController.getUserStats);
router.get("/overiew", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), stats_controller_1.StatsController.getMyOverview);
router.get("/agent-overview", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), stats_controller_1.StatsController.getAgentOverview);
exports.StatsRoutes = router;
