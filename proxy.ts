import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  if (pathname.startsWith("/api") || request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const cookieStore = await cookies(); // ✅ await

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  
  if (!accessToken && refreshToken) {
    const response = await checkSession();

    if (!response) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

   
    const setCookies = response.headers["set-cookie"];
    if (setCookies) {
      const res = NextResponse.next();
      setCookies.forEach((cookie: string) =>
        res.headers.append("set-cookie", cookie)
      );
      return res;
    }
  }

  
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
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