import { Server as IOServer, Socket } from "socket.io";
import {
  matches,
  createMatch,
  deleteMatch as deleteMatchFromState,
  userJoin,
  matchStatuses,
  userLeave,
} from "@state/matches";
import { users, matchJoin, matchLeave } from "@state/users";
import { randomUUID } from "crypto";

const registerLobbyHandlers = (io: IOServer, socket: Socket) => {
  // helpers
  const getStateOfWorld = () => {
    return matches;
  };

  const canJoinMatch = (userId: string, matchId: string) => {
    // check if maxUserCount already reached
    // check if game is still in pending status
    // check if current user has enough points to satisfy ante
    // check if user is currently in any matches
    const user = users[userId];
    const match = matches[matchId];
    return (
      match.users.size < match.maxUserCount &&
      match.status !== matchStatuses.pending &&
      user.points >= match.ante &&
      user.currentMatch === null
    );
  };

  const canCreateMatch = (userId: string, ante: number) => {
    const user = users[userId];
    return user.currentMatch === null && user.points >= ante;
  };

  const deleteMatch = (matchId: string) => {
    deleteMatchFromState(matchId);
    io.to("lobby").emit("lobby:match:delete", matchId);
    // delete match
    // emit change to room
  };

  const onCreateMatch = (ante: number) => {
    // confirm that current user can join
    // TODO: return some kind of error
    if (!canCreateMatch(socket.data.uid, ante)) return;

    // create a uuid
    const matchId = randomUUID();
    // populate a match object
    createMatch(
      matchId,
      new Set<string>(),
      "tictactoe",
      ante,
      2,
      4,
      matchStatuses.pending
    );
    // update match and user objects
    userJoin(matchId, socket.data.uid);
    matchJoin(socket.data.uid, matchId);
    // save match in matches object under uuid
    const matchData = matches[matchId];
    // emit change to room
    io.to("lobby").emit("lobby:match:create", {
      ...matchData,
      users: [...matchData.users],
    });
  };

  const onJoinMatch = (matchId: string) => {
    // TODO: return some kind of error
    if (!canJoinMatch(socket.data.uid, matchId)) return;
    userJoin(matchId, socket.data.uid);
    // update match object
    const match = matches[matchId];
    if (match.maxUserCount === match.users.size) {
      // if maxUserCount reached start game
      // TODO: implement game
      console.log("start game");
    } else if (match.minUserCount <= match.users.size) {
      // if minUserCount reached start timer
      // TODO: implement timer
      console.log("start timer");
    }
    // TODO: emit change
    // emit change to room
  };

  const onLeaveMatch = (matchId: string) => {
    // update match & user objects
    userLeave(matchId, socket.data.uid);
    matchLeave(socket.data.uid);
    const match = matches[matchId];
    if (match.users.size === 0) {
      // if no users remain, delete
      deleteMatch(matchId);
    } else if (
      // if minUserCount subsceded, stop timer
      match.minUserCount - match.users.size ===
      1
    ) {
      // TODO: implement timer
      console.log("stop timer");
    }
    // emit change to room
    // TODO: emit change
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
