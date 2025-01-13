"use client";

import React, { useEffect, useState } from "react";
import withProtectedRoute from "@/components/withProtectedRoute";
import { useSocket } from "@/socketio/socketContext";
import { Match as MatchData } from "@/socketio/state/matches";

interface Data {
  uid: string;
  time: number;
}

interface Matches {
  [key: string]: MatchData;
}

const Home = () => {
  const [ping, setPing] = useState<string | null>(null);
  const [matches, setMatches] = useState<Matches>({});

  const socket = useSocket();

  const getInitialState = (lobbyState: Matches) => {
    console.log({ lobbyState });
    setMatches(lobbyState);
  };

  // socket?.emit("lobby:enter", getInitialState);

  // const emitPing = () => {
  //   socket?.emit("emit-ping");
  // };

  const createMatch = () => {
    if (socket) {
      socket.emit("lobby:match:create");
    }
  };

  const onPing = (data: Data) => {
    console.log(data);
    setPing(`from ${data.uid} at ${data.time}`);
  };

  const onMatchCreated = (matchData: MatchData) => {
    console.log(matches);
    setMatches({
      ...matches,
      [matchData.uuid]: matchData,
    });
    // for (const userId of matchData.users.entries()) {
    //   console.log(userId);
    // }
  };

  // useEffect(() => {
  //   console.log(matches);
  // }, [matches]);

  useEffect(() => {
    if (socket) {
      socket.emit("lobby:enter", getInitialState);
      socket.on("on-ping", onPing);
      socket.on("lobby:match:create", onMatchCreated);
    }
    return () => {
      if (socket) {
        socket.off("on-ping", onPing);
        socket.off("lobby:match:create", onMatchCreated);
      }
    };
  }, [socket]);

  const listMatches = () => {
    return Object.keys(matches).map((matchId) => {
      return <div>{matches[matchId].uuid}</div>;
    });
  };

  return (
    <>
      {/* <button onClick={emitPing}>ping</button> */}
      <button onClick={createMatch}>create match</button>
      <div>home page</div>
      <div>most recent ping: {ping}</div>
      {listMatches()}
    </>
  );
};

export default withProtectedRoute(Home);
