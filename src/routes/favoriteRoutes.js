import express from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All favorite routes require authentication
router.use(protect);

router.route('/')
  .get(getFavorites)
  .post(addFavorite);

router.get('/check/:animeId', checkFavorite);

router.route('/:id')
  .delete(removeFavorite);

export default router;
