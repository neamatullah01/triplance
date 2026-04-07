import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { LikeRoutes } from '../modules/Like/like.route';
import { FollowRoutes } from '../modules/Follow/follow.route';
import { PackageRoutes } from '../modules/Package/package.route';
import { BookingRoutes } from '../modules/Booking/booking.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { AdminRoutes } from '../modules/Admin/admin.route';

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
  },
  {
    path: '/',
    route: FollowRoutes
  },
  {
    path: '/packages',
    route: PackageRoutes
  },
  {
    path: '/bookings',
    route: BookingRoutes
  },
  {
    path: '/reviews',
    route: ReviewRoutes
  },
  {
    path: '/admin',
    route: AdminRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;