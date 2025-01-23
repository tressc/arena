"use client";
import { useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Identicon from "identicon.js";
import auth from "@/firebase/authInstance";
import db from "@firebase/db";
import Fetch from "@/utils/customFetch";

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  signIn: Function;
  signOut: Function;
  signUp: Function;
}>({
  user: null,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  isLoading: true,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signUp = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        // Add user record to firestore
        const user = userCredential.user;
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          points: 100,
          currentMatch: null,
          // ideally just use uid as first arg to Identicon
          // better results using uuid
          svg: new Identicon(uuidv4(), {
            size: 420,
            format: "svg",
          }).toString(),
        })
          .then(() => {
            console.log("success");
          })
          .catch((e) => {
            console.error("Error adding document: ", e);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ errorMessage, errorCode });
      });
  };

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("success", { user });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({ errorMessage, errorCode });
      });
  };

  const signOut = () => {
    signOutFirebase(auth)
      .then(() => {
        setUser(null);
        console.log({ user, isLoading });
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setUser(user);
        Fetch("/api/user", user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// const useAuth = () => {
//   const { user, signIn, signOut, signUp, isLoading } = useContext(AuthContext);
//   return () => ({
//     user,
//     signIn,
//     signOut,
//     signUp,
//     isLoading,
//   });
// };

export { AuthContext, AuthProvider };
