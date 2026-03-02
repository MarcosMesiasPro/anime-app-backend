import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Ejecuta express-validator y lanza ApiError si hay errores.
 * Se usa después de los validation chains en las rutas.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw ApiError.badRequest('Error de validación', messages);
  }
  next();
};

export default validate;
