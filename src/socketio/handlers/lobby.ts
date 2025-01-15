import { Server as IOServer, Socket } from "socket.io";
import {
  matches,
  createMatch,
  deleteMatch as deleteMatchFromState,
  userJoin,
} from "@state/matches";
import { randomUUID } from "crypto";

const registerLobbyHandlers = (io: IOServer, socket: Socket) => {
  // helpers
  const getStateOfWorld = () => {
    return matches;
  };

  const canJoinMatch = () => {
    // check if current user has enough points to satisfy ante
    // check if user is currently in any matches
    // check if game is already started or ended
    // check if maxUserCount already reached
  };

  const deleteMatch = (matchId: string) => {
    deleteMatchFromState(matchId);
    io.to("lobby").emit("lobby:match:delete", matchId);
    // delete match
    // emit change to room
  };

  const onCreateMatch = () => {
    // confirm that current user can join
    // populate a match object
    // create a uuid
    // save match in matches object under uuid
    // emit change to room
    const matchId = randomUUID();
    createMatch(matchId, new Set<string>(), "tictactoe", 0, 2, 2);
    userJoin(matchId, socket.data.uid);
    const matchData = matches[matchId];
    console.log(matches);
    io.to("lobby").emit("lobby:match:create", {
      ...matchData,
      users: [...matchData.users],
    });
  };

  const onJoinMatch = () => {
    // if minUserCount reached start timer
    // if maxUserCount reached start game
    // update match object
    // emit change to room
  };

  const onLeaveMatch = () => {
    // update match object
    // emit change to room
    // if no users remain, delete
  };

  const onEnter = (cb: Function) => {
    socket.join("lobby");
    cb(getStateOfWorld());
  };

  const onExit = () => {
    socket.leave("lobby");
  };

  socket.on("lobby:match:create", onCreateMatch);
  socket.on("lobby:match:join", onJoinMatch);
  socket.on("lobby:match:leave", onLeaveMatch);
  socket.on("lobby:enter", onEnter);
  socket.on("lobby:exit", onExit);
  //test
  socket.on("lobby:match:delete", deleteMatch);
};

export default registerLobbyHandlers;
