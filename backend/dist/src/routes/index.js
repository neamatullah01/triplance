"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const post_route_1 = require("../modules/Post/post.route");
const comment_route_1 = require("../modules/Comment/comment.route");
const like_route_1 = require("../modules/Like/like.route");
const follow_route_1 = require("../modules/Follow/follow.route");
const package_route_1 = require("../modules/Package/package.route");
const booking_route_1 = require("../modules/Booking/booking.route");
const review_route_1 = require("../modules/Review/review.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const agency_route_1 = require("../modules/Agency/agency.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/posts",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/",
        route: comment_route_1.CommentRoutes,
    },
    {
        path: "/",
        route: like_route_1.LikeRoutes,
    },
    {
        path: "/",
        route: follow_route_1.FollowRoutes,
    },
    {
        path: "/packages",
        route: package_route_1.PackageRoutes,
    },
    {
        path: "/bookings",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/payments",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/agency",
        route: agency_route_1.AgencyRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
