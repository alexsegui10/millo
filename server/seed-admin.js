const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                passwordHash: hashedPassword,
                fullName: 'Admin',
                role: 'ADMIN'
            }
        });

        console.log('✅ Usuario admin creado exitosamente');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Password: admin123');
        console.log('');
        console.log('Ahora puedes iniciar sesión en http://localhost:5173');
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('✅ Admin ya existe');
            console.log('📧 Email: admin@example.com');
            console.log('🔑 Password: admin123');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
