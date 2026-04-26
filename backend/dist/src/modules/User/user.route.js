"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("ADMIN"), user_controller_1.UserController.getAllUsers);
router.get("/suggestions", (0, auth_1.default)("TRAVELER", "AGENCY", "ADMIN"), user_controller_1.UserController.getSuggestedUsers);
router.get("/agencies", (0, auth_1.default)("TRAVELER", "AGENCY", "ADMIN"), user_controller_1.UserController.getAllAgenciesForUser);
router.get("/:id", user_controller_1.UserController.getUserById);
router.patch("/:id", (0, auth_1.default)("ADMIN", "TRAVELER", "AGENCY"), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserController.updateProfile);
router.patch("/:id", (0, auth_1.default)("TRAVELER", "AGENCY", "ADMIN"), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), // Zod is happy again!
user_controller_1.UserController.updateProfile);
router.delete("/:id", (0, auth_1.default)("ADMIN"), user_controller_1.UserController.deleteUser);
router.patch("/:id/ban", (0, auth_1.default)("ADMIN"), user_controller_1.UserController.banUser);
router.patch("/:id/approve", (0, auth_1.default)("ADMIN"), user_controller_1.UserController.approveAgency);
exports.UserRoutes = router;
