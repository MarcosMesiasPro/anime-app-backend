/**
 * Error operacional custom.
 * Distingue errores esperados (validación, auth, not found)
 * de bugs reales (errores de programación).
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // marca que es un error esperado, no un bug
  }

  static badRequest(msg, errors = []) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg = 'No autorizado') {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'Acceso denegado') {
    return new ApiError(403, msg);
  }

  static notFound(msg = 'Recurso no encontrado') {
    return new ApiError(404, msg);
  }

  static conflict(msg) {
    return new ApiError(409, msg);
  }

  static internal(msg = 'Error interno del servidor') {
    return new ApiError(500, msg);
  }
}

export default ApiError;
