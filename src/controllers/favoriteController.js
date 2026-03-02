import Favorite from '../models/Favorite.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if anime is favorited by current user
// @route   GET /api/favorites/check/:animeId
// @access  Private
export const checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({ 
      user: req.user.id, 
      animeId: req.params.animeId 
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
      data: favorite || null
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const favorite = await Favorite.create(req.body);

    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return next(new ErrorResponse(`Favorite not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns the favorite
    if (favorite.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User not authorized to delete this favorite`, 401));
    }

    await favorite.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};