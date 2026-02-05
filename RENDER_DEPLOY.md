# Render Deployment - Cognitive Training Game

Este proyecto está configurado para desplegar automáticamente en Render usando el archivo `render.yaml`.

## 🚀 Pasos para Desplegar

### Opción 1: Despliegue con Blueprint (Recomendado)

1. **Sube tu código a GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Configure for Render deployment with PostgreSQL"
   git push origin main
   ```

2. **En Render Dashboard:**
   - Ve a [dashboard.render.com](https://dashboard.render.com)
   - Click en **"New +"** → **"Blueprint"**
   - Conecta tu repositorio
   - Render detectará automáticamente el archivo `render.yaml`
   - Click en **"Apply"**

3. **¡Listo!** Render creará automáticamente:
   - Base de datos PostgreSQL (`cognitive-game-db`)
   - Backend API (`cognitive-game-api`)
   - Frontend estático (`cognitive-game`)

### Opción 2: Despliegue Manual

Si prefieres configurar manualmente:

#### 1. Crear Base de Datos PostgreSQL
- New → PostgreSQL
- Name: `cognitive-game-db`
- Plan: Free

#### 2. Crear Backend (Web Service)
- New → Web Service
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  PORT=10000
  JWT_SECRET=[genera uno aleatorio]
  JWT_EXPIRES_IN=7d
  DATABASE_URL=[copia desde PostgreSQL Internal URL]
  CORS_ORIGIN=https://[tu-frontend].onrender.com
  ```

#### 3. Crear Frontend (Static Site)
- New → Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables:
  ```
  VITE_API_URL=https://[tu-backend].onrender.com
  ```

## 📋 URLs Finales

Después del despliegue tendrás:
- **Frontend**: `https://cognitive-game.onrender.com`
- **Backend API**: `https://cognitive-game-api.onrender.com`
- **Health Check**: `https://cognitive-game-api.onrender.com/api/health`

## ⚠️ Notas Importantes

1. **El plan gratuito de Render** "duerme" los servicios después de 15 minutos de inactividad. La primera solicitud puede tardar ~30 segundos.

2. **La base de datos gratuita** se elimina después de 90 días. Para producción real, considera el plan pagado.

3. **Variables de entorno sensibles** (como `JWT_SECRET`) se generan automáticamente con el Blueprint.

## 🔧 Desarrollo Local

Para desarrollo local con PostgreSQL:

1. Instala PostgreSQL localmente o usa Docker:
   ```bash
   docker run --name cognitive-pg -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cognitive_game -p 5432:5432 -d postgres
   ```

2. Crea el archivo `.env` en `/server`:
   ```bash
   cp .env.example .env
   ```

3. Edita `.env` con tus credenciales locales:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/cognitive_game
   ```

4. Instala dependencias e inicia:
   ```bash
   cd server
   npm install
   npm run dev
   ```
