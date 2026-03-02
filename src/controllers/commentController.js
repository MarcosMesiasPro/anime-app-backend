import Comment from '../models/Comment.js';
import ApiError from '../utils/ApiError.js';

export const getCommentsByAnime = async (req, res) => {
  const { animeId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ animeId: Number(animeId) })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ animeId: Number(animeId) }),
  ]);

  res.json({
    success: true,
    data: {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const createComment = async (req, res) => {
  const { animeId, content } = req.body;

  const comment = await Comment.create({
    user: req.user._id,
    animeId,
    content,
  });

  // Popular el usuario para devolver datos completos
  await comment.populate('user', 'username avatar');

  res.status(201).json({
    success: true,
    message: 'Comentario publicado',
    data: { comment },
  });
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw ApiError.notFound('Comentario no encontrado');
  }

  // Solo el autor puede editar
  if (comment.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('No puedes editar este comentario');
  }

  comment.content = content;
  await comment.save();
  await comment.populate('user', 'username avatar');

  res.json({
    success: true,
    message: 'Comentario actualizado',
    data: { comment },
  });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw ApiError.notFound('Comentario no encontrado');
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('No puedes eliminar este comentario');
  }

  await comment.deleteOne();

  res.json({
    success: true,
    message: 'Comentario eliminado',
  });
};

export const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw ApiError.notFound('Comentario no encontrado');
  }

  const alreadyLiked = comment.likes.includes(userId);

  if (alreadyLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  res.json({
    success: true,
    data: {
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    },
  });
};
