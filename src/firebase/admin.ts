import { initializeApp, getApps, cert } from "firebase-admin/app";
import { auth } from "firebase-admin";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
  }),
};

let adminApp =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

let adminAuth = auth();

export { adminApp, adminAuth };
