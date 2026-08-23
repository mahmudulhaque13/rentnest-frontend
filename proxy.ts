import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

interface AuthPayload extends JWTPayload {
  role?: UserRole;
}

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

const isPublicRoute = (pathname: string) => {
  if (pathname === "/") {
    return true;
  }

  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const getRequiredRole = (pathname: string): UserRole | null => {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "ADMIN";
  }

  if (pathname === "/landlord" || pathname.startsWith("/landlord/")) {
    return "LANDLORD";
  }

  return null;
};

const requiresAuthentication = (pathname: string) => {
  return (
    pathname === "/rental-requests" ||
    pathname.startsWith("/rental-requests/") ||
    pathname === "/payments" ||
    pathname.startsWith("/payments/") ||
    pathname === "/payment/success" ||
    pathname === "/payment/cancel" ||
    pathname.startsWith("/reviews/")
  );
};

const verifyAccessToken = async (
  token: string,
): Promise<AuthPayload | null> => {
  if (!JWT_ACCESS_SECRET) {
    console.error("JWT_ACCESS_SECRET is not configured");

    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload as AuthPayload;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // =====================================================
  // API PROXY
  // =====================================================

  if (pathname.startsWith("/api/")) {
    if (!BACKEND_API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "BACKEND_API_URL is not configured",
          errors: [],
        },
        {
          status: 500,
        },
      );
    }

    // Remove /api from frontend URL
    //
    // /api/auth/login
    //        ↓
    // /auth/login
    const backendPath = pathname.replace(/^\/api/, "");

    const backendUrl =
      `${BACKEND_API_URL}${backendPath}` + `${request.nextUrl.search}`;

    const headers = new Headers(request.headers);

    // Backend should receive its own host.
    headers.delete("host");

    const hasBody = !["GET", "HEAD"].includes(request.method);

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);

    // ===================================================
    // LOGIN
    // ===================================================

    if (pathname === "/api/auth/login" && response.ok) {
      let accessToken: string | undefined;

      try {
        const responseData = await response.clone().json();

        accessToken = responseData?.data?.accessToken;
      } catch {
        // Keep normal response if JSON parsing fails.
      }

      const nextResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

      if (accessToken) {
        nextResponse.cookies.set("accessToken", accessToken, {
          httpOnly: true,

          secure: process.env.NODE_ENV === "production",

          sameSite: "lax",

          path: "/",

          maxAge: 60 * 60,
        });
      }

      return nextResponse;
    }

    // ===================================================
    // LOGOUT
    // ===================================================

    if (pathname === "/api/auth/logout" && response.ok) {
      const nextResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

      nextResponse.cookies.set("accessToken", "", {
        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/",

        maxAge: 0,
      });

      return nextResponse;
    }

    // ===================================================
    // NORMAL API RESPONSE
    // ===================================================

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  // =====================================================
  // PUBLIC FRONTEND ROUTES
  // =====================================================

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // =====================================================
  // AUTHENTICATION / ROLE CHECK
  // =====================================================

  const requiredRole = getRequiredRole(pathname);

  const needsAuth = requiredRole !== null || requiresAuthentication(pathname);

  if (!needsAuth) {
    return NextResponse.next();
  }

  // =====================================================
  // GET TOKEN FROM HTTPONLY COOKIE
  // =====================================================

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // =====================================================
  // VERIFY JWT
  // =====================================================

  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    const loginUrl = new URL("/auth/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);

    response.cookies.set("accessToken", "", {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      maxAge: 0,
    });

    return response;
  }

  // =====================================================
  // ROLE AUTHORIZATION
  // =====================================================

  if (requiredRole && payload.role !== requiredRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// =======================================================
// MATCHER
// =======================================================

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/landlord/:path*",
    "/rental-requests/:path*",
    "/payments/:path*",
    "/payment/:path*",
    "/reviews/:path*",
  ],
};
