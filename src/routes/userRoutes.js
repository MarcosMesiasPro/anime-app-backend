import { Router } from 'express';
import { body } from 'express-validator';
import { getUserProfile, updateProfile } from '../controllers/userController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Perfil público por ID
router.get('/:id', getUserProfile);

// Editar propio perfil (protegido)
router.patch(
  '/profile',
  protect,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username debe tener entre 3 y 30 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username solo puede contener letras, números y _'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('La bio no puede superar 200 caracteres'),
    body('avatar')
      .optional()
      .trim()
      .isURL()
      .withMessage('El avatar debe ser una URL válida'),
    body('newPassword')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    validate,
  ],
  updateProfile
);

export default router;
