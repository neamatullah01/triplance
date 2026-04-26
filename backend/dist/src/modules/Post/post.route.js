"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)('TRAVELER', 'AGENCY'), (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidationSchema), post_controller_1.PostController.createPost);
router.get('/feed', (0, auth_1.default)('TRAVELER', 'AGENCY', 'ADMIN'), post_controller_1.PostController.getAllFeedPost);
router.get('/', post_controller_1.PostController.getAllPosts);
router.get('/my', (0, auth_1.default)('TRAVELER', 'AGENCY', 'ADMIN'), post_controller_1.PostController.getPostById);
router.patch('/:id', (0, auth_1.default)('TRAVELER', 'AGENCY'), (0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidationSchema), post_controller_1.PostController.updatePost);
router.delete('/:id', (0, auth_1.default)('TRAVELER', 'AGENCY', 'ADMIN'), post_controller_1.PostController.deletePost);
exports.PostRoutes = router;
