# Guía de Configuración de Neon PostgreSQL

## 🐘 ¿Qué es Neon?

Neon es una base de datos PostgreSQL **serverless** en la nube. Es perfecta para deployment porque:
- ✅ **3GB gratis** permanente
- ✅ **Sin tarjeta de crédito** requerida
- ✅ Configuración en **2 minutos**
- ✅ Compatible 100% con PostgreSQL
- ✅ Backups automáticos

---

## 📝 Pasos para Configurar Neon

### 1. Crear Cuenta en Neon

1. Ve a [https://neon.tech](https://neon.tech)
2. Haz clic en **"Sign Up"**
3. Regístrate con GitHub o Google (lo más rápido)
4. Acepta los términos

### 2. Crear Proyecto

1. Una vez dentro, haz clic en **"New Project"**
2. Configura:
   - **Name:** `millo-production`
   - **Region:** Elige el más cercano (ejemplo: `Europe (Frankfurt)`)
   - **PostgreSQL version:** 16 (la más reciente)
3. Haz clic en **"Create Project"**

### 3. Obtener Connection String

Neon te mostrará automáticamente tu **Connection String**. Se ve así:

```
postgresql://username:password@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANTE:** Copia esta URL completa y guárdala - la necesitarás para tu `.env` en producción.

### 4. Copiar Credenciales

En el Dashboard de Neon verás:
- **Host:** `ep-cool-name-123456.eu-central-1.aws.neon.tech`
- **Database:** `neondb`
- **Username:** `username`
- **Password:** `*********` (haz clic en el ojo para verla)

### 5. Configurar en tu Aplicación (para deployment)

Cuando despliegues tu backend, configurarás la variable de entorno:

```env
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🚀 Migrar tu Base de Datos Local a Neon

### Opción 1: Usar Prisma Migrate (Recomendado)

Una vez tengas tu connection string de Neon:

```bash
# En tu .env de producción o temporalmente en local
DATABASE_URL=<tu_neon_connection_string>

# Correr migraciones
cd server
npx prisma migrate deploy

# Opcional: Seed con datos iniciales
npx prisma db seed
```

### Opción 2: Exportar/Importar Datos

Si ya tienes datos en local que quieres migrar:

```bash
# 1. Exportar desde PostgreSQL local
pg_dump -U postgres ofm_agency_hub > backup.sql

# 2. Importar a Neon
psql "<tu_neon_connection_string>" < backup.sql
```

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

1. **NUNCA** subas tu `DATABASE_URL` a GitHub
2. Usa variables de entorno en tu plataforma de deployment
3. La conexión a Neon siempre usa **SSL** (segura)

### Configurar en Deployment

**Vercel/Netlify (Frontend):**
- No necesitan acceso a la DB

**Railway/Render (Backend):**
1. Ve a configuración del proyecto
2. Añade variable de entorno:
   - **Name:** `DATABASE_URL`
   - **Value:** `<tu_neon_connection_string>`
3. Deploy automático se reiniciará con la nueva configuración

---

## 📊 Límites del Plan Gratuito

- **Almacenamiento:** 3GB
- **Compute:** 191.9 horas/mes (suficiente para proyectos pequeños)
- **Branches:** Ilimitadas (para testing)
- **Backups:** 7 días de retención

**Para proyectos de OnlyFans management:** 3GB es más que suficiente para miles de posts, modelos, ideas y métricas.

---

## 🎯 Alternativas a Neon

Si por alguna razón Neon no te funciona:

### Railway
- $5 crédito mensual gratis
- Incluye PostgreSQL + hosting del backend
- [railway.app](https://railway.app)

### Supabase
- 500MB gratis
- Incluye auth, storage, funciones
- [supabase.com](https://supabase.com)

### Render
- 90 días gratis de PostgreSQL
- Luego $7/mes
- [render.com](https://render.com)

---

## 🐛 Problemas Comunes

### "Connection timeout"
- Verifica que la URL tenga `?sslmode=require` al final
- Asegúrate de tener internet estable

### "Authentication failed"
- Verifica username y password
- Regenera la password desde el Dashboard de Neon

### "Database does not exist"
- Asegúrate de usar el nombre correcto: `neondb`
- O crea una nueva base de datos en el Dashboard

---

## ✅ Verificación

Para verificar que todo funciona:

```bash
# Instala psql si no lo tienes
# Windows: https://www.postgresql.org/download/windows/

# Conéctate a Neon
psql "<tu_neon_connection_string>"

# Si conecta, deberías ver:
neondb=>

# Lista las tablas
\dt

# Sal
\q
```

---

## 📝 Próximos Pasos

Una vez tengas tu Neon configurado:

1. ✅ Guarda tu `DATABASE_URL` en un lugar seguro
2. ✅ Configúrala en tu plataforma de deployment
3. ✅ Corre las migraciones: `npx prisma migrate deploy`
4. ✅ Tu app en producción estará conectada a Neon

---

**¿Listo?** Crea tu cuenta en [neon.tech](https://neon.tech) y copia tu connection string. Luego continuamos con el deployment completo.
