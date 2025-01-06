"use client";

import { useState, useEffect } from "react";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import withProtectedRoute from "@/components/withProtectedRoute";
import SignOutButton from "@/components/signOutButton";
import { useAuth } from "@/firebase/authContext";
import db from "@firebase/db";
import { useSocket } from "@/socketio/socketContext";

const Profile = () => {
  const [svg, setSvg] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");

  const { user } = useAuth();

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log("socket:", socket);
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      if (!socket) return;

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

    function receiveUid(data: any) {
      console.log(data);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("send-uid", receiveUid);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

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
  }, []);

  const getUid = () => {
    if (socket) {
      console.log("getting uid...");
      socket.emit("get-uid");
    }
  };

  return (
    <>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      {svg && (
        <img className="size-16" src={"data:image/svg+xml;base64," + svg} />
      )}
      <div>i am a protected route</div>
      <SignOutButton />
      <button onClick={getUid}>get uid</button>
    </>
  );
};

export default withProtectedRoute(Profile);
