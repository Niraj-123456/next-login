"use client";
import { useUserContext } from "@next/context/UserContext";
import React from "react";

const ContainerBody = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUserContext();

  if (loading) {
    return (
      <div className="place-items-center p-24 grid h-screen">Loading...</div>
    );
  }

  return (
    <div
      className={`place-items-center p-24 grid ${
        user ? "h-[calc(100vh-72px)] min-h-[calc(100vh-72px)]" : "h-full"
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerBody;
