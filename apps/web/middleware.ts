import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const loginUrl = new URL("/login", req.url);

  if (!token && pathname.startsWith("/chat")) {
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/login") {
    const chatUrl = new URL("/chat", req.url);
    return NextResponse.redirect(chatUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static).*)"],
};
