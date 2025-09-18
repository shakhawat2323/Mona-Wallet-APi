"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionStatus = void 0;
const mongoose_1 = require("mongoose");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
const transactionSchema = new mongoose_1.Schema({
    senderWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    receiverWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: [
            "DEPOSIT",
            "WITHDRAW",
            "TRANSFER",
            "PAYMENT",
            "CASH_IN",
            "CASH_OUT",
        ],
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
}, { versionKey: false, timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
