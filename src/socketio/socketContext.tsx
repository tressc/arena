"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";
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

  useEffect(() => {
    // initialize the clientside connection and set the state variable
    setSocket(io());
    // copied from example, unclear if this will ever get called
    return () => {
      if (socket) socket.off();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketContext, SocketProvider, useSocket };
