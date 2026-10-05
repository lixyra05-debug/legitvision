import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReportView, type ReportData } from "@/components/check/ReportView";
import type { Finding } from "@/components/check/FindingCard";
import type { Verdict, Confidence } from "@/lib/types";
import { staleKind } from "@/lib/analysis-limits";
import { expireStaleAnalyses } from "@/lib/analysis-stale";
import { lookupCatalogNames } from "@/lib/analysis-history";
import { zoneNamesForPoints } from "@/lib/zone-names";

interface AIRawResponse {
  analyst_summary?: string;
  missing_evidence?: string[];
  ocr_extracted?: Record<string, string>;
  recommendations?: string[];
  confidence_level?: "high" | "medium" | "low" | "insufficient";
}

interface AnalysisRow {
  id: string;
  status: string;
  verdict: Verdict | null;
  confidence: Confidence | null;
  overall_score: number | null;
  sub_scores: Record<string, number> | null;
  findings: Finding[] | null;
  ai_raw_response: AIRawResponse | null;
  created_at: string;
  updated_at: string;
  brand_id: string;
  model_id: string;
  // Jointures facultatives : null si la marque ou le modèle a été désactivé
  // depuis (RLS « is_active = true »). Les noms sont alors relus en admin.
  brands: { name: string } | null;
  // Les points d'authentification du modèle ne servent ici qu'à nommer les
  // zones du rapport (lib/zone-names.ts). JSONB : forme non garantie.
  models: { name: string; authentication_points: unknown } | null;
}

const ANALYSIS_COLUMNS = `
  id,
  status,
  verdict,
  confidence,
  overall_score,
  sub_scores,
  findings,
  ai_raw_response,
  created_at,
  updated_at,
  brand_id,
  model_id,
  brands(name),
  models(name, authentication_points)
`;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  return {
    title: `Rapport d'analyse`,
    description: `Résultats de l'analyse #${params.id.slice(0, 8).toUpperCase()}`,
  };
}

export default async function CheckReportPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");
  const userId = user.id;

  async function readRow(): Promise<AnalysisRow | null> {
    const { data, error } = await supabase
      .from("analyses")
      .select(ANALYSIS_COLUMNS)
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    return error || !data ? null : (data as unknown as AnalysisRow);
  }

  let row = await readRow();
  if (!row) notFound();

  // Analyse abandonnée (fonction coupée, client parti pendant l'envoi des
  // photos, ou demande de lancement perdue) : classée « failed » ici, par une
  // mise à jour conditionnelle, et affichée comme telle. Aucun débit possible
  // sur ce chemin : voir lib/analysis-stale.ts.
  const stale = staleKind(row.status, row.updated_at, Date.now()) !== null;
  const namesMissing = !row.brands?.name || !row.models?.name;
  let brandName = row.brands?.name ?? null;
  let modelName = row.models?.name ?? null;

  if (stale || namesMissing) {
    const admin = createAdminClient();
    const current: AnalysisRow = row;
    const [expired, names] = await Promise.all([
      stale ? expireStaleAnalyses(admin, userId, [current]) : null,
      namesMissing ? lookupCatalogNames(admin, [current.brand_id], [current.model_id]) : null,
    ]);
    if (expired?.has(current.id)) {
      row = { ...current, status: "failed" };
    } else if (stale) {
      // Rien écrit : la route a enregistré le rapport entre-temps, ou
      // l'écriture a échoué. On relit l'analyse telle qu'elle est.
      row = (await readRow()) ?? current;
    }
    brandName = brandName ?? names?.brands.get(current.brand_id)?.name ?? null;
    modelName = modelName ?? names?.models.get(current.model_id)?.name ?? null;
  }

  const raw = row.ai_raw_response;

  const report: ReportData = {
    id: row.id,
    brandName: brandName ?? "",
    modelName: modelName ?? "",
    status: row.status,
    verdict: row.verdict ?? null,
    confidence: row.confidence ?? null,
    overallScore: row.overall_score ?? null,
    subScores: row.sub_scores ?? null,
    findings: row.findings ?? null,
    analystSummary: raw?.analyst_summary ?? null,
    missingEvidence: raw?.missing_evidence ?? null,
    ocrExtracted: raw?.ocr_extracted ?? null,
    recommendations: raw?.recommendations ?? null,
    aiConfidence: raw?.confidence_level ?? null,
    createdAt: row.created_at,
    // Seulement les noms des zones : ni les points, ni leurs poids. Modèle
    // désactivé depuis (jointure vide) : table vide, le rapport nomme alors
    // les zones courantes et rend les autres identifiants lisibles.
    zoneNames: zoneNamesForPoints(row.models?.authentication_points),
  };

  return <ReportView data={report} />;
}
