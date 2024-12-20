"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/firebase/authContext";

const Login = () => {
  const { user, signIn, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      return redirect("/");
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn(email, password);
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
          submit
        </button>
      </form>
    </div>
  ) : null;
};

export default Login;
