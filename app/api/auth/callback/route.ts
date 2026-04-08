import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("[auth/callback] ▶ GET", {
    origin,
    hasCode: !!code,
    next,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  if (!code) {
    console.error("[auth/callback] ✗ No code in request — possible misconfigured redirect URL in Supabase dashboard");
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=no_code`);
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] ✗ exchangeCodeForSession error:", {
      message: error.message,
      status: error.status,
      name: error.name,
    });
    const reason = encodeURIComponent(error.message ?? "unknown");
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=${reason}`);
  }

  console.log("[auth/callback] ✓ Session exchanged for user:", data.user?.id, data.user?.email);
  return NextResponse.redirect(`${origin}${next}`);
}
