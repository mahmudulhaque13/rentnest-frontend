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
  const backendPath = pathname.replace(/^\/api/, "");

  const backendUrl = `${BACKEND_API_URL}${backendPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");
  headers.delete("accept-encoding");

  const hasBody = !["GET", "HEAD"].includes(request.method);

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  // Read the backend response completely.
  const responseData = await response.arrayBuffer();

  const responseHeaders = new Headers();

  // Forward only safe response headers.
  const contentType = response.headers.get("content-type");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  const location = response.headers.get("location");

  if (location) {
    responseHeaders.set("location", location);
  }

  return new NextResponse(responseData, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
