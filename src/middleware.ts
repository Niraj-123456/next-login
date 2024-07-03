import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";

const protectedRoutes = ["/dashboard"];
export function middleware(request: NextRequest) {
  const user = request.cookies.get("user-session");

  if (!user && protectedRoutes.includes(request?.nextUrl?.pathname)) {
    const absoluteUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: [""],
// };
