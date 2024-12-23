import { getAuth } from "firebase/auth";
import firebaseApp from "@firebase/config";

const auth = getAuth(firebaseApp);
export default auth;
