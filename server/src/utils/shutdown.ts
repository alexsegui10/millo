import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let isShuttingDown = false;

// Graceful shutdown handler
export const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
        console.log('⚠️  Shutdown already in progress...');
        return;
    }

    isShuttingDown = true;
    console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);

    try {
        // Give server time to finish ongoing requests
        console.log('⏳ Waiting for ongoing requests to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Close database connections
        console.log('🔌 Disconnecting from database...');
        await prisma.$disconnect();

        console.log('✅ Graceful shutdown complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Register shutdown handlers
export const registerShutdownHandlers = () => {
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};
