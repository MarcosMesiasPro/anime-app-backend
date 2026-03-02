/**
 * Sanitizador NoSQL custom compatible con Express 5.
 * express-mongo-sanitize v2 intenta sobreescribir req.query
 * que en Express 5 es un getter de solo lectura (falla).
 *
 * Elimina claves que empiecen por $ o contengan . del body,
 * que son los vectores de NoSQL injection en MongoDB.
 */
const sanitizeObj = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      sanitizeObj(obj[key]);
    }
  }
  return obj;
};

const sanitize = (req, res, next) => {
  if (req.body) sanitizeObj(req.body);
  next();
};

export default sanitize;
