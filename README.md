# Millo - OFM Agency Hub

Aplicación completa para gestionar modelos de OnlyFans, nichos, contenido multimedia, ideas y métricas.

## 🚀 Stack Tecnológico

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express + Prisma + PostgreSQL
- **Autenticación:** JWT
- **Almacenamiento:** Google Drive API (opcional) / Local
- **Estilos:** CSS personalizado con tema oscuro

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/alexsegui10/millo.git
cd millo
```

### 2. Configurar e Instalar

```powershell
.\setup_local.bat
```

Este script:
- Instala dependencias del frontend y backend
- Crea el archivo `.env` si no existe
- Configura la base de datos con Prisma
- Crea un usuario admin por defecto

### 3. Iniciar la Aplicación

```powershell
.\start_app.bat
```

Esto iniciará:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### 4. Acceder

- **Usuario:** admin@example.com
- **Contraseña:** admin123

## ☁️ Configuración de Google Drive (Opcional)

Para almacenar imágenes y videos en Google Drive sin perder calidad:

1. Sigue las instrucciones en [`server/GOOGLE_DRIVE_SETUP.md`](server/GOOGLE_DRIVE_SETUP.md)
2. Coloca tu archivo `google-credentials.json` en `server/`
3. Configura `GOOGLE_DRIVE_FOLDER_ID` en `server/.env`

**Sin configurar Google Drive:** Los archivos se guardarán localmente en `server/uploads/`

## 📁 Estructura del Proyecto

```
millo/
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── lib/                # API client y utilidades
│   │   └── types/              # Definiciones TypeScript
│   └── package.json
│
├── server/                     # Backend Express
│   ├── src/
│   │   ├── routes/             # Rutas de la API
│   │   ├── middleware/         # Auth, upload, etc.
│   │   ├── services/           # Google Drive, etc.
│   │   └── utils/              # Validación, logger
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de base de datos
│   ├── uploads/                # Archivos subidos (si no usas Drive)
│   ├── GOOGLE_DRIVE_SETUP.md   # Guía de configuración Drive
│   └── package.json
│
├── .gitignore
├── setup_local.bat             # Script de instalación
├── start_app.bat               # Script para iniciar
└── README.md                   # Este archivo
```

## ✨ Funcionalidades

### 🎭 Modelos
- Crear, editar y eliminar modelos
- Estados: ACTIVE, PENDING, PAUSED, ARCHIVED
- Gestión de nichos asociados

### 📂 Nichos
- Múltiples nichos por modelo
- Instagram handle y biografía
- Tabs: Assets, Posts, Ideas, Métricas

### 📸 Assets (Multimedia)
- Subir imágenes y videos
- Almacenamiento en **Google Drive** (calidad original) o local
- Tags y notas para organizar
- Filtros y búsqueda
- Selector visual para posts

### 📝 Posts
- Vista de tarjetas visuales
- Tipos: REEL, POST, STORY
- Estados: DRAFT, SCHEDULED, POSTED
- Asociar múltiples assets
- Descripción y planificación

### 💡 Ideas
- Capturar ideas de contenido
- Estados: NEW, IN_PROGRESS, COMPLETED, REJECTED
- Notas y descripción

### 📊 Métricas
- **Métricas de cuenta:** Seguidores, alcance, impresiones diarias
- **Métricas por post:** Views, likes, comments, shares, saves
- KPIs y tendencias

## 🌐 Despliegue

### Backend (Heroku, Railway, etc.)

1. Configura las variables de entorno en tu plataforma
2. Sube `google-credentials.json` como secret file (si usas Drive)
3. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate deploy
   ```

### Frontend (Vercel, Netlify, etc.)

1. Configura la variable `VITE_API_URL` apuntando a tu backend
2. Build automático con `npm run build`

## 🔐 Seguridad

- JWT para autenticación
- Contraseñas hasheadas con bcrypt
- CORS configurado
- Rate limiting
- Helmet para headers de seguridad
- Credenciales de Google Drive fuera de git

## 📝 Variables de Entorno

### Backend (`server/.env`)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-secreto-muy-seguro-min-32-chars
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info

# Google Drive (opcional)
GOOGLE_DRIVE_FOLDER_ID=tu_folder_id_de_drive
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar frontend
cd server && npm run dev # Iniciar backend

# Base de datos
cd server
npx prisma studio        # Abrir interfaz visual de DB
npx prisma migrate dev   # Crear nueva migración
npx prisma generate      # Regenerar Prisma Client

# Build
npm run build           # Build frontend
cd server && npm run build  # Build backend
```

## 📚 Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Backend:** Express, Prisma ORM, PostgreSQL
- **Autenticación:** JWT, bcrypt
- **Validación:** Zod
- **Cloud Storage:** Google Drive API
- **Upload:** Multer
- **Logging:** Winston
- **Seguridad:** Helmet, CORS, express-rate-limit

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👤 Autor

**Alex Seguí**
- GitHub: [@alexsegui10](https://github.com/alexsegui10)

## 🙏 Agradecimientos

Proyecto creado para gestionar contenido de modelos de OnlyFans de manera profesional y organizada.

---

**¡Hecho con ❤️ para Millo!**
