interface User {
  currentMatch: string | null;
  uuid: string;
  points: number;
}

const users: { [key: string]: User } = {};

const addUser = (userData: User) => {
  users[userData.uuid] = userData;
};

const matchJoin = (userId: string, matchId: string) => {
  users[userId].currentMatch = matchId;
};

const matchLeave = (userId: string) => {
  users[userId].currentMatch = null;
};

export { type User, users, addUser, matchJoin, matchLeave };
