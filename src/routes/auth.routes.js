const express = require('express');

const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
