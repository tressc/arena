"use client";

import { useState, useEffect } from "react";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import withProtectedRoute from "@/components/withProtectedRoute";
import SignOutButton from "@/components/signOutButton";
import { useAuth } from "@/firebase/authContext";
import db from "@firebase/db";
// import customFetch from "@/utils/customFetch";
import { socket } from "@/socket";

const Profile = () => {
  const [svg, setSvg] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  const { user } = useAuth();

  // customFetch("http://localhost:3000/api/hello")
  //   .then((res) => res?.json())
  //   .then((json) => console.log(json));

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log("useeffect");
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
  }, []);

  return (
    <>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      {svg && (
        <img className="size-16" src={"data:image/svg+xml;base64," + svg} />
      )}
      <div>i am a protected route</div>
      <SignOutButton />
    </>
  );
};

export default withProtectedRoute(Profile);
