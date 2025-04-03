import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // const token = req.cookies.get("accessToken")?.value;
  // const loginUrl = new URL("/login", req.url);
  // const chatUrl = new URL("/chat", req.url);
  // if (!token && req.nextUrl.pathname.startsWith("/chat")) {
  //   return NextResponse.redirect(loginUrl);
  // }
  // if (token && req.nextUrl.pathname === "/login") {
  //   return NextResponse.redirect(chatUrl);
  // }
  // return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next|static).*)"],
};
