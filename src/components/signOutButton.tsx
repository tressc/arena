"use client";

import { AuthContext } from "@/firebase/authContext";
import { useContext } from "react";

const SignOutButton = () => {
  const { signOut } = useContext(AuthContext);
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    signOut();
  };

  return <button onClick={handleClick}>sign out</button>;
};

export default SignOutButton;
