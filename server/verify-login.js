const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Using bcryptjs as in seed, just to check hash validity first
// We can also try requiring 'bcrypt' if we want to confirm the native module works.

const prisma = new PrismaClient();

async function verifyLogin() {
    console.log('🔍 Verificando usuario admin...');

    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });

        if (!user) {
            console.error('❌ Usuario admin no encontrado en la base de datos.');
            console.log('Database URL:', process.env.DATABASE_URL); // Be careful not to expose mostly, but here we need to know.
            return;
        }

        console.log('✅ Usuario encontrado:', user.email);
        console.log('🔑 Hash almacenado:', user.passwordHash);

        const password = 'admin123';
        console.log('🔄 Intentando comparar password:', password);

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (isValid) {
            console.log('✅ Login exitoso! El password es correcto.');
            console.log('🚀 Si el servidor sigue fallando, ES OBLIGATORIO REINICIARLO.');
        } else {
            console.error('❌ El password es incorrecto.');
            console.log('Re-generando hash...');
            const newHash = await bcrypt.hash(password, 10);
            console.log('Nuevo hash sugerido:', newHash);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyLogin();
