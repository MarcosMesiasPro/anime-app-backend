# Anime App Backend 🚀

Este es el backend de una aplicación Fullstack de tracking de Anime. Provee una API RESTful construida con **Node.js, Express y MongoDB**, diseñada para ser consumida por un frontend en React (o cualquier cliente HTTP) y está preparada para integrarse indirectamente con la API GraphQL de AniList.

## Características Principales ✨

- **Autenticación Segura (JWT):** Sistema de registro, login y logout manejando los tokens mediante cookies `httpOnly` para prevenir ataques XSS.
- **Seguridad Robusta:** Implementación de cabeceras seguras (`helmet`), limitación de peticiones (`express-rate-limit`), y prevención contra inyección NoSQL (`express-mongo-sanitize`) y XSS.
- **Gestión de Perfiles de Usuario:** Los usuarios pueden visualizar y editar su biografía y avatar.
- **Sistema de Favoritos:** CRUD de favoritos permitiendo a los usuarios guardar animes (usando el `animeId` proveniente de AniList) evitando duplicados mediante índices compuestos en MongoDB.
- **Sistema de Comentarios:** Los usuarios pueden comentar en diferentes animes (CRUD completo) y dar/quitar "Likes" a los comentarios de otros.
- **Manejo de Errores Global:** Respuestas consistentes y estandarizadas de errores, interceptando fallos de Mongoose (campos duplicados, errores de cast) y de JWT.

## Tecnologías Utilizadas 🛠️

- **Entorno:** Node.js, Express 5.x
- **Base de Datos:** MongoDB (Mongoose ODM)
- **Seguridad:** jsonwebtoken, bcryptjs, helmet, cors, express-rate-limit
- **Desarrollo:** Nodemon, Morgan, dotenv (Sintaxis ES Modules)

## Requisitos Previos 📋

- [Node.js](https://nodejs.org/) (Versión 18+ recomendada)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o una base de datos MongoDB local)

## Instalación y Configuración ⚙️

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MarcosMesiasPro/anime-app-backend.git
   cd anime-app-backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_secreto_jwt_muy_seguro
   JWT_EXPIRES_IN=30d
   CLIENT_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   ```

4. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor debería iniciar en el puerto 5000 y mostrar "MongoDB Connected".*

## Estructura de la API (Endpoints Principales) 🛣️

### Autenticación (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión (establece cookie JWT)
- `POST /logout` - Cerrar sesión (limpia cookie)
- `GET /me` - Obtener perfil del usuario actual (Privado)
- `PUT /profile` - Actualizar perfil del usuario (Privado)

### Favoritos (`/api/favorites`)
*Todas las rutas requieren autenticación.*
- `GET /` - Obtener todos los favoritos del usuario
- `POST /` - Añadir un anime a favoritos
- `GET /check/:animeId` - Verificar si un anime ya es favorito
- `DELETE /:id` - Eliminar un favorito

### Comentarios (`/api/comments`)
- `GET /anime/:animeId` - Obtener comentarios de un anime (Público)
- `POST /` - Crear un comentario (Privado)
- `PUT /:id` - Actualizar un comentario propio (Privado)
- `DELETE /:id` - Eliminar un comentario propio (Privado)
- `PUT /:id/like` - Dar/Quitar "like" a un comentario (Privado)

## Despliegue 🚀
Este proyecto está configurado para ser desplegado fácilmente en plataformas como **Railway** o **Render**. El comando predeterminado de inicio está configurado en el `package.json` como:
```bash
npm start
```
Asegúrate de configurar las Variables de Entorno en el panel de control del servicio de hosting.