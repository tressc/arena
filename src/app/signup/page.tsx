"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/firebase/authContext";

const SignUp = () => {
  const { user, signUp, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      return redirect("/");
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signUp(email, password);
  };

  return !isLoading || !user ? (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>
          email:
          <input
            className="border border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <label>
          password:
          <input
            className="border border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <button type="submit" className="border border-black">
          sign up
        </button>
      </form>
      <div>
        already a member? <Link href="/login">log in</Link>
      </div>
    </div>
  ) : null;
};

export default SignUp;
