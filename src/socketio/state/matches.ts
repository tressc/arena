interface Match {
  uuid: string;
  users: Set<string>;
  game: string;
  ante: number;
  minUserCount: number;
  maxUserCount: number;
  status: string;
}

const matches: { [key: string]: Match } = {};

const createMatch = (
  uuid: string,
  users = new Set<string>(),
  game: string,
  ante: number,
  minUserCount: number,
  maxUserCount: number,
  status: string
) => {
  matches[uuid] = {
    uuid,
    users,
    game,
    ante,
    minUserCount,
    maxUserCount,
    status,
  };
};

const deleteMatch = (matchId: string) => {
  delete matches[matchId];
};

const userJoin = (matchId: string, userId: string) => {
  matches[matchId].users.add(userId);
};

const userLeave = (matchId: string, userId: string) => {
  matches[matchId].users.delete(userId);
};

const matchStatuses = {
  pending: "PENDING",
  inProgress: "IN_PROGRESS",
  concluded: "CONCLUDED",
};

export {
  type Match,
  matches,
  createMatch,
  deleteMatch,
  userJoin,
  userLeave,
  matchStatuses,
};
