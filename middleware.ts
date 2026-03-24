import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — IMPORTANT: do not remove
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: redirect to /auth if not authenticated
  const isProtected =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/check") ||
    request.nextUrl.pathname.startsWith("/admin");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    // Preserve full URL including query params (e.g. /checkout?plan=pro)
    const fullPath = request.nextUrl.pathname + request.nextUrl.search;
    url.searchParams.set("redirect", fullPath);
    return NextResponse.redirect(url);
  }

  // If user is logged in and visits /auth, honor redirect param or go to /dashboard
  if (user && request.nextUrl.pathname === "/auth") {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    if (redirectTo) {
      // Safety: only allow same-origin redirects
      const target = new URL(redirectTo, request.nextUrl.origin);
      if (target.origin === request.nextUrl.origin) {
        return NextResponse.redirect(target);
      }
    }
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
