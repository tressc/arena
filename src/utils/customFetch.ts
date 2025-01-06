import { useAuth } from "@/firebase/authContext";

const customFetch = async (url: string) => {
  // attach user's firebase id token to all api requests
  const { user } = useAuth();
  if (user) {
    const token = await user.getIdToken();
    const myHeaders = new Headers();
    myHeaders.append("token", token);
    return fetch(url, { headers: myHeaders });
  } else {
    // TODO: retry logic and a warning on failure
    console.log("no user!");
  }
};

export default customFetch;
