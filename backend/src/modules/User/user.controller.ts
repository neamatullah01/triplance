import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { uploadToCloudinary } from '../../utils/cloudinary';

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
  const { id } = req.params;
  
  // Cast req to any to bypass strict type checking for req.user
  const authUser = (req as any).user; 

  // 1. Get the payload from the standard JSON body
  let payload: Record<string, any> = { ...req.body };

  // 2. Check if the profileImage is a Base64 string and upload it
  if (payload.profileImage && payload.profileImage.startsWith('data:image')) {
    const profileUpload = await uploadToCloudinary(payload.profileImage);
    if (profileUpload?.secure_url) {
      payload.profileImage = profileUpload.secure_url;
    }
  }

  // 3. Check if the coverImage is a Base64 string and upload it
  if (payload.coverImage && payload.coverImage.startsWith('data:image')) {
    const coverUpload = await uploadToCloudinary(payload.coverImage);
    if (coverUpload?.secure_url) {
      payload.coverImage = coverUpload.secure_url;
    }
  }

  // 4. Pass the clean payload with Cloudinary URLs to your database
  const result = await UserService.updateProfile(id as string, payload, authUser);

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
  const result = await UserService.banUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User ban status updated successfully',
    data: result,
  });
});

const approveAgency = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await UserService.approveAgency(id);

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

const getAllAgenciesForUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllAgenciesForUser(req.user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agencies retrieved successfully',
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
  getAllAgenciesForUser,
};