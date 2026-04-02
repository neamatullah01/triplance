import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowService } from './follow.service';

const followUser = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await FollowService.followUser(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User followed successfully',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await FollowService.unfollowUser(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User unfollowed successfully',
    data: result,
  });
});

const getFollowers = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await FollowService.getFollowers(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Followers retrieved successfully',
    data: result,
  });
});

const getFollowing = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await FollowService.getFollowing(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Following retrieved successfully',
    data: result,
  });
});

export const FollowController = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
