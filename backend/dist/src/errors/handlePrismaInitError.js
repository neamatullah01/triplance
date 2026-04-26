"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaInitError = (err) => {
    const errorSources = [
        {
            path: "",
            message: err.message,
        },
    ];
    return {
        statusCode: 500,
        message: "Database Initialization Error",
        errorSources,
    };
};
exports.default = handlePrismaInitError;
