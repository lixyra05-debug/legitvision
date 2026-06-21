import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Validation stricte du paramètre `next` pour prévenir les open redirects.
  // Bloque : URLs absolues (://), protocol-relative (//), chemins non-relatifs.
  const nextRaw = searchParams.get("next") ?? "/dashboard";
  const isSafeNext =
    nextRaw.startsWith("/") &&
    !nextRaw.startsWith("//") &&
    !nextRaw.includes("://");
  const next = isSafeNext ? nextRaw : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=no_code`);
  }

  const supabase = createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const reason = encodeURIComponent(error.message ?? "unknown");
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=${reason}`);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
