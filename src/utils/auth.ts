import { getCookie } from "cookies-next";

export function getUser() {
  const cookie = getCookie("user-session");
  if (cookie) {
    const user = JSON.parse(cookie);
    return user;
  }
  return null;
}
