const express = require('express');

const favoriteController = require('../controllers/favorite.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate.middleware');
const { createFavoriteValidator, favoriteIdParamValidator } = require('../validators/favorite.validator');

const router = express.Router();

router.use(protect);

router.get('/', favoriteController.getMyFavorites);
router.post('/', createFavoriteValidator, validateRequest, favoriteController.createFavorite);
router.delete('/:id', favoriteIdParamValidator, validateRequest, favoriteController.deleteFavorite);

module.exports = router;
