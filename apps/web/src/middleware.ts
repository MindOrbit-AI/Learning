import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

function applyRefCookie(req: NextRequest, res: NextResponse): NextResponse {
  const ref = req.nextUrl.searchParams.get("ref");
  if (ref && /^[A-Z0-9]{4,16}$/i.test(ref)) {
    res.cookies.set("mindorbit_ref", ref.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return res;
}

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return applyRefCookie(req, NextResponse.next());
  }

  // Align with NextAuth cookie names: the handler uses the *request origin* (see next-auth/core/init.js
  // `url.base.startsWith("https://")`), while getToken() defaults to NEXTAUTH_URL. If NEXTAUTH_URL is https
  // but you develop on http://localhost, tokens would not match and getToken returns null.
  const secureCookie = req.nextUrl.protocol === "https:";
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const token = await getToken({
    req,
    secret,
    secureCookie,
  });

  const userId =
    (token as { id?: string; sub?: string } | null)?.id ??
    (token as { sub?: string } | null)?.sub;
  if (!userId) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return applyRefCookie(req, NextResponse.redirect(signInUrl));
  }

  const role = (token as { role?: string }).role;
  if (!role || !ADMIN_ROLES.includes(role)) {
    return applyRefCookie(req, NextResponse.redirect(new URL("/dashboard", req.url)));
  }

  return applyRefCookie(req, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
