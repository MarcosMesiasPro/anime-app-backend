# Anime App Backend

Production-ready REST API for an anime fullstack app.

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- express-validator
- Security hardening: helmet, rate limiting, sanitize, hpp, CORS

## Features

- Auth: register, login, current user (`/auth/me`)
- User profiles: public profile + edit own profile
- Favorites: add/list/remove anime favorites
- Comments: CRUD + like/unlike
- Centralized error handling with operational errors
- Input validation and request sanitization

## Project Structure

```txt
src/
  app.js
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  utils/
  validators/
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Required variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/anime_app
JWT_SECRET=replace_with_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 3) Run the API

```bash
npm run dev
```

Health check:

```bash
GET http://localhost:5000/api/health
```

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start in production mode
- `npm test` - placeholder test script

## API Routes

Base URL: `/api`

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (private)

### Users

- `GET /users/:id`
- `PATCH /users/me` (private)

### Favorites (private)

- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/:id`

### Comments

- `GET /comments/anime/:animeId`
- `POST /comments/anime/:animeId` (private)
- `PATCH /comments/:id` (private, owner)
- `DELETE /comments/:id` (private, owner)
- `POST /comments/:id/like` (private)

## Postman

Collection and environment are included in:

- `postman/anime-app-backend.postman_collection.json`
- `postman/anime-app-backend.local.postman_environment.json`

## Deployment

- Recommended: Railway
- Set all `.env` variables in Railway service settings
