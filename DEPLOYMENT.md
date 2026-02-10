# Deployment Checklist ✅

## Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Coverage ≥ 70% (`npm run test:coverage`)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No ESLint warnings
- [ ] Prisma schema synchronized with DB (`npx prisma migrate status`)
- [ ] `.env.example` updated with all variables
- [ ] Seed data works (`npm run seed`)
- [ ] Health check returns 200 (`curl /health`)

## Security Checklist

- [ ] `JWT_SECRET` is strong (min 32 chars, random)
- [ ] `ALLOWED_ORIGINS` configured for production domains
- [ ] `NODE_ENV=production` set
- [ ] Database uses SSL connection
- [ ] All sensitive env vars in `.env.production` (not committed)
- [ ] Rate limiting enabled (verify in logs)
- [ ] Helmet headers active (check response headers)
- [ ] CORS whitelist tested
- [ ] Login brute-force protection tested (5 attempts limit)

## Database

- [ ] Backup created (`npm run db:dump`)
- [ ] Migrations applied (`npx prisma migrate deploy`)
- [ ] Database password is strong
- [ ] Connection pooling configured
- [ ] Database accessible from production server

## Build

- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (`cd client && npm run build`)
- [ ] Static files served correctly
- [ ] Environment variables loaded

## Deployment

- [ ] PM2 ecosystem.config.js configured
- [ ] Server started with PM2 (`pm2 start ecosystem.config.js`)
- [ ] PM2 auto-restart on crash enabled
- [ ] PM2 startup script enabled (`pm2 startup`)
- [ ] Logs directory exists and writable (`mkdir -p logs`)
- [ ] Nginx/reverse proxy configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] DNS records point to server

## Post-Deployment Verification

- [ ] Health check returns 200 with `"database": "connected"`
- [ ] Login works with test credentials
- [ ] Create/Read/Update/Delete operations work for all resources
- [ ] Rate limiting triggers after threshold
- [ ] Logs being written to `logs/combined.log`
- [ ] Error logs being written to `logs/error.log`
- [ ] Graceful shutdown works (`kill -SIGTERM <pid>`)

## Monitoring

- [ ] Health check monitoring setup (e.g., UptimeRobot)
- [ ] Error alerting configured
- [ ] Log rotation enabled (Winston auto-rotates)
- [ ] Database backup automation scheduled
- [ ] PM2 monitoring dashboard accessible

## Documentation

- [ ] README.md up to date
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

---

## Quick Deploy Commands

```bash
# 1. Build
npm run build

# 2. Apply migrations
npx prisma migrate deploy

# 3. Start with PM2
pm2 start ecosystem.config.js
pm2 save

# 4. Setup auto-restart on server reboot
pm2 startup

# 5. Check status
pm2 status
pm2 logs ofm-agency-hub

# 6. Monitor
pm2 monit
```

## Rollback Plan

```bash
# 1. Stop current version
pm2 stop ofm-agency-hub

# 2. Restore database backup
npm run db:restore

# 3. Checkout previous version
git checkout <previous-commit>

# 4. Rebuild
npm run build

# 5. Restart
pm2 restart ofm-agency-hub
```
