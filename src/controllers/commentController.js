import Comment from '../models/Comment.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get comments for a specific anime
// @route   GET /api/comments/anime/:animeId
// @access  Public
export const getAnimeComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ animeId: req.params.animeId })
      .populate({
        path: 'user',
        select: 'username avatar'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const comment = await Comment.create(req.body);
    
    // Populate user info before returning
    await comment.populate({
      path: 'user',
      select: 'username avatar'
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to update this comment`, 401));
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, { text: req.body.text }, {
      new: true,
      runValidators: true
    }).populate({
      path: 'user',
      select: 'username avatar'
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to delete this comment`, 401));
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle Like on a comment
// @route   PUT /api/comments/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
    }

    const userId = req.user.id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Remove like
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      // Add like
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      likesCount: comment.likes.length,
      likes: comment.likes
    });
  } catch (err) {
    next(err);
  }
};