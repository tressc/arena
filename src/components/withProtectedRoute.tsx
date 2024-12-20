"use client";
import { useEffect } from "react";
import { useAuth } from "@/firebase/authContext";
import { redirect, usePathname } from "next/navigation";

const withProtectedRoute = (Component: any) => {
  return (props: any) => {
    const { user, isLoading } = useAuth();

    const pathName = usePathname();
    console.log(pathName);

    useEffect(() => {
      if (!isLoading && !user) {
        return redirect(`/login?forward=${pathName}`);
      }
    }, [isLoading, user]);

    console.log({ user, isLoading });
    return user ? <Component {...props} /> : null;
  };
};

export default withProtectedRoute;
