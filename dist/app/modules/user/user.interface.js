"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodType = exports.TransactionStatus = exports.TransactionType = exports.IsActive = exports.AgentActive = exports.Role = void 0;
/** User Roles */
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var AgentActive;
(function (AgentActive) {
    AgentActive["APPROVED"] = "APPROVED";
    AgentActive["SUSPENDED"] = "SUSPENDED";
})(AgentActive || (exports.AgentActive = AgentActive = {}));
/** Account Status */
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
/** Transaction Types */
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["TRANSFER"] = "TRANSFER";
    TransactionType["PAYMENT"] = "PAYMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/** Transaction Status */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/** Payment Method Schema */
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CARD"] = "CARD";
    PaymentMethodType["BANK"] = "BANK";
    PaymentMethodType["MOBILE_MONEY"] = "MOBILE_MONEY";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
