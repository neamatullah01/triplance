import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { LikeRoutes } from '../modules/Like/like.route';

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/posts',
    route: PostRoutes
  },
  {
    path: '/',
    route: CommentRoutes
  },
  {
    path: '/',
    route: LikeRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;