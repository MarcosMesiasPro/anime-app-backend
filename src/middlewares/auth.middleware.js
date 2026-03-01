const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('You are not logged in', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);

  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  req.user = currentUser;
  return next();
});

module.exports = { protect };
