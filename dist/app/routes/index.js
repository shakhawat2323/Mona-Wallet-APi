"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_routes_1 = require("../modules/auth/auth.routes");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const agent_route_1 = require("../modules/agent/agent.route");
const admin_route_1 = require("../modules/admin/admin.route");
const otp_route_1 = require("../modules/otp/otp.route");
const stats_route_1 = require("../modules/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes,
    },
    {
        path: "/agent",
        route: agent_route_1.AgentRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
