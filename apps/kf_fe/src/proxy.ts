import { NextResponse, type NextRequest } from "next/server";
import { hasAdminAccessToken, isTokenExpired, parseJwtPayload } from "@/lib/authRoles";

const AUTH_TOKEN_KEY = "kf_token";
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const hasActiveToken = Boolean(token && !isTokenExpired(parseJwtPayload(token)));
  const hasAdminAccess = hasAdminAccessToken(token);

  if (token && !hasActiveToken) {
    const response = pathname.startsWith("/admin") || pathname.startsWith("/users")
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
    response.cookies.delete(AUTH_TOKEN_KEY);
    return response;
  }

  if ((pathname.startsWith("/admin") || pathname.startsWith("/users")) && !hasAdminAccess) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasActiveToken) {
    return NextResponse.redirect(new URL(hasAdminAccess ? "/admin" : "/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/users", "/login", "/register"],
};
