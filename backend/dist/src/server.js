"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const prisma_1 = require("./lib/prisma");
let server;
async function main() {
    try {
        await prisma_1.prisma.$connect();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Triplance Backend listening on port ${config_1.default.port}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}
main();
process.on('unhandledRejection', (err) => {
    console.log('👿 unhandledRejection is detected, shutting down ...', err);
    prisma_1.prisma.$disconnect();
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on('uncaughtException', (err) => {
    console.log('👿 uncaughtException is detected, shutting down ...', err);
    prisma_1.prisma.$disconnect();
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('💤 SIGTERM received, shutting down gracefully ...');
    prisma_1.prisma.$disconnect();
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
process.on('SIGINT', () => {
    console.log('💤 SIGINT received, shutting down gracefully ...');
    prisma_1.prisma.$disconnect();
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
