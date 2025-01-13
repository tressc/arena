import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import { adminAuth } from "@firebase/admin";
import registerLobbyHandlers from "@/socketio/handlers/lobby";

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

  let uid: string | null = null;

  if (token && typeof token == "string") {
    try {
      // verify token and get the user id via firebase api
      const verifiedId = await adminAuth.verifyIdToken(token);
      // uid = verifiedId.uid;
      console.log("UID:", verifiedId.uid);
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

    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      console.log(token, typeof token);
      if (token && typeof token == "string") {
        console.log("hello");

        try {
          const verifiedId = await adminAuth.verifyIdToken(token);
          console.log("VERIFIED:", verifiedId);
          socket.data.uid = verifiedId.uid;
          next();
        } catch (error) {
          console.error(error);
          next();
        }
      } else {
        console.error("no token");
        next();
      }
    });

    io.on("connection", (socket) => {
      console.log(`${socket.id} connecting.`);

      // TODO: register handlers
      console.log("registering event handlers");
      registerLobbyHandlers(io, socket);
      // EVENT EXAMPLE
      socket.on("get-uid", () => {
        io.to(socket.id).emit("send-uid", { uid: socket.data.uid });
      });

      socket.on("emit-ping", () => {
        // console.log("# connections:", io.engine.clientsCount);
        console.log("emitting:", socket.data.uid);
        socket.broadcast.emit("on-ping", {
          uid: socket.data.uid,
          time: Date.now(),
        });
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
