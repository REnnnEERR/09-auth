import { NextRequest, NextResponse } from "next/server";
import { api } from "./lib/api/api";

const isPrivateRoute = (pathname: string) => {
  return pathname.startsWith("/profile") || pathname.startsWith("/notes");
};

const isAuthRoute = (pathname: string) => {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const sessionResponse = await api.get("/auth/session", {
      headers: { Cookie: cookieHeader },
    });

    if (sessionResponse.status === 200) {
      
      const setCookieHeaders = sessionResponse.headers["set-cookie"];
      
      const response = isAuthRoute(pathname)
        ? NextResponse.redirect(new URL("/profile", request.url))
        : NextResponse.next();

      if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
          const [cookiePart] = cookie.split(";");
          const [name, value] = cookiePart.split("=");
          response.cookies.set(name.trim(), value.trim());
        });
      }

      return response;
    }
  } catch (error) {
    if (isPrivateRoute(pathname)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}