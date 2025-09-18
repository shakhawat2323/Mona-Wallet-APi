"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const createTransaction = async (type, amount, from, to) => {
    const transaction = await transaction_model_1.Transaction.create({
        type,
        amount,
        from,
        to,
        status: "COMPLETED",
    });
    return transaction;
};
exports.TransactionServices = {
    createTransaction,
};
