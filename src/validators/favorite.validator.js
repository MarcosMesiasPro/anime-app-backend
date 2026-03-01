const { body, param } = require('express-validator');

const createFavoriteValidator = [
  body('animeId').isInt({ min: 1 }).withMessage('animeId must be a positive integer'),
  body('title').trim().notEmpty().withMessage('title is required').isLength({ max: 200 }),
  body('coverImage').optional().trim().isURL().withMessage('coverImage must be a valid URL'),
];

const favoriteIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid favorite id'),
];

module.exports = {
  createFavoriteValidator,
  favoriteIdParamValidator,
};
