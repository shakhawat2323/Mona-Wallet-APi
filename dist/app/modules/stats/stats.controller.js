"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const stats_service_1 = require("./stats.service");
const getUserStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getUserStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});
const getMyOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const overview = await stats_service_1.StatsService.getUserOverview(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User overview fetched successfully",
        data: overview,
    });
});
const getAgentOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const agentId = req.user._id;
    const overview = await stats_service_1.StatsService.getAgentOverview(agentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Agent overview fetched successfully",
        data: overview,
    });
});
exports.StatsController = {
    getUserStats,
    getMyOverview,
    getAgentOverview,
};
