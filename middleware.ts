import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};
export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
      if (!exists) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      if (exists) {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!|_next/static|_next/image|favicon.ico).*)",
      // header들이 누락됐을 때 미들웨어를 실행한다. 
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

// export const config = {
//     matcher: ["/((?!|_next/static|_next/image|favicon.ico).*)"],
//   };