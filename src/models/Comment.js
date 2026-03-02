import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ID numérico del anime en AniList
    animeId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'El comentario no puede estar vacío'],
      trim: true,
      minlength: [1, 'El comentario es demasiado corto'],
      maxlength: [1000, 'El comentario no puede superar 1000 caracteres'],
    },
    // Array de IDs de usuarios que dieron like
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Índice para consultas rápidas de comentarios por anime
commentSchema.index({ animeId: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
