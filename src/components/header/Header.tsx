"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@next/utils/firebase";
import { signOut } from "firebase/auth";
import { LogOut, User, UserCircle2 } from "lucide-react";
import { deleteCookie } from "cookies-next";

type User = {
  photoUrl: string;
  name: string;
  email: string;
};

const Header = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    deleteCookie("user-session");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center py-4 px-8 justify-end">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        {user?.photoUrl ? (
          <Image
            src={user?.photoUrl}
            alt={user?.name ? user?.name : "user"}
            fill
            sizes="100%*100%"
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <UserCircle2 className="w-full h-full" />
        )}
      </div>
      <LogOut className="ml-2 cursor-pointer" onClick={handleLogout} />
    </div>
  );
};

export default Header;
