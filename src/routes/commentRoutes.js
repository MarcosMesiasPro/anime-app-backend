import express from 'express';
import { getAnimeComments, addComment, updateComment, deleteComment, toggleLike } from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to get comments for an anime
router.get('/anime/:animeId', getAnimeComments);

// Protected routes
router.post('/', protect, addComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.put('/:id/like', protect, toggleLike);

export default router;
