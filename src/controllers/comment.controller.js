const Comment = require('../models/comment.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAnimeComments = catchAsync(async (req, res) => {
  const animeId = Number(req.params.animeId);

  const comments = await Comment.find({ animeId })
    .populate('user', 'username avatarUrl')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    comments,
  });
});

const createComment = catchAsync(async (req, res) => {
  const comment = await Comment.create({
    user: req.user._id,
    animeId: Number(req.params.animeId),
    content: req.body.content,
  });

  const populatedComment = await comment.populate('user', 'username avatarUrl');

  res.status(201).json({
    success: true,
    comment: populatedComment,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this comment', 403);
  }

  comment.content = req.body.content;
  await comment.save();

  const populatedComment = await comment.populate('user', 'username avatarUrl');

  res.status(200).json({
    success: true,
    comment: populatedComment,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this comment', 403);
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Comment deleted',
  });
});

const toggleLikeComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const userId = req.user._id.toString();
  const alreadyLiked = comment.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
  } else {
    comment.likes.push(req.user._id);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    liked: !alreadyLiked,
    likesCount: comment.likes.length,
  });
});

module.exports = {
  getAnimeComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
};
