import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { purgeExpiredPhotos } from "@/lib/purge-photos";

/**
 * Purge quotidienne des photos d'analyse (lib/purge-photos.ts), appelée par
 * Vercel Cron (vercel.json) avec « Authorization: Bearer $CRON_SECRET ».
 * Sans CRON_SECRET configuré, la route refuse tout appel.
 * `?dry=1` compte ce qui serait supprimé, sans rien supprimer.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry") === "1";
  try {
    const report = await purgeExpiredPhotos(createAdminClient(), { dryRun });
    console.info("[purge-photos]", JSON.stringify(report));
    return NextResponse.json(report);
  } catch (error) {
    console.error("[purge-photos] passage interrompu :", error);
    return NextResponse.json({ error: "Purge interrompue" }, { status: 500 });
  }
}

function isAuthorized(header: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return received.length === expected.length && timingSafeEqual(received, expected);
}
