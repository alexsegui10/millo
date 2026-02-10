import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            const res = await request('http://localhost:3000')
                .post('/auth/login')
                .send({ email: 'invalid@test.com', password: 'wrongpassword' });

            expect(res.status).toBe(401);
            expect(res.body.ok).toBe(false);
        });

        it('should return token for valid credentials', async () => {
            const res = await request('http://localhost:3000')
                .post('/auth/login')
                .send({ email: 'admin@ofmagency.com', password: 'admin123' });

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user).toHaveProperty('email');
        });
    });
});
