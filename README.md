# API de Gestión de Productos - Backend

API RESTful construida con Express, TypeScript y PostgreSQL con autenticación JWT para la gestión de productos.

## Requisitos Previos

- Node.js 18+ y npm
- PostgreSQL 12+ instalado y ejecutándose

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

Crear un archivo `.env` en el directorio raíz con tu configuración:

**Para PostgreSQL local:**

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

**Para bases de datos cloud (Neon, Vercel Postgres, etc.):**

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos?sslmode=require
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://tu-dominio-frontend.com
```

> Nota: Cuando `DATABASE_URL` está configurado, tiene prioridad sobre las variables DB_* individuales.

## Configuración de Base de Datos

### Opción 1: PostgreSQL Local

1. **Crear Base de Datos:**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE products_db;
```

2. **Crear Tablas:**

```sql
-- Tabla de usuarios
CREATE TABLE users
(
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products
(
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)   NOT NULL,
  price      DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock      INTEGER        NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Crear Usuario Inicial** (Opcional):

Usar el endpoint `/api/auth/register` para crear tu primer usuario, o insertar directamente:

```sql
-- Nota: La contraseña es 'admin123' hasheada con bcrypt
INSERT INTO users (username, password)
VALUES ('admin', '$2b$10$TuHashDeContraseñaAquí');
```

### Opción 2: Base de Datos Cloud (Neon, Vercel Postgres)

1. Crear una base de datos PostgreSQL en tu proveedor cloud preferido
2. Ejecutar el esquema SQL anterior en la consola de tu base de datos cloud
3. Configurar la variable de entorno `DATABASE_URL` con tu cadena de conexión

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Ejecuta el servidor en modo desarrollo con hot reload usando ts-node-dev

### Compilar

```bash
npm run build
```

Compila TypeScript a JavaScript en la carpeta `dist`

### Producción

```bash
npm run build
npm start
```

Compila y ejecuta el código JavaScript compilado

### Build para Vercel

```bash
npm run vercel-build
```

Script especial de compilación usado por Vercel para deployment

## Endpoints de la API

### Autenticación

#### Registrar Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario123",
  "password": "contraseña123"
}
```

**Respuesta (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario123"
  }
}
```

#### Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Productos (Requiere Autenticación)

Todos los endpoints de productos requieren el token JWT en el header Authorization:

```
Authorization: Bearer <token>
```

#### Obtener Todos los Productos

```http
GET /api/products
```

**Respuesta (200):**

```json
[
  {
    "id": 1,
    "name": "Laptop HP Pavilion",
    "price": 899.99,
    "stock": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Crear Producto

```http
POST /api/products
Content-Type: application/json

{
  "name": "Nuevo Producto",
  "price": 99.99,
  "stock": 50
}
```

**Validaciones:**

- `name`: Requerido, string, máximo 100 caracteres
- `price`: Requerido, número positivo
- `stock`: Requerido, entero no negativo

**Respuesta (201):**

```json
{
  "id": 9,
  "name": "Nuevo Producto",
  "price": 99.99,
  "stock": 50,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar Stock de Producto

```http
PUT /api/products/:id/stock?stock=25
```

**Respuesta (200):**

```json
{
  "id": 1,
  "name": "Laptop HP Pavilion",
  "price": 899.99,
  "stock": 25,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Eliminar Producto

```http
DELETE /api/products/:id
```

**Respuesta (204):** Sin contenido

### Health Check

```http
GET /health
```

**Respuesta (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Respuestas de Error

### 400 Bad Request

```json
{
  "message": "Mensaje de error de validación"
}
```

### 401 Unauthorized

```json
{
  "message": "Token inválido o expirado"
}
```

### 404 Not Found

```json
{
  "message": "Producto no encontrado"
}
```

### 500 Internal Server Error

```json
{
  "message": "Error interno del servidor"
}
```

## Esquema de Base de Datos

### users

```sql
CREATE TABLE users
(
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255)        NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products

```sql
CREATE TABLE products
(
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)   NOT NULL,
  price      DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock      INTEGER        NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Probando la API

### Usando curl

1. **Iniciar sesión para obtener token:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

2. **Obtener todos los productos:**

```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

3. **Crear un producto:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"name":"Producto de Prueba","price":19.99,"stock":100}'
```

4. **Actualizar stock:**

```bash
curl -X PUT "http://localhost:3000/api/products/1/stock?stock=50" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Variables de Entorno

| Variable       | Descripción                            | Por Defecto | Requerido |
|----------------|----------------------------------------|-------------|-----------|
| PORT           | Puerto del servidor                    | 3000        | No        |
| NODE_ENV       | Entorno (development/production)       | development | No        |
| DATABASE_URL   | Cadena de conexión completa (cloud)    | -           | No*       |
| DB_HOST        | Host de la base de datos (local)       | localhost   | No*       |
| DB_PORT        | Puerto de la base de datos (local)     | 5432        | No*       |
| DB_NAME        | Nombre de la base de datos (local)     | products_db | No*       |
| DB_USER        | Usuario de la base de datos (local)    | postgres    | No*       |
| DB_PASSWORD    | Contraseña de la base de datos (local) | -           | No*       |
| JWT_SECRET     | Clave secreta para JWT                 | -           | **Sí**    |
| JWT_EXPIRES_IN | Tiempo de expiración del token         | 24h         | No        |
| CORS_ORIGIN    | Origen CORS permitido                  | *           | No        |

\* Se debe configurar o `DATABASE_URL` o todas las variables DB_* individuales
