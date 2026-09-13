import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

/** Protects private pages and keeps authenticated users out of auth screens. */
export default auth((request) => {
  const isAuthenticated = Boolean(request.auth);
  const isPrivatePage = ["/dashboard", "/tasks"].some((path) => request.nextUrl.pathname.startsWith(path));
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (!isAuthenticated && isPrivatePage) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/auth/:path*"],
};