import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
    console.warn('⚠️ VAPID keys not found. Push notifications will not work.');
} else {
    webpush.setVapidDetails(
        'mailto:admin@ofmagency.com', // Replace with your email
        publicVapidKey,
        privateVapidKey
    );
    console.log('✅ Web Push initialized');
}

export const sendNotification = async (subscription: any, payload: any) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};

export default webpush;
