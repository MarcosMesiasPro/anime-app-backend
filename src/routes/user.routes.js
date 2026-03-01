const express = require('express');

const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate.middleware');
const { mongoIdParamValidator, updateProfileValidator } = require('../validators/user.validator');

const router = express.Router();

router.get('/:id', mongoIdParamValidator, validateRequest, userController.getUserProfile);
router.patch('/me', protect, updateProfileValidator, validateRequest, userController.updateMyProfile);

module.exports = router;
