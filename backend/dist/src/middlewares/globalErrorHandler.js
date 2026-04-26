"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handlePrismaKnownError_1 = __importDefault(require("../errors/handlePrismaKnownError"));
const handlePrismaValidationError_1 = __importDefault(require("../errors/handlePrismaValidationError"));
const handlePrismaInitError_1 = __importDefault(require("../errors/handlePrismaInitError"));
const client_1 = require("../../generated/prisma/client");
const globalErrorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handlePrismaKnownError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handlePrismaValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        const simplifiedError = (0, handlePrismaInitError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    // Note: if you truly want to name it 'slack' instead of 'stack',
    // you can rename the 'stack' property below.
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: err?.stack,
    });
};
exports.default = globalErrorHandler;
