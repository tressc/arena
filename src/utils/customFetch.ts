// TODO: properly type user
const Fetch = async (url: string, user: any) => {
  if (user) {
    // TODO: memoize this value
    const token = await user.getIdToken();
    const myHeaders = new Headers();
    myHeaders.append("token", token);
    return fetch(url, { headers: myHeaders });
  } else {
    // TODO: retry logic and a warning on failure
    console.log("no user!");
  }
};

export default Fetch;
