"use client";

import React from "react";
import withProtectedRoute from "@/components/withProtectedRoute";

const Home = () => {
  return <div>home page</div>;
};

export default withProtectedRoute(Home);
