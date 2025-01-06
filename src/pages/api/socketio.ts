import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import { adminAuth } from "@firebase/admin";

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
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ error: "Please include id token in header" });
  }

  if (token && typeof token == "string") {
    try {
      const { uid } = await adminAuth.verifyIdToken(token);
      console.log("UID:", uid);
    } catch (error) {
      console.error(error);
    }
  }

  if (res.socket.server.io) {
    console.log("Socket is already running.");
  } else {
    console.log("Socket is initializing...");

    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`${socket.id} connecting.`);

      // EVENT EXAMPLE
      socket.on("some-event-name", () => {
        io.to(socket.id).emit("send-something-back", { some: "data" });
      });

      // DISCONNECT LISTENER
      socket.on("disconnect", () => {
        console.log(`${socket.id} disconnecting.`);
      });
    });
  }

  res.end();
};

export default SocketHandler;
