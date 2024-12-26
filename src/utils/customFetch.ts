import { useAuth } from "@/firebase/authContext";

const customFetch = async (url: string) => {
  const { user } = useAuth();
  if (user) {
    const token = await user.getIdToken();
    const myHeaders = new Headers();
    myHeaders.append("token", token);
    return fetch(url, { headers: myHeaders });
  } else {
    console.log("no user!");
  }
};

export default customFetch;
