import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportView, type ReportData } from "@/components/check/ReportView";
import type { Finding } from "@/components/check/FindingCard";
import type { Verdict, Confidence } from "@/lib/types";

interface AIRawResponse {
  analyst_summary?: string;
  missing_evidence?: string[];
  ocr_extracted?: Record<string, string>;
  recommendations?: string[];
  confidence_level?: "high" | "medium" | "low" | "insufficient";
}

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Rapport d'analyse`,
    description: `Résultats de l'analyse #${params.id.slice(0, 8).toUpperCase()}`,
  };
}

export default async function CheckReportPage({ params }: PageProps) {
  const { id } = params;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: row, error } = await supabase
    .from("analyses")
    .select(
      `
      id,
      status,
      verdict,
      confidence,
      overall_score,
      sub_scores,
      findings,
      ai_raw_response,
      created_at,
      brands!inner(name),
      models!inner(name)
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !row) notFound();

  const raw = row.ai_raw_response as AIRawResponse | null;

  const data: ReportData = {
    id: row.id as string,
    brandName: (row.brands as unknown as { name: string }).name,
    modelName: (row.models as unknown as { name: string }).name,
    status: row.status as string,
    verdict: (row.verdict as Verdict) ?? null,
    confidence: (row.confidence as Confidence) ?? null,
    overallScore: (row.overall_score as number) ?? null,
    subScores: (row.sub_scores as Record<string, number>) ?? null,
    findings: (row.findings as Finding[]) ?? null,
    analystSummary: raw?.analyst_summary ?? null,
    missingEvidence: raw?.missing_evidence ?? null,
    ocrExtracted: raw?.ocr_extracted ?? null,
    recommendations: raw?.recommendations ?? null,
    aiConfidence: raw?.confidence_level ?? null,
    createdAt: row.created_at as string,
  };

  return <ReportView data={data} />;
}
