import ApiError from '../utils/ApiError.js';

/**
 * Middleware de manejo centralizado de errores.
 * En Express 5, los errores de async handlers llegan aquí automáticamente.
 * Distingue errores operacionales (ApiError) de bugs reales.
 */
const errorHandler = (err, req, res, next) => {
  // JSON malformado en el body (express.json() parse error)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición',
    });
  }

  // Error de Mongoose: ID inválido
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID de recurso inválido',
    });
  }

  // Error de Mongoose: campo único duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `El ${field} ya está en uso`,
    });
  }

  // Error de Mongoose: validación de schema
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error de JWT inválido o expirado
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado, inicia sesión nuevamente',
    });
  }

  // Error operacional propio (ApiError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  // Bug real o error no esperado — no exponer detalles en producción
  console.error('ERROR NO CONTROLADO:', err.stack || err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Error interno del servidor',
  });
};

export default errorHandler;
