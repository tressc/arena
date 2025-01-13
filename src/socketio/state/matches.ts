interface Match {
  uuid: string;
  users: Set<string>;
  game: string;
  ante: number;
  minUserCount: number;
  maxUserCount: number;
}

const matches: { [key: string]: Match } = {};

const createMatch = (
  uuid: string,
  users = new Set<string>(),
  game: string,
  ante: number,
  minUserCount: number,
  maxUserCount: number
) => {
  matches[uuid] = { uuid, users, game, ante, minUserCount, maxUserCount };
};

const deleteMatch = (matchId: string) => {
  delete matches[matchId];
};

const userJoin = (matchId: string, userId: string) => {
  matches[matchId].users.add(userId);
  console.log(matches[matchId].users);
};

const userLeave = (matchId: string, userId: string) => {
  matches[matchId].users.delete(userId);
};

export { type Match, matches, createMatch, deleteMatch, userJoin, userLeave };
