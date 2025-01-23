import { addUser } from "@/socketio/state/users";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminDb } from "@/firebase/admin";

// TODO: properly type handler
export default function withAuth(handler: any) {
  // authenticates token via firebase api
  // save user data
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { token } = req.headers;
    let uid;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (token && typeof token == "string") {
      try {
        // verify token and get the user id via firebase api
        const verifiedId = await adminAuth.verifyIdToken(token);
        // save user info to state
        const userRef = adminDb.collection("users").doc(verifiedId.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          uid = userData?.uid;
          addUser({
            uuid: userData?.uid,
            points: userData?.points || 0,
            currentMatch: userData?.currentMatch || null,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    // if auth'd pass uid to request
    return handler(req, res, uid);
  };
}
