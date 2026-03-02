import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCommentsByAnime,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} from '../controllers/commentController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Obtener comentarios de un anime (público)
router.get('/:animeId', getCommentsByAnime);

// Rutas protegidas
router.post(
  '/',
  protect,
  [
    body('animeId').isInt({ min: 1 }).withMessage('animeId inválido'),
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('El comentario debe tener entre 1 y 1000 caracteres'),
    validate,
  ],
  createComment
);

router.put(
  '/:id',
  protect,
  [
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('El comentario debe tener entre 1 y 1000 caracteres'),
    validate,
  ],
  updateComment
);

router.delete('/:id', protect, deleteComment);

router.post('/:id/like', protect, toggleLike);

export default router;
