import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.getUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.updateProfile(id, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const banUser = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.banUser(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User ban status updated successfully',
    data: result,
  });
});

const approveAgency = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.approveAgency(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agency approval status updated successfully',
    data: result,
  });
});

const getSuggestedUsers = catchAsync(async (req, res) => {
  const result = await UserService.getSuggestedUsers(req.user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Suggested users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  banUser,
  approveAgency,
  getSuggestedUsers,
};