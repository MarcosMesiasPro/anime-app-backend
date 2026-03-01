const { body, param } = require('express-validator');

const animeIdParamValidator = [
  param('animeId').isInt({ min: 1 }).withMessage('animeId must be a positive integer'),
];

const commentIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid comment id'),
];

const createCommentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('content length must be between 1 and 1000 characters'),
];

const updateCommentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('content length must be between 1 and 1000 characters'),
];

module.exports = {
  animeIdParamValidator,
  commentIdParamValidator,
  createCommentValidator,
  updateCommentValidator,
};
