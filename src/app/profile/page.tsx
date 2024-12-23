"use client";

import { useState, useEffect } from "react";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import withProtectedRoute from "@/components/withProtectedRoute";
import SignOutButton from "@/components/signOutButton";
import { useAuth } from "@/firebase/authContext";
import db from "@firebase/db";

const Profile = () => {
  const [svg, setSvg] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);

    const fetchSvg = async () => {
      const userDocSnap: DocumentSnapshot = await getDoc(docRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setSvg(data.svg);
      }
    };

    fetchSvg().catch(console.error);
  });

  return (
    <>
      {svg && (
        <img className="size-16" src={"data:image/svg+xml;base64," + svg} />
      )}
      <div>i am a protected route</div>
      <SignOutButton />
    </>
  );
};

export default withProtectedRoute(Profile);
