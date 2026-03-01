const mongoSanitize = require('express-mongo-sanitize');

const sanitizeRequest = (req, res, next) => {
  ['body', 'params', 'query'].forEach((key) => {
    if (req[key] && typeof req[key] === 'object') {
      mongoSanitize.sanitize(req[key], { replaceWith: '_' });
    }
  });

  next();
};

module.exports = sanitizeRequest;
