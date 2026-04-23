import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=no_code`);
  }

  const supabase = createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const reason = encodeURIComponent(error.message ?? "unknown");
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=${reason}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
