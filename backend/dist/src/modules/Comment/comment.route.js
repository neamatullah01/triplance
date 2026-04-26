"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
router.post('/posts/:postId/comments', (0, auth_1.default)('TRAVELER', 'AGENCY'), (0, validateRequest_1.default)(comment_validation_1.CommentValidation.createCommentValidationSchema), comment_controller_1.CommentController.addComment);
router.get('/posts/:postId/comments', comment_controller_1.CommentController.getCommentsByPost);
router.delete('/comments/:id', (0, auth_1.default)('TRAVELER', 'AGENCY', 'ADMIN'), comment_controller_1.CommentController.deleteComment);
exports.CommentRoutes = router;
