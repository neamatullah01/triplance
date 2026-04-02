import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostController } from './post.controller';
import { PostValidation } from './post.validation';

const router = Router();

router.post(
  '/',
  auth('TRAVELER', 'AGENCY'),
  validateRequest(PostValidation.createPostValidationSchema),
  PostController.createPost
);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getPostById);

router.patch(
  '/:id',
  auth('TRAVELER', 'AGENCY'),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostController.updatePost
);

router.delete(
  '/:id',
  auth('TRAVELER', 'AGENCY', 'ADMIN'),
  PostController.deletePost
);

export const PostRoutes = router;
