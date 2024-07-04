import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/", "/register"];
export function middleware(request: NextRequest) {
  const user = request.cookies.get("user-session");
  const pathname = request.nextUrl.pathname;

  if (!user && protectedRoutes.includes(pathname)) {
    const absoluteUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(absoluteUrl.toString());
  }
  if (user && authRoutes.includes(request?.nextUrl?.pathname)) {
    const dashboardUrl = new URL("/dashboard", request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl.toString());
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [""],
// };
