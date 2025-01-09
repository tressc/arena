"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/firebase/authContext";
import customFetch from "@/utils/customFetch";

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // TODO: move fetch & token stuff into useEffect?
  // TODO: any reason to prefer state over let?

  // hit endpoint to initialize socketio connection
  // firebase session token is added to header via customFetch
  customFetch("/api/socketio");

  const { user } = useAuth();

  useEffect(() => {
    // initialize the clientside connection and set the state variable

    const initializeConnection = async () => {
      const idToken = await user?.getIdToken();
      setSocket(io({ auth: { token: idToken } }));
    };

    if (!socket && user) {
      console.log("FIRING");
      console.log({ user });
      initializeConnection();
    }

    return () => {
      if (socket) socket.off();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketContext, SocketProvider, useSocket };
