"use client";
import { useEffect } from "react";
import { useAuth } from "@/firebase/authContext";
import { redirect } from "next/navigation";

const withProtectedRoute = (Component: any) => {
  return (props: any) => {
    const { user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !user) {
        return redirect("/login");
      }
    }, [isLoading, user]);

    console.log({ user, isLoading });
    return user ? <Component {...props} /> : null;
  };
};

export default withProtectedRoute;
