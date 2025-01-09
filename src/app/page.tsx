"use client";

import React, { useEffect, useState } from "react";
import withProtectedRoute from "@/components/withProtectedRoute";
import { useSocket } from "@/socketio/socketContext";

interface Data {
  uid: string;
  time: number;
}

const Home = () => {
  const [ping, setPing] = useState<string | null>(null);

  const socket = useSocket();

  const emitPing = () => {
    socket?.emit("emit-ping");
  };

  const onPing = (data: Data) => {
    console.log(data);
    setPing(`from ${data.uid} at ${data.time}`);
  };

  useEffect(() => {
    if (socket) {
      socket.on("on-ping", onPing);
    }
    return () => {
      if (socket) socket.off("on-ping", onPing);
    };
  }, [socket]);

  return (
    <>
      <button onClick={emitPing}>ping</button>
      <div>home page</div>
      <div>most recent ping: {ping}</div>
    </>
  );
};

export default withProtectedRoute(Home);
