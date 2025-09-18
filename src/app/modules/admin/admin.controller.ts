/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAgents = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAgents();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Agents Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getWallets = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getWallets();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Wallets Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getTransactions();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Transactions Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

// const blockWallet = catchAsync(async (req: Request, res: Response) => {
//   const walletId = req.params.id;
//   const result = await AdminServices.blockWallet(walletId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Wallet Blocked Successfully",
//     data: result,
//   });
// });

// const unblockWallet = catchAsync(async (req: Request, res: Response) => {
//   const walletId = req.params.id;
//   const result = await AdminServices.unblockWallet(walletId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Wallet Unblocked Successfully",
//     data: result,
//   });
// });

const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await AdminServices.blockWallet(walletId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet Blocked Successfully",
    data: result,
  });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await AdminServices.unblockWallet(walletId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet Unblocked Successfully",
    data: result,
  });
});

const approveAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;
  const result = await AdminServices.approveAgent(agentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent Approved Successfully",
    data: result,
  });
});

const suspendAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;
  const result = await AdminServices.suspendAgent(agentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent Suspended Successfully",
    data: result,
  });
});
const getBlockedWallets = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getBlockedWallets();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Blocked Wallets Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSuspendedAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminServices.getSuspendedAgents();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Suspended Agents Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const AdminControllers = {
  getUsers,
  getAgents,
  getWallets,
  getTransactions,
  blockWallet,
  unblockWallet,
  approveAgent,
  suspendAgent,
  getBlockedWallets, // ✅ এখানে controller function attach হলো
  getSuspendedAgents, // ✅ এখানে attach হলো
};
