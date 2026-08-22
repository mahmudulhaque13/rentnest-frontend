import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function proxy(request: NextRequest) {
  if (!BACKEND_API_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "BACKEND_API_URL is not configured",
      },
      {
        status: 500,
      },
    );
  }

  const pathname = request.nextUrl.pathname;

  // Remove /api from the incoming frontend URL
  const backendPath = pathname.replace(/^\/api/, "");

  const backendUrl = `${BACKEND_API_URL}${backendPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);

  // Host belongs to the backend target, not the frontend host.
  headers.delete("host");

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
