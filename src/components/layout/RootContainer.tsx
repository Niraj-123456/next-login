import React from "react";
import Header from "../header/Header";
import { getUser } from "@next/utils/auth";
import UserProvider from "@next/context/UserContext";
import ContainerBody from "./ContainerBody";

const RootContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <main className="w-full h-screen min-h-screen">
        <Header />
        <ContainerBody>{children}</ContainerBody>
      </main>
    </UserProvider>
  );
};

export default RootContainer;
