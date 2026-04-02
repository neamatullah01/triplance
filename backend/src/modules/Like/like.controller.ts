import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LikeService } from './like.service';

const likePost = catchAsync(async (req, res) => {
  const postId = req.params.postId as string;
  const result = await LikeService.likePost(postId, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post liked successfully',
    data: result,
  });
});

const unlikePost = catchAsync(async (req, res) => {
  const postId = req.params.postId as string;
  const result = await LikeService.unlikePost(postId, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post unliked successfully',
    data: result,
  });
});

export const LikeController = {
  likePost,
  unlikePost,
};
