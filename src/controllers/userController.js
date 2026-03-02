import User from '../models/User.js';
import Favorite from '../models/Favorite.js';
import Comment from '../models/Comment.js';
import ApiError from '../utils/ApiError.js';

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw ApiError.notFound('Usuario no encontrado');
  }

  const [favoriteCount, commentCount] = await Promise.all([
    Favorite.countDocuments({ user: id }),
    Comment.countDocuments({ user: id }),
  ]);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        favoriteCount,
        commentCount,
        createdAt: user.createdAt,
      },
    },
  });
};

export const updateProfile = async (req, res) => {
  const { username, bio, avatar, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Cambio de contraseña: requiere la actual
  if (newPassword) {
    if (!currentPassword) {
      throw ApiError.badRequest('Debes proporcionar tu contraseña actual');
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.unauthorized('Contraseña actual incorrecta');
    }
    user.password = newPassword;
  }

  if (username !== undefined) user.username = username;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({
    success: true,
    message: 'Perfil actualizado correctamente',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    },
  });
};
