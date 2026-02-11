const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        console.log('🔄 Generando nuevo hash para "admin123"...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log('🔑 Nuevo hash generado:', hashedPassword);

        console.log('💾 Actualizando usuario admin@example.com...');
        const user = await prisma.user.update({
            where: { email: 'admin@example.com' },
            data: {
                passwordHash: hashedPassword
            }
        });

        console.log('✅ Password actualizado correctamente!');
        console.log('👤 Usuario:', user.fullName);
        console.log('📧 Email:', user.email);
        console.log('🔑 Password:', 'admin123');

    } catch (error) {
        console.error('❌ Error actualizando password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
