import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

const router = Router();

router.post(
  '/posts/:postId/comments',
  auth('TRAVELER', 'AGENCY'),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentController.addComment
);

router.get(
  '/posts/:postId/comments',
  CommentController.getCommentsByPost
);

router.delete(
  '/comments/:id',
  auth('TRAVELER', 'AGENCY', 'ADMIN'),
  CommentController.deleteComment
);

export const CommentRoutes = router;
