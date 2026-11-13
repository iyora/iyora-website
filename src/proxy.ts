import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Path halaman diteruskan ke server component (`x-pathname`) supaya layout bisa
 * memasang tag kanonis PER HALAMAN. Dulu kanonisnya statis "/id" untuk semua
 * halaman, sehingga Google menganggap seluruh situs duplikat beranda
 * (Search Console, Nov 2026). next-intl menyalin header request ini.
 */
export default function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);
  return intl(new NextRequest(req, { headers }));
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
