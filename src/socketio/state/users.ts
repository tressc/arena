interface User {
  currentMatch: string | null;
  uuid: string;
  points: number;
}

const users: { [key: string]: User } = {};

const addUser = (userData: User) => {
  users[userData.uuid] = userData;
};

export { type User, users, addUser };
