"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentControllers = void 0;
const agent_service_1 = require("./agent.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const cashIn = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userEmail, amount } = req.body;
    // Agent email JWT থেকে নিবো
    const agentEmail = req.user.email;
    const result = await agent_service_1.AgentServices.cashIn(agentEmail, userEmail, amount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Cash-in Successful",
        data: result,
    });
});
const cashOut = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userEmail, amount } = req.body;
    // Agent email JWT থেকে নিবো
    const agentEmail = req.user.email;
    const result = await agent_service_1.AgentServices.cashOut(agentEmail, userEmail, amount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Cash-out Successful",
        data: result,
    });
});
exports.AgentControllers = {
    cashIn,
    cashOut,
};
