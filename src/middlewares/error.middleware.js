const mongoose = require('mongoose');

const AppError = require('../utils/appError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const handleCastErrorDB = () => new AppError('Invalid resource identifier', 400);

const handleDuplicateFieldsDB = (err) => {
  const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(`Duplicate value for ${duplicatedField}`, 409);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () => new AppError('Token expired. Please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
  }

  if (error instanceof mongoose.Error.CastError || error.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (process.env.NODE_ENV === 'production') {
    return sendErrorProd(error, res);
  }

  return sendErrorDev(error, res);
};

module.exports = {
  notFound,
  errorHandler,
};
