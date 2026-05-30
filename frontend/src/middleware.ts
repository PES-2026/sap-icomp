import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/public"];
const VALID_ROLES = ["PROFESSOR", "PEDAGOGUE"] as const;
type UserRole = (typeof VALID_ROLES)[number];

function isValidRole(role: unknown): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

async function getSession(token: string): Promise<{ role: UserRole } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!isValidRole(payload.role)) return null;

    return { role: payload.role };
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("userRole");
  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isLoginPage = pathname === "/login";

  const session = token ? await getSession(token) : null;

  if (!session && !isPublicRoute) {
    return redirectToLogin(request);
  }

  if (session && isLoginPage) {
    if (session.role === "PROFESSOR") {
      return NextResponse.redirect(new URL("/professor", request.url));
    }
    if (session.role === "PEDAGOGUE") {
      return NextResponse.redirect(new URL("/pedagogue", request.url));
    }
  }

  if (session) {
    if (pathname.startsWith("/professor") && session.role !== "PROFESSOR") {
      const redirectUrl =
        session.role === "PEDAGOGUE" ? "/pedagogue" : "/public";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (pathname.startsWith("/pedagogue") && session.role !== "PEDAGOGUE") {
      const redirectUrl =
        session.role === "PROFESSOR" ? "/professor" : "/public";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
