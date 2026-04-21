// src/utils/multer.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where and how Multer saves the files temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Saves files to the 'uploads' folder in your project root
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    // Gives the file a unique name to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create the upload middleware
export const upload = multer({ 
  storage: storage,
  // Optional: Only allow image files
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg, and .webp formats are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});