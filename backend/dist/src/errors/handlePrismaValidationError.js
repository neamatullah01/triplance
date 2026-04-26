"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaValidationError = (err) => {
    const errorSources = [
        {
            path: "",
            message: err.message,
        },
    ];
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
exports.default = handlePrismaValidationError;
