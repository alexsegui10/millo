import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Get credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ofmagency.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash,
            fullName: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log(`Admin user created/verified: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
