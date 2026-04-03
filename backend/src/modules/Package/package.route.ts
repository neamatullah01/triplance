import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PackageValidation } from './package.validation';
import { PackageController } from './package.controller';

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
  '/:id',
  PackageController.getPackageById
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
