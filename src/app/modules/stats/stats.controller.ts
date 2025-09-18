/* eslint-disable @typescript-eslint/no-explicit-any */
// controllers/stats.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getUserStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getMyOverview = catchAsync(async (req: any, res: Response) => {
  const userId = req.user._id;

  const overview = await StatsService.getUserOverview(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User overview fetched successfully",
    data: overview,
  });
});
const getAgentOverview = catchAsync(async (req: any, res: Response) => {
  const agentId = req.user._id;

  const overview = await StatsService.getAgentOverview(agentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Agent overview fetched successfully",
    data: overview,
  });
});

export const StatsController = {
  getUserStats,
  getMyOverview,
  getAgentOverview,
};
