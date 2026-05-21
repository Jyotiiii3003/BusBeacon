import admin from "firebase-admin";
import { env } from "../config/env.js";

let firebaseReady = false;

export function initFirebase() {
  if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
    console.log("Firebase Admin not configured; FCM sends will be logged only.");
    return;
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.firebaseProjectId,
        clientEmail: env.firebaseClientEmail,
        privateKey: env.firebasePrivateKey
      })
    });
  }
  firebaseReady = true;
}

export async function sendFcm(tokens, notification, data = {}) {
  const cleanTokens = tokens?.filter(Boolean) || [];
  if (!cleanTokens.length) return { sent: 0 };
  if (!firebaseReady) {
    console.log("FCM dry run:", notification.title, cleanTokens.length);
    return { sent: 0, dryRun: true };
  }
  const response = await admin.messaging().sendEachForMulticast({
    tokens: cleanTokens,
    notification,
    data: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)]))
  });
  return { sent: response.successCount, failed: response.failureCount };
}
