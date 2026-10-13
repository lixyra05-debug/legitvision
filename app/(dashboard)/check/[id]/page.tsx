import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReportView, type ReportData } from "@/components/check/ReportView";
import type { Verdict, Confidence } from "@/lib/types";
import { staleKind } from "@/lib/analysis-limits";
import { expireStaleAnalyses } from "@/lib/analysis-stale";
import { lookupCatalogNames } from "@/lib/analysis-history";
import { zoneNamesForPoints } from "@/lib/zone-names";
import { readAiConfidence, readFindings, readOcr, readProse, readSubScores, readTextList } from "@/lib/report-data";
import { withoutPurchaseAdvice } from "@/lib/purchase-advice";

/**
 * La réponse du modèle, telle qu'elle est enregistrée : JSONB, forme non
 * garantie. Chaque champ est relu par lib/report-data.ts avant d'être
 * transmis à l'écran.
 */
interface AIRawResponse {
  analyst_summary?: unknown;
  missing_evidence?: unknown;
  ocr_extracted?: unknown;
  recommendations?: unknown;
  confidence_level?: unknown;
}

interface AnalysisRow {
  id: string;
  status: string;
  verdict: Verdict | null;
  confidence: Confidence | null;
  overall_score: number | null;
  // JSONB écrits par la route à partir de la réponse du modèle : forme non
  // garantie pour les observations, relue par lib/report-data.ts.
  sub_scores: unknown;
  findings: unknown;
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

  /**
   * L'analyse du client, ou null si elle n'existe pas (ou n'est pas la sienne).
   * Une lecture en erreur n'est pas une analyse absente : la base injoignable
   * affichait « 404, cette page n'existe pas » à la place d'un rapport payé.
   * Elle lève désormais une erreur, et la page de repli du rapport (error.tsx)
   * propose de réessayer. Deux erreurs veulent bien dire « absente » :
   * PGRST116 (aucune ligne pour .single()) et 22P02 (l'identifiant de
   * l'adresse n'est pas un UUID).
   */
  async function readRow(): Promise<AnalysisRow | null> {
    const { data, error } = await supabase
      .from("analyses")
      .select(ANALYSIS_COLUMNS)
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116" && error.code !== "22P02") {
      throw new Error("lecture de l'analyse impossible");
    }
    return data ? (data as unknown as AnalysisRow) : null;
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
      // Cette relecture est un mieux : si elle échoue, on garde la ligne lue.
      row = (await readRow().catch(() => null)) ?? current;
    }
    brandName = brandName ?? names?.brands.get(current.brand_id)?.name ?? null;
    modelName = modelName ?? names?.models.get(current.model_id)?.name ?? null;
  }

  // Un objet, sinon rien : une réponse enregistrée sous une autre forme (un
  // texte, une liste) ne porte aucun de ces champs.
  const raw: AIRawResponse | null =
    typeof row.ai_raw_response === "object" && row.ai_raw_response !== null && !Array.isArray(row.ai_raw_response)
      ? row.ai_raw_response
      : null;

  const report: ReportData = {
    id: row.id,
    brandName: brandName ?? "",
    modelName: modelName ?? "",
    status: row.status,
    verdict: row.verdict ?? null,
    confidence: row.confidence ?? null,
    overallScore: row.overall_score ?? null,
    // Tout ce qui vient de la réponse du modèle est ramené à sa forme avant
    // l'écran : une liste rendue autrement, ou un texte rendu en objet, ne
    // doit jamais faire planter un rapport payé (lib/report-data.ts).
    subScores: readSubScores(row.sub_scores),
    findings: readFindings(row.findings),
    analystSummary: readProse(raw?.analyst_summary),
    missingEvidence: readTextList(raw?.missing_evidence),
    ocrExtracted: readOcr(raw?.ocr_extracted),
    // Jamais de conseil d'achat ou de paiement à l'écran (décision du 13/10) :
    // la consigne l'interdit à l'IA, ceci retire ce qui passerait quand même,
    // dans les rapports déjà enregistrés aussi (lib/purchase-advice.ts).
    recommendations: withoutPurchaseAdvice(readTextList(raw?.recommendations)),
    aiConfidence: readAiConfidence(raw?.confidence_level),
    createdAt: row.created_at,
    // Seulement les noms des zones : ni les points, ni leurs poids. Modèle
    // désactivé depuis (jointure vide) : table vide, le rapport nomme alors
    // les zones courantes et rend les autres identifiants lisibles.
    zoneNames: zoneNamesForPoints(row.models?.authentication_points),
  };

  return <ReportView data={report} />;
}
