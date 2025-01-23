"use client";

import React, { useEffect, useState } from "react";
import withProtectedRoute from "@/components/withProtectedRoute";
import { useSocket } from "@/socketio/socketContext";
import { Match as MatchData } from "@/socketio/state/matches";

interface Matches {
  [key: string]: MatchData;
}

const Home = () => {
  const [matches, setMatches] = useState<Matches>({});

  const socket = useSocket();

  const getInitialState = (lobbyState: Matches) => {
    setMatches(lobbyState);
  };

  const createMatch = () => {
    if (socket) {
      socket.emit("lobby:match:create", 50);
    }
  };

  const deleteMatch = (matchId: string) => {
    if (socket) {
      socket.emit("lobby:match:delete", matchId);
    }
  };

  const onMatchCreated = (matchData: MatchData) => {
    setMatches((existingMatches) => ({
      ...existingMatches,
      [matchData.uuid]: matchData,
    }));
  };

  const onMatchDeleted = (matchId: string) => {
    setMatches((existingMatches) => {
      const newMatches = { ...existingMatches };
      delete newMatches[matchId];
      return newMatches;
    });
  };

  useEffect(() => {
    if (socket) {
      socket.emit("lobby:enter", getInitialState);
      socket.on("lobby:match:create", onMatchCreated);
      socket.on("lobby:match:delete", onMatchDeleted);
    }
    return () => {
      if (socket) {
        socket.off("lobby:match:create", onMatchCreated);
        socket.on("lobby:match:delete", onMatchDeleted);
      }
    };
  }, [socket]);

  const listMatches = () => {
    return Object.keys(matches).map((matchId) => {
      return (
        <div key={matchId} className="flex">
          <div>{matches[matchId].uuid}</div>
          <button onClick={() => deleteMatch(matchId)}>X</button>
        </div>
      );
    });
  };

  return (
    <>
      <button onClick={createMatch}>create match</button>
      {listMatches()}
    </>
  );
};

export default withProtectedRoute(Home);
