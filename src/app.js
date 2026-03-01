const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const hpp = require('hpp');

const env = require('./config/env');
const apiLimiter = require('./middlewares/rateLimiter.middleware');
const sanitizeRequest = require('./middlewares/sanitize.middleware');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeRequest);
app.use(hpp());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api', apiLimiter);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
