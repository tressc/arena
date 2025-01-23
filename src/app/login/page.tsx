"use client";

import { useState, useEffect, useContext } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { AuthContext } from "@/firebase/authContext";
import Link from "next/link";

const Login = () => {
  const { user, signIn, isLoading } = useContext(AuthContext);

  const msg = fetch("http://localhost:3000/api/hello")
    .then((res) => res.json())
    .then((json) => console.log(json));

  // currently getting called on every keystroke :(
  const searchParams = useSearchParams();
  const forwardPath = searchParams?.get("forward");

  useEffect(() => {
    if (user) {
      let path = "/";
      if (forwardPath) {
        path = forwardPath;
      }
      return redirect(path);
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
          login
        </button>
      </form>
      <div>
        not yet a member? <Link href="/signup">sign up</Link>
      </div>
    </div>
  ) : null;
};

export default Login;
