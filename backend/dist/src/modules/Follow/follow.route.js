"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const follow_controller_1 = require("./follow.controller");
const router = (0, express_1.Router)();
router.post('/users/:id/follow', (0, auth_1.default)('TRAVELER'), follow_controller_1.FollowController.followUser);
router.delete('/users/:id/follow', (0, auth_1.default)('TRAVELER'), follow_controller_1.FollowController.unfollowUser);
router.get('/users/:id/followers', follow_controller_1.FollowController.getFollowers);
router.get('/users/:id/following', follow_controller_1.FollowController.getFollowing);
exports.FollowRoutes = router;
