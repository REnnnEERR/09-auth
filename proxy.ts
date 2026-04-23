import { NextRequest, NextResponse } from "next/server";
import { api } from "./lib/api/api";
import { AxiosResponse } from "axios";

const isPrivateRoute = (pathname: string) => {
  return pathname.startsWith("/profile") || pathname.startsWith("/notes");
};

const isAuthRoute = (pathname: string) => {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;
  const accessToken = cookies.get("accessToken")?.value;
  const refreshToken = cookies.get("refreshToken")?.value;

  
  if (!accessToken && refreshToken) {
    try {
      const sessionResponse: AxiosResponse = await api.get("/auth/session", {
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (sessionResponse.status === 200) {
        const setCookieHeaders = sessionResponse.headers["set-cookie"] as string[] | undefined;
        
        
        const response = isAuthRoute(pathname)
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        if (setCookieHeaders) {
          setCookieHeaders.forEach((cookie) => {
            const [cookiePart] = cookie.split(";");
            const [name, value] = cookiePart.split("=");
            if (name && value) {
              response.cookies.set(name.trim(), value.trim());
            }
          });
        }
        return response; 
      }
    } catch (error) {
      
      if (isPrivateRoute(pathname)) {
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  
  if (accessToken) {
    
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  
  if (isPrivateRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}