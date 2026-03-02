import { Router } from 'express';
import { body } from 'express-validator';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoriteController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Todas las rutas de favoritos requieren autenticación
router.use(protect);

router.get('/', getFavorites);

router.get('/check/:animeId', checkFavorite);

router.post(
  '/',
  [
    body('animeId').isInt({ min: 1 }).withMessage('animeId debe ser un número válido'),
    body('animeTitle').trim().notEmpty().withMessage('El título del anime es requerido'),
    validate,
  ],
  addFavorite
);

router.delete('/:animeId', removeFavorite);

export default router;
