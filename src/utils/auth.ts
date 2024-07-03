import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export function getUser() {
  const cookie = getCookie("user-session", { cookies });
  if (cookie) {
    const user = JSON.parse(cookie);
    return user;
  }
  return null;
}
