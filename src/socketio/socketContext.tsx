"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/firebase/authContext";

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const establishConnection = async () => {
      if (user) {
        const token = await user.getIdToken();
        fetch(`/api/socketio?token=${token}`);
        setSocket(io());
        return () => {
          if (socket) socket.off();
        };
      }
    };

    establishConnection();
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketContext, SocketProvider, useSocket };
