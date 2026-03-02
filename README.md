# AnimeTrack — Backend API

RESTful API para una aplicación fullstack de seguimiento de anime. Construida con Node.js, Express 5 y MongoDB Atlas.

## Características

- **Autenticación JWT** — registro, login, sesión persistente con token
- **Favoritos** — CRUD completo, índice único por usuario/anime
- **Comentarios** — creación, edición, eliminación y sistema de likes por toggle
- **Perfiles de usuario** — vista pública y edición propia con cambio de contraseña
- **Rate limiting** — límite global + límite estricto en endpoints de autenticación
- **Sanitización NoSQL** — middleware custom compatible con Express 5
- **Validación de inputs** — `express-validator` en todas las rutas
- **Manejo de errores profesional** — clase `ApiError`, error handler centralizado

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express | 5.2 | Framework HTTP |
| MongoDB Atlas | — | Base de datos en la nube |
| Mongoose | 9.2 | ODM |
| JSON Web Token | 9.0 | Autenticación stateless |
| bcryptjs | 3.0 | Hash de contraseñas (salt 12) |
| express-rate-limit | 8.2 | Rate limiting por IP |
| express-validator | 7.3 | Validación y sanitización |
| helmet | 8.1 | Headers HTTP de seguridad |
| compression | 1.8 | Compresión de respuestas |
| morgan | 1.10 | Logging de requests |

## Instalación local

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd anime-app-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Iniciar en modo desarrollo (con nodemon)
npm run dev

# La API estará disponible en http://localhost:5000
```

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas — crea tu cluster gratis en https://cloud.mongodb.com
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/anime-app

# JWT — genera un secreto seguro con:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=tu_secreto_muy_largo_y_aleatorio_aqui
JWT_EXPIRES_IN=7d

# URL del frontend (para CORS)
CLIENT_URL=http://localhost:5173

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000   # ventana de 15 minutos en ms
RATE_LIMIT_MAX=100            # máx. peticiones por ventana por IP
```

## Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Crear cuenta nueva | — |
| `POST` | `/api/auth/login` | Iniciar sesión | — |
| `GET` | `/api/auth/me` | Obtener usuario autenticado | 🔒 |

### Favoritos

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/favorites` | Listar favoritos del usuario | 🔒 |
| `POST` | `/api/favorites` | Añadir anime a favoritos | 🔒 |
| `DELETE` | `/api/favorites/:animeId` | Eliminar favorito | 🔒 |
| `GET` | `/api/favorites/check/:animeId` | Verificar si un anime es favorito | 🔒 |

### Comentarios

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/comments/:animeId` | Obtener comentarios de un anime (paginado) | — |
| `POST` | `/api/comments` | Crear comentario | 🔒 |
| `PUT` | `/api/comments/:id` | Editar comentario propio | 🔒 |
| `DELETE` | `/api/comments/:id` | Eliminar comentario propio | 🔒 |
| `POST` | `/api/comments/:id/like` | Toggle like en un comentario | 🔒 |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/users/:id` | Ver perfil público de un usuario | — |
| `PATCH` | `/api/users/profile` | Editar perfil propio | 🔒 |

### Health check

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado de la API |

> **🔒 Autenticación:** Incluir header `Authorization: Bearer <token>` en las peticiones protegidas.

### Formato de respuestas

Todas las respuestas siguen un formato consistente:

```json
// Éxito
{
  "success": true,
  "message": "Descripción del resultado",
  "data": { "..." }
}

// Error
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["detalle1", "detalle2"]
}
```

### Ejemplo rápido

```bash
# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"otaku99","email":"otaku@email.com","password":"password123"}'

# Login y obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"otaku@email.com","password":"password123"}'

# Añadir favorito (con token)
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"animeId":1,"animeTitle":"Cowboy Bebop","animeGenres":["Action"]}'
```

## Estructura del proyecto

```
anime-app-backend/
├── server.js                    # Entry point — middleware + rutas + inicio del servidor
├── src/
│   ├── config/
│   │   └── db.js                # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js    # Register, login, getMe
│   │   ├── commentController.js # CRUD comentarios + likes
│   │   ├── favoriteController.js# CRUD favoritos + check
│   │   └── userController.js    # Ver perfil público + editar propio
│   ├── middleware/
│   │   ├── auth.js              # Verificación y decodificación del JWT
│   │   ├── errorHandler.js      # Manejo centralizado de todos los errores
│   │   ├── sanitize.js          # Prevención de NoSQL injection (compatible Express 5)
│   │   └── validate.js          # Wrapper de express-validator → ApiError
│   ├── models/
│   │   ├── Comment.js           # Schema: contenido, likes[], índice por animeId
│   │   ├── Favorite.js          # Schema: datos del anime, índice único user+animeId
│   │   └── User.js              # Schema: username, email, password (select:false), avatar, bio
│   ├── routes/
│   │   ├── authRoutes.js        # POST /register, POST /login, GET /me
│   │   ├── commentRoutes.js     # CRUD + /like
│   │   ├── favoriteRoutes.js    # CRUD + /check/:animeId
│   │   └── userRoutes.js        # GET /:id, PATCH /profile
│   └── utils/
│       └── ApiError.js          # Clase de errores operacionales con factory methods
├── .env.example                 # Plantilla de variables de entorno
└── package.json
```

## Deploy en Railway

1. Crear un nuevo proyecto en [Railway](https://railway.app)
2. Conectar el repositorio de GitHub (seleccionar la carpeta `anime-app-backend`)
3. Añadir las variables de entorno en el dashboard de Railway
4. Railway detecta automáticamente Node.js y ejecuta `npm start`

**Variables requeridas en producción:**

```env
NODE_ENV=production
PORT=5000
MONGO_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_secreto_jwt_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=https://tu-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Seguridad

| Medida | Implementación |
|---|---|
| Headers HTTP seguros | `helmet` — X-Frame-Options, CSP, HSTS, etc. |
| CORS restringido | Solo el origen definido en `CLIENT_URL` |
| Rate limiting | 100 req/15min global · 10 req/15min en `/auth/login` y `/auth/register` |
| NoSQL Injection | Middleware custom elimina claves con `$` y `.` del body |
| Hash de contraseñas | bcrypt salt rounds 12 |
| Password oculto | Campo `password` con `select: false` en Mongoose |
| Validación completa | Todos los inputs validados antes de llegar a los controllers |
| Payload limitado | Máximo 10kb por request |

## Notas de compatibilidad

Este proyecto usa **Express 5** (versión más reciente, estable). Algunas dependencias populares tienen problemas de compatibilidad:

- `express-mongo-sanitize` v2 — **incompatible** con Express 5 (intenta sobreescribir `req.query` que es read-only). Reemplazado por middleware propio en `src/middleware/sanitize.js`.
- `Mongoose v9` — Los hooks `pre('save', async function)` **no reciben** el parámetro `next`. La función async debe resolverse sola sin llamar a `next()`.
- Rutas comodín — En Express 5 se usa `/{*path}` en lugar de `*`.
