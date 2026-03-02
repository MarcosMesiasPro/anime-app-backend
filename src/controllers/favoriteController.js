import Favorite from '../models/Favorite.js';
import ApiError from '../utils/ApiError.js';

export const getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data: { favorites, total: favorites.length },
  });
};

export const addFavorite = async (req, res) => {
  const {
    animeId,
    animeTitle,
    animeCover,
    animeGenres,
    animeFormat,
    animeStatus,
    animeEpisodes,
    animeScore,
  } = req.body;

  const existing = await Favorite.findOne({ user: req.user._id, animeId });
  if (existing) {
    throw ApiError.conflict('Este anime ya está en tus favoritos');
  }

  const favorite = await Favorite.create({
    user: req.user._id,
    animeId,
    animeTitle,
    animeCover,
    animeGenres,
    animeFormat,
    animeStatus,
    animeEpisodes,
    animeScore,
  });

  res.status(201).json({
    success: true,
    message: 'Anime añadido a favoritos',
    data: { favorite },
  });
};

export const removeFavorite = async (req, res) => {
  const { animeId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    user: req.user._id,
    animeId: Number(animeId),
  });

  if (!favorite) {
    throw ApiError.notFound('Favorito no encontrado');
  }

  res.json({
    success: true,
    message: 'Anime eliminado de favoritos',
  });
};

export const checkFavorite = async (req, res) => {
  const { animeId } = req.params;

  const favorite = await Favorite.findOne({
    user: req.user._id,
    animeId: Number(animeId),
  });

  res.json({
    success: true,
    data: { isFavorite: !!favorite },
  });
};
