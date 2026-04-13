import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("credits_remaining, subscription_plan")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: "Profil introuvable" },
      { status: 404 }
    );
  }

  const unlimited = profile.subscription_plan === "business";

  return NextResponse.json({
    credits_remaining: profile.credits_remaining,
    subscription_plan: profile.subscription_plan,
    unlimited,
  });
}
