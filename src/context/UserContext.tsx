"use client";
import { User } from "@next/types/user";
import { getUser } from "@next/utils/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
