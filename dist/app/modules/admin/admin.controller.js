"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getAgents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getAgents();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Agents Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getWallets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getWallets();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Wallets Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getTransactions();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
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
const blockWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const walletId = req.params.id;
    const result = await admin_service_1.AdminServices.blockWallet(walletId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet Blocked Successfully",
        data: result,
    });
});
const unblockWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const walletId = req.params.id;
    const result = await admin_service_1.AdminServices.unblockWallet(walletId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet Unblocked Successfully",
        data: result,
    });
});
const approveAgent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const agentId = req.params.id;
    const result = await admin_service_1.AdminServices.approveAgent(agentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Agent Approved Successfully",
        data: result,
    });
});
const suspendAgent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const agentId = req.params.id;
    const result = await admin_service_1.AdminServices.suspendAgent(agentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Agent Suspended Successfully",
        data: result,
    });
});
const getBlockedWallets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.AdminServices.getBlockedWallets();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Blocked Wallets Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getSuspendedAgents = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = await admin_service_1.AdminServices.getSuspendedAgents();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Suspended Agents Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
});
exports.AdminControllers = {
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
