import React from "react";
import Header from "../header/Header";
import { getUser } from "@next/utils/auth";

const RootContainer = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();
  return (
    <main className="w-full h-screen min-h-screen">
      <Header user={user} />
      <div
        className={`place-items-center p-24 grid ${
          user ? "h-[calc(100vh-72px)] min-h-[calc(100vh-72px)]" : "h-full"
        }`}
      >
        {children}
      </div>
    </main>
  );
};

export default RootContainer;
