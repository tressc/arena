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

  const { user } = useAuth();

  customFetch("/api/socketio");

  useEffect(() => {
    if (user) {
      setSocket(io());
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
