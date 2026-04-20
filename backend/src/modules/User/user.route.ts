import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', auth('ADMIN'), UserController.getAllUsers);

router.get(
  '/suggestions',
  auth('TRAVELER', 'AGENCY', 'ADMIN'),
  UserController.getSuggestedUsers
);

router.get('/:id', UserController.getUserById);

router.patch(
  '/:id',
  auth('ADMIN', 'TRAVELER', 'AGENCY'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateProfile
);

router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

router.patch(
  '/:id/ban',
  auth('ADMIN'),
  validateRequest(UserValidation.banUserValidationSchema),
  UserController.banUser
);

router.patch(
  '/:id/approve',
  auth('ADMIN'),
  validateRequest(UserValidation.approveAgencyValidationSchema),
  UserController.approveAgency
);

export const UserRoutes = router;
