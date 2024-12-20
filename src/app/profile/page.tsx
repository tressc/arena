"use client";

import withProtectedRoute from "@/components/withProtectedRoute";
import SignOutButton from "@/components/signOutButton";

const Profile = () => {
  return (
    <>
      <div>i am a protected route</div>
      <SignOutButton />
    </>
  );
};

export default withProtectedRoute(Profile);
