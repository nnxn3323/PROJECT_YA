import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessPath, roleHome } from "@/lib/access";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const role = request.auth?.user?.role;
  const adminLevel = request.auth?.user?.adminLevel;

  if (pathname === "/login" && role) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  if (!canAccessPath(pathname, role, adminLevel)) {
    const url = new URL(role ? roleHome[role] : "/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
};
