import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ не чіпаємо API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

 
  if (!accessToken && refreshToken) {
    const response = await checkSession();

    if (!response) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
    "/api/:path*",
  ],
};
