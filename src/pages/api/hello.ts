"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/firebase/admin";

// type ResponseData = {
//   message: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers.token) {
    return res.status(401).json({ error: "Please include id token" });
  }

  try {
    if (typeof req.headers.token === "string") {
      const { uid } = await adminAuth.verifyIdToken(req.headers.token);
      console.log({ uid });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "token not authed" });
  }
  // const authorization = headers().then((h) => h.get("Authorization"));
  // console.log({ authorization });
  res.status(200).json({ message: "token authorized!" });
}
