import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import registerLobbyHandlers from "@/socketio/handlers/lobby";
import withAuth from "@/utils/authWrapper";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = async (
  _: NextApiRequest,
  res: NextApiResponseWithSocket,
  uid?: string
) => {
  if (res.socket.server.io) {
    console.log("Socket is already running.");
  } else {
    console.log("Socket is initializing...");

    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // associate socket with user id
      socket.data.uid = uid;

      console.log(`${socket.id} connecting.`);

      // register event handlers
      console.log("registering event handlers");
      registerLobbyHandlers(io, socket);

      // DISCONNECT LISTENER
      socket.on("disconnect", () => {
        console.log(`${socket.id} disconnecting.`);
      });
    });
  }

  res.end();
};

export default withAuth(SocketHandler);
