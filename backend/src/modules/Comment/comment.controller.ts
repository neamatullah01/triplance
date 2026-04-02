import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentService } from './comment.service';

const addComment = catchAsync(async (req, res) => {
  const postId = req.params.postId as string;
  const result = await CommentService.addComment(postId, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const postId = req.params.postId as string;
  const result = await CommentService.getCommentsByPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CommentService.deleteComment(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const CommentController = {
  addComment,
  getCommentsByPost,
  deleteComment,
};
