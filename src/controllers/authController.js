import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    throw ApiError.conflict(`El ${field} ya está registrado`);
  }

  const user = await User.create({ username, email, password });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Cuenta creada correctamente',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // select: false en password, así que hay que pedirlo explícitamente
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Email o contraseña incorrectos');
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    message: 'Sesión iniciada correctamente',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    },
  });
};

export const getMe = async (req, res) => {
  // req.user ya viene del middleware protect (sin password)
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        bio: req.user.bio,
        createdAt: req.user.createdAt,
      },
    },
  });
};
