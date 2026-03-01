const { body, param } = require('express-validator');

const mongoIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
];

const updateProfileValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('avatarUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('avatarUrl must be a valid URL'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Bio max length is 300 characters'),
];

module.exports = {
  mongoIdParamValidator,
  updateProfileValidator,
};
