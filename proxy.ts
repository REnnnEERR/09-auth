import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

 
  if (!accessToken && !refreshToken) {
    
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    const response = await checkSession();

    if (!response) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const setCookies = response.headers["set-cookie"];
    const nextResponse = NextResponse.next();

    if (setCookies) {
      setCookies.forEach((cookie: string) => {
        nextResponse.headers.append("set-cookie", cookie);
      });
    }

    return nextResponse;
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
