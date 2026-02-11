import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendNotification } from '../config/webPush';

const prisma = new PrismaClient();

// Schedule task for 11:30 AM (Spain time is UTC+1/+2, server might be UTC)
// Assuming server is UTC, Spain (CET/CEST) 11:30 is 10:30/09:30 UTC. 
// For simplicity, we'll set it to 10:30 UTC which is 11:30 CET (Winter) / 12:30 CEST (Summer).
// Adjust according to server timezone or use 'Europe/Madrid' if system supports it.

export const startDailyReminders = () => {
    // Run at 11:30 AM every day
    // "30 11 * * *" runs at 11:30:00
    cron.schedule('30 11 * * *', async () => {
        console.log('⏰ Running daily reminder job...');

        try {
            // Get all subscriptions
            // Prisma model is actually camelCase by default: pushSubscription
            const subscriptions = await prisma.pushSubscription.findMany();

            if (subscriptions.length === 0) {
                console.log('No subscriptions found.');
                return;
            }

            const payload = {
                title: 'Agenda del Día 📅',
                body: '¡Es hora de revisar tus tareas y crear contenido! 🚀',
                url: '/studio', // Action URL
            };

            // Send to all
            const promises = subscriptions.map((sub: any) =>
                sendNotification({
                    endpoint: sub.endpoint,
                    keys: sub.keys
                }, payload)
            );

            await Promise.all(promises);
            console.log(`✅ Sent reminders to ${subscriptions.length} devices.`);

        } catch (error) {
            console.error('Error running daily reminder:', error);
        }
    }, {
        timezone: "Europe/Madrid"
    });

    console.log('📅 Daily reminder job scheduled for 11:30 AM Europe/Madrid');
};
