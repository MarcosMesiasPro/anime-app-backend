import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import sanitize from './src/middleware/sanitize.js';
import rateLimit from 'express-rate-limit';

import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/authRoutes.js';
import favoriteRoutes from './src/routes/favoriteRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Seguridad ─────────────────────────────────────────────────────────────
// Helmet: configura headers HTTP de seguridad (X-Frame-Options, CSP, etc.)
app.use(helmet());

// CORS: solo permite peticiones desde el frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting global: máx 100 peticiones por 15 minutos por IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas peticiones, intenta más tarde',
  },
});
app.use('/api', limiter);

// Rate limiting estricto para auth: 10 intentos por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta en 15 minutos',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── Parsers & utilidades ──────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));    // Limita payload a 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());                      // Comprime respuestas HTTP
app.use(sanitize);                           // Previene NoSQL injection

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

// ─── Rutas ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Ruta no encontrada — Express 5 usa /{*path} en lugar de *
app.use('/{*path}', (req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ─── Error handler (siempre al final) ─────────────────────────────────────
app.use(errorHandler);

// ─── Inicio del servidor ───────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV}`);
  });
};

start();
