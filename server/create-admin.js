const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    // Generate fresh hash for "admin123"
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    console.log('🔐 Generated hash for password "admin123":', hash);

    // Update user with new hash
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@ofmagency.com' },
        update: {
            passwordHash: hash,
        },
        create: {
            email: 'admin@ofmagency.com',
            passwordHash: hash,
        },
    });

    console.log('✅ Admin user updated:', adminUser.email);
    console.log('');
    console.log('==========================================');
    console.log('  LOGIN CREDENTIALS:');
    console.log('  Email: admin@ofmagency.com');
    console.log('  Password: admin123');
    console.log('==========================================');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
