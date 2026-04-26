"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const like_controller_1 = require("./like.controller");
const router = (0, express_1.Router)();
router.post('/posts/:postId/likes', (0, auth_1.default)('TRAVELER', 'AGENCY'), like_controller_1.LikeController.likePost);
router.delete('/posts/:postId/likes', (0, auth_1.default)('TRAVELER', 'AGENCY'), like_controller_1.LikeController.unlikePost);
exports.LikeRoutes = router;
