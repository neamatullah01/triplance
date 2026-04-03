import express from 'express';
import auth from '../../middlewares/auth';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get(
  '/stats',
  auth('ADMIN'),
  AdminController.getPlatformStats
);

export const AdminRoutes = router;
