import type { NextRequest } from "next/server";

const notice = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Service Temporarily Unavailable | Driver Chicago</title>
  <meta name="description" content="This driving service is not available at this time. We are currently not accepting bookings.">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f8fafc;
      color: #111827;
      font-family: Arial, sans-serif;
    }
    main {
      max-width: 560px;
      padding: 32px 24px;
      text-align: center;
    }
    h1 { font-size: 32px; }
    p { font-size: 18px; line-height: 1.7; }
  </style>
</head>
<body>
  <main>
    <h1>Service Temporarily Unavailable</h1>
    <p>This driving service is not available at this time.
    We are currently not accepting bookings.</p>
    <p>Thank you for your understanding.</p>
  </main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const viewing = request.method === "GET" || request.method === "HEAD";

  return new Response(request.method === "HEAD" ? null : notice, {
    status: viewing ? 200 : 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: "/:path*",
};
