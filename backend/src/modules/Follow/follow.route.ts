import { Router } from 'express';
import auth from '../../middlewares/auth';
import { FollowController } from './follow.controller';

const router = Router();

router.post(
  '/users/:id/follow',
  auth('TRAVELER'),
  FollowController.followUser
);

router.delete(
  '/users/:id/follow',
  auth('TRAVELER'),
  FollowController.unfollowUser
);

router.get('/users/:id/followers', FollowController.getFollowers);
router.get('/users/:id/following', FollowController.getFollowing);

export const FollowRoutes = router;
