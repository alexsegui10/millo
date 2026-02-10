# OFM Agency Hub 🚀

**Production-Ready Instagram Management Platform for OnlyFans Model Agencies**

A comprehensive full-stack application for managing multiple Instagram accounts (niches) for OnlyFans models, with content scheduling, asset management, performance metrics, and analytics.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Functionality
- 🎭 **Model Management**: Track models, niches, and associated Instagram accounts
- 📸 **Asset Library**: Centralized image/video storage with tagging system
- 📱 **Content Scheduling**: Plan and schedule posts (Reels, Posts, Stories)
- 📊 **Analytics Dashboard**: Performance metrics, engagement rates, follower growth
- 💡 **Idea Bank**: Store and manage content ideas with status tracking
- 🔐 **Authentication**: JWT-based secure authentication with role-based access

### Production Features
- ✅ **Input Validation**: Zod schemas with sanitization (.trim() on all strings)
- ✅ **Security Headers**: Helmet protection against common vulnerabilities
- ✅ **Rate Limiting**: Anti-brute-force (5 auth/15min, 100 general/15min)
- ✅ **CORS Whitelist**: Environment-based origin control
- ✅ **Logging**: Winston logger with file rotation
- ✅ **Graceful Shutdown**: Clean database disconnection on SIGTERM/SIGINT
- ✅ **Health Check**: Robust endpoint with database connectivity test
- ✅ **Edge Case Handling**: Safe division, date validation, URL validation
- ✅ **Testing Infrastructure**: Jest + Supertest ready

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (implied)
- **State Management**: React Context/Hooks

---

## 📐 Architecture

```
proyecto/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Helper functions (metrics, validation)
│   └── package.json
│
├── server/               # Backend Express API
│   ├── src/
│   │   ├── routes/       # API endpoints (auth, models, niches, etc.)
│   │   ├── middleware/   # Custom middleware (auth, errorHandler)
│   │   ├── utils/        # Utilities (logger, validation, shutdown)
│   │   ├── config/       # Configuration constants
│   │   └── index.ts      # Application entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── logs/             # Winston log files
│   └── package.json
│
└── db/                   # Database utilities
    ├── schema.sql        # Raw SQL schema
    └── seed.sql          # Seed data
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (v20 recommended)
- **PostgreSQL**: v16+
- **npm**: v9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proyecto
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE ofm_agency_hub;"

   # Run migrations
   cd server
   npx prisma migrate dev

   # Generate Prisma Client
   npx prisma generate
   ```

5. **Run the application**

   **Option A: Automated (Windows)**
   ```bash
   .\setup_local.bat
   ```

   **Option B: Manual**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

7. **Default Login**
   - Email: `admin@ofmagency.com`
   - Password: `admin123`

---

## 🔐 Environment Variables

### Server `.env`

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `PORT` | Server port | 3000 | ❌ |
| `NODE_ENV` | Environment (development/production) | development | ❌ |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | - | ✅ |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 | ✅ |
| `LOG_LEVEL` | Winston log level (error/warn/info/debug) | info | ❌ |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (production) | - | Production only |

See [.env.example](server/.env.example) for full list with detailed descriptions.

### Client `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | http://localhost:3000 |

---

## 🗄️ Database

### Schema Overview

**Core Models:**
- `User` - System users with roles (ADMIN, MANAGER, VIEWER)
- `Model` - OnlyFans models with status tracking
- `Niche` - Instagram accounts linked to models
- `Asset` - Media library (images/videos) with tags
- `ContentPost` - Scheduled posts with type (REEL/POST/STORY)
- `PostMetric` - Performance metrics per post
- `AccountMetricsDaily` - Daily account-level analytics
- `Idea` - Content ideas with workflow status

### Key Relationships
- Model 1:N Niche (one model has many niches)
- Niche 1:N Asset (each niche has its own asset library)
- Niche 1:N ContentPost (posts belong to niches)
- ContentPost N:M Asset (posts can use multiple assets)

### Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Backup

```bash
# Backup
npm run db:dump

# Restore
npm run db:restore
```

---

## 📚 API Documentation

### Base URL
`http://localhost:3000`

### Authentication
All endpoints except `/auth/login` and `/health` require JWT bearer token:
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth
- `POST /auth/login` - Login (email, password)
- `GET /auth/me` - Get current user

#### Models
- `GET /models` - List all models
- `POST /models` - Create model
- `GET /models/:id` - Get model by ID
- `PATCH /models/:id` - Update model
- `DELETE /models/:id` - Delete model (cascades to niches)

#### Niches
- `GET /niches` - List niches (optional: `?modelId=<id>`)
- `POST /niches` - Create niche (requires: `modelId`)
- `GET /niches/:id` - Get niche by ID
- `PATCH /niches/:id` - Update niche
- `DELETE /niches/:id` - Delete niche (cascades to posts/assets)

#### Assets
- `GET /assets` - List assets (`?nicheId=<id>`, `?type=IMAGE|VIDEO`, `?tag=<tag>`, `?q=<search>`)
- `POST /assets` - Create asset (requires: `nicheId`, `type`, `url`)
- `GET /assets/:id` - Get asset by ID
- `PATCH /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

#### Posts
- `GET /posts` - List posts (`?nicheId=<id>`, `?status=DRAFT|SCHEDULED|POSTED`)
- `POST /posts` - Create post (requires: `nicheId`, `type`)
- `GET /posts/:id` - Get post with metrics
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

#### Metrics
- `POST /metrics/posts/:postId` - Upsert post metrics
- `POST /metrics/account/:nicheId` - Upsert account metrics
- `GET /metrics/posts/:postId` - Get post metrics history
- `GET /metrics/account/:nicheId` - Get account metrics history

#### Ideas
- `GET /ideas` - List ideas (`?nicheId=<id>`, `?status=NEW|IN_PROGRESS|COMPLETED|REJECTED`)
- `POST /ideas` - Create idea
- `PATCH /ideas/:id` - Update idea
- `DELETE /ideas/:id` - Delete idea

### Response Format

**Success:**
```json
{
  "ok": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "ok": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Rate Limits
- **Auth endpoints**: 5 requests / 15 minutes
- **General endpoints**: 100 requests / 15 minutes

---

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
server/src/
└── __tests__/
    ├── auth.test.ts
    ├── models.test.ts
    └── ...
```

### Coverage Goals
- **Target**: 70%+ overall
- **Critical paths**: 90%+ (auth, validation)

---

## 🚢 Deployment

### Build

```bash
# Backend
cd server
npm run build
# Output: ./dist/

# Frontend
cd client
npm run build
# Output: ./dist/
```

### Production Setup

1. **Environment Variables**
   - Set all required `.env` variables
   - Use strong `JWT_SECRET` (min 32 chars)
   - Set `ALLOWED_ORIGINS` to your frontend domain
   - Set `NODE_ENV=production`

2. **Database**
   - Run migrations: `npx prisma migrate deploy`
   - Backup before deployment: `npm run db:dump`

3. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL Certificate**
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Health Monitoring
- Health endpoint: `GET /health`
- Returns: database status, uptime, environment

---

## 🔒 Security Features

### Implemented Protections
- ✅ **Helmet**: Security headers (XSS, clickjacking, MIME sniffing)
- ✅ **Rate Limiting**: Brute-force protection
- ✅ **CORS**: Whitelist-based origin control
- ✅ **Input Validation**: Zod schemas with sanitization
- ✅ **Password Hashing**: bcrypt with 12 rounds
- ✅ **JWT Expiration**: 7-day token lifetime
- ✅ **SQL Injection**: Prisma parameterized queries
- ✅ **Request Logging**: Winston audit trail

### Security Best Practices
- Never commit `.env` files
- Rotate `JWT_SECRET` regularly
- Use HTTPS in production
- Enable PostgreSQL SSL connections
- Review Winston logs regularly
- Keep dependencies updated (`npm audit`)

---

## 📊 Validation Rules

### Conditional Validations
- `scheduledAt` REQUIRED when `status === 'SCHEDULED'`
- `scheduledAt` cannot be in the past
- `postedAt` cannot be in the future
- Metric `date` cannot be in the future

### Unique Constraints
- `User.email`
- `Niche.instagramHandle`
- `Asset(nicheId, url)` - prevents duplicate URLs per niche

### Input Sanitization
- All strings use `.trim()` to remove whitespace
- Instagram handles validated with regex: `/^[a-zA-Z0-9._]+$/`

---

## 📝 Scripts Reference

### Server Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Generate coverage report |
| `npm run seed` | Run TypeScript seed file |
| `npm run db:dump` | Backup database to `../db/backup.sql` |
| `npm run db:restore` | Restore from backup |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

### Code Style
- **TypeScript**: Strict mode enabled
- **Prettier**: Auto-formatting
- **ESLint**: Linting rules
- **Commit Convention**: Conventional Commits

---

## 📄 License

[Your License Here]

---

## 👥 Authors

**OFM Agency Team**

---

## 🙏 Acknowledgments

- React team for React 18
- Prisma team for excellent ORM
- Express.js community
- Tailwind CSS team

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Link]
- Email: support@ofmagency.com
- Documentation: [Link to detailed docs]

---

**Built with ❤️ for OnlyFans Model Management**
