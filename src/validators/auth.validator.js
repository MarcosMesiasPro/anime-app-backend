const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email').trim().isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password')
    .isLength({ min: 6, max: 64 })
    .withMessage('Password must be between 6 and 64 characters'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
