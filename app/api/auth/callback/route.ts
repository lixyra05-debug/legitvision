import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // `next` vient de l'URL : validé en résolvant le chemin comme le navigateur
  // (« /\hote » et « /<tab>/hote » passaient le simple test de préfixe).
  const next = safeRedirectPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=no_code`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const reason = encodeURIComponent(error.message ?? "unknown");
    return NextResponse.redirect(`${origin}/auth?error=callback_error&reason=${reason}`);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
