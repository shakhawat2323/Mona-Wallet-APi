"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = require("mongoose");
const agentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        unique: true,
    },
    commissionBalance: {
        type: Number,
        default: 0,
    },
}, { versionKey: false });
exports.Agent = (0, mongoose_1.model)("Agent", agentSchema);
