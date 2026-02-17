import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Supabase: refresh session + protect /suivi
  const supabaseResponse = await updateSession(request);

  // If Supabase returned a redirect, use it directly
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  // 2. next-intl: locale routing
  const intlResponse = intlMiddleware(request);

  // Copy Supabase cookies onto the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
