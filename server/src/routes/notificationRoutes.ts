import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendNotification } from '../config/webPush';

const router = Router();
const prisma = new PrismaClient();

// Subscribe to push notifications
router.post('/subscribe', async (req, res) => {
    const { subscription, userId } = req.body;

    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription' });
    }

    try {
        // Save subscription to DB
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                keys: subscription.keys,
                userId: userId || null,
            },
            create: {
                endpoint: subscription.endpoint,
                keys: subscription.keys,
                userId: userId || null,
            },
        });

        // Send a test notification to confirm
        await sendNotification(subscription, {
            title: '¡Notificaciones Activas! 🔔',
            body: 'Ahora recibirás alertas de tu agencia.',
        });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

export default router;
