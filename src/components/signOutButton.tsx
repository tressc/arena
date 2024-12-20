"use client";

import { useAuth } from "@/firebase/authContext";

const SignOutButton = () => {
  const { signOut } = useAuth();
  const handleClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    signOut();
  };

  return <button onClick={handleClick}>sign out</button>;
};

export default SignOutButton;
