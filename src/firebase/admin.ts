import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-admin";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
  }),
};

const adminApp =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

const adminAuth = auth();

const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
