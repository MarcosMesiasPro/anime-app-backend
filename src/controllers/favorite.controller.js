const Favorite = require('../models/favorite.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getMyFavorites = catchAsync(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: favorites.length,
    favorites,
  });
});

const createFavorite = catchAsync(async (req, res) => {
  const favorite = await Favorite.create({
    user: req.user._id,
    animeId: req.body.animeId,
    title: req.body.title,
    coverImage: req.body.coverImage || '',
  });

  res.status(201).json({
    success: true,
    favorite,
  });
});

const deleteFavorite = catchAsync(async (req, res) => {
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite) {
    throw new AppError('Favorite not found', 404);
  }

  if (favorite.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this favorite', 403);
  }

  await favorite.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Favorite deleted',
  });
});

module.exports = {
  getMyFavorites,
  createFavorite,
  deleteFavorite,
};
