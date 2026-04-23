import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PackageValidation } from './package.validation';
import { PackageController } from './package.controller';
import { ReviewController } from '../Review/review.controller';

const router = express.Router();

router.post(
  '/',
  auth('AGENCY'),
  validateRequest(PackageValidation.createPackageValidationSchema),
  PackageController.createPackage
);

router.get(
  '/',
  PackageController.getAllPackages
);

router.get(
  '/my-packages',
  auth('AGENCY'),
  PackageController.getMyAgencyPackages
);

router.get(
  '/:id',
  PackageController.getPackageById
);

router.get(
  '/:id/reviews',
  ReviewController.getReviewsForPackage
);

router.patch(
  '/:id',
  auth('AGENCY'),
  validateRequest(PackageValidation.updatePackageValidationSchema),
  PackageController.updatePackage
);

router.delete(
  '/:id',
  auth('AGENCY', 'ADMIN'),
  PackageController.deletePackage
);

export const PackageRoutes = router;
