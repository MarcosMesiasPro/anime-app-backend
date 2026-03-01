const express = require('express');

const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate.middleware');
const {
  animeIdParamValidator,
  commentIdParamValidator,
  createCommentValidator,
  updateCommentValidator,
} = require('../validators/comment.validator');

const router = express.Router();

router.get('/anime/:animeId', animeIdParamValidator, validateRequest, commentController.getAnimeComments);
router.post(
  '/anime/:animeId',
  protect,
  animeIdParamValidator,
  createCommentValidator,
  validateRequest,
  commentController.createComment
);

router.patch('/:id', protect, commentIdParamValidator, updateCommentValidator, validateRequest, commentController.updateComment);
router.delete('/:id', protect, commentIdParamValidator, validateRequest, commentController.deleteComment);
router.post('/:id/like', protect, commentIdParamValidator, validateRequest, commentController.toggleLikeComment);

module.exports = router;
