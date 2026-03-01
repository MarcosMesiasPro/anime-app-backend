const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const allowedFields = ['username', 'avatarUrl', 'bio'];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  if (updates.username) {
    const existingUsername = await User.findOne({
      username: updates.username,
      _id: { $ne: req.user._id },
    });

    if (existingUsername) {
      throw new AppError('Username already in use', 409);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
    select: '-password',
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

module.exports = {
  getUserProfile,
  updateMyProfile,
};
