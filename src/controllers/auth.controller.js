const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (userId) => jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const createAuthResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return res.status(statusCode).json({
    success: true,
    token,
    user: userWithoutPassword,
  });
};

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError('Email or username already in use', 409);
  }

  const user = await User.create({ username, email, password });
  return createAuthResponse(user, 201, res);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  return createAuthResponse(user, 200, res);
});

const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
