import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const roleCookie = req.cookies.get("app-role")?.value || "Member";
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (roleCookie !== "Admin") {
      return NextResponse.json(
        { error: "Access Denied: Admin role required." },
        { status: 403 }
      );
    }
  }

  if (pathname.startsWith("/api/member")) {
    if (roleCookie === "Guest") {
      return NextResponse.json(
        { error: "Access Denied: Member role required." },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-user-role", roleCookie);
  return response;
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/member/:path*"],
};
