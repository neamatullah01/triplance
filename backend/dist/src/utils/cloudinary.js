"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
// src/utils/cloudinary.ts
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
// Configure Cloudinary with your credentials from .env
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath)
            return null;
        // Upload the file to Cloudinary
        const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'triplance_profiles', // Puts images in a specific folder in your Cloudinary
        });
        // File has been uploaded successfully, now delete the temporary local file
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        return response;
    }
    catch (error) {
        // If upload fails, make sure we still delete the temporary local file
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
