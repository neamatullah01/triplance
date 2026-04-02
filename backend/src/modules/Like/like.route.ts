import { Router } from 'express';
import auth from '../../middlewares/auth';
import { LikeController } from './like.controller';

const router = Router();

router.post(
  '/posts/:postId/likes',
  auth('TRAVELER', 'AGENCY'),
  LikeController.likePost
);

router.delete(
  '/posts/:postId/likes',
  auth('TRAVELER', 'AGENCY'),
  LikeController.unlikePost
);

export const LikeRoutes = router;
