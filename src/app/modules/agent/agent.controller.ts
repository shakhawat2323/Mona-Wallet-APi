/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AgentServices } from "./agent.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const { userEmail, amount } = req.body;

  // Agent email JWT থেকে নিবো
  const agentEmail = (req.user as any).email;

  const result = await AgentServices.cashIn(agentEmail, userEmail, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash-in Successful",
    data: result,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const { userEmail, amount } = req.body;

  // Agent email JWT থেকে নিবো
  const agentEmail = (req.user as any).email;

  const result = await AgentServices.cashOut(agentEmail, userEmail, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cash-out Successful",
    data: result,
  });
});

export const AgentControllers = {
  cashIn,
  cashOut,
};
