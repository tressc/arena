import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/firebase/admin";

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
        // verify token
        await adminAuth.verifyIdToken(token);
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    // if auth'd pass uid to request
    return handler(req, res);
  };
}
