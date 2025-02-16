import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";
import registerLobbyHandlers from "@/socketio/handlers/lobby";
import withAuth from "@/utils/authWrapper";
import { adminAuth, adminDb } from "@/firebase/admin";
import { users, addUser } from "@/socketio/state/users";

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
      io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        console.log("TOKEN EXISTS?", !!token);
        if (token && typeof token == "string") {
          try {
            // this feels redundant because of the auth wrapper
            // but currently is the only way to set user ids on each socket instance
            const verifiedId = await adminAuth.verifyIdToken(token);
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

      io.use(async (socket, next) => {
        // save user info to state if not already in existence
        if (users[socket.data.uid]) next();

        const userRef = adminDb.collection("users").doc(socket.data.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          uid = userData?.uid;
          addUser({
            uuid: userData?.uid,
            points: userData?.points || 500,
            currentMatch: userData?.currentMatch || null,
          });
        }
        next();
      });

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
