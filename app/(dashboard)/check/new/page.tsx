"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Marque } from "@/components/brand/Marque";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { CategoryPicker } from "@/components/check/CategoryPicker";
import { PhotoUploader } from "@/components/check/PhotoUploader";
import type { Category, Brand, Model, PhotoSlot } from "@/lib/types";
import { facts } from "@/lib/site-facts";
import { NO_AUTH_POINTS } from "@/lib/analyzable";
import { lignesDeMarquePreselection } from "@/lib/catalogue-recherche";
import { CHECKOUT_ERROR_PARAM, checkoutErrorMessage } from "@/lib/checkout-errors";
import { SUBSCRIPTIONS_ON_SALE } from "@/lib/stripe/config";
import {
  ANALYSIS_CLIENT_TIMEOUT_SECONDS,
  NOT_STARTED_STATUSES,
} from "@/lib/analysis-limits";

const FACTS = facts();

/**
 * Issue de la requête d'analyse, vue du client :
 * - "report" : aller sur la page de l'analyse. C'est le cas du succès, mais
 *   aussi de toute issue INCERTAINE (connexion coupée, délai du client dépassé,
 *   réponse illisible comme un 504 de Vercel, 409) : le serveur a pu finir,
 *   enregistrer le rapport et décompter le crédit. La page de l'analyse dit
 *   la vérité (rapport, en cours, ou échec).
 * - "error" : la route a répondu par un refus ou un échec qu'elle a écrit
 *   elle-même ; son message dit si un crédit a été décompté ou reste à
 *   rendre, et s'affiche sur le formulaire.
 */
type LaunchOutcome = { kind: "report" } | { kind: "error"; message: string };

async function launchAnalysis(body: {
  analysisId: string;
  variant_selected: string | null;
  collab_selected: string | null;
}): Promise<LaunchOutcome> {
  // Un peu au-delà de la durée maximale de la fonction : la réponse de la
  // route, ou le 504 de la plateforme, arrive toujours avant.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ANALYSIS_CLIENT_TIMEOUT_SECONDS * 1000);
  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    return { kind: "report" };
  } finally {
    clearTimeout(timer);
  }

  // 409 : l'analyse n'est plus à lancer (déjà lancée, ou classée en échec).
  if (response.ok || response.status === 409) return { kind: "report" };

  // Toutes les réponses d'erreur de la route portent un message texte. Tout
  // autre corps vient d'ailleurs (plateforme, proxy) : issue incertaine.
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // corps illisible
  }
  const message =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as { error: unknown }).error
      : null;
  return typeof message === "string" && message.length > 0
    ? { kind: "error", message }
    : { kind: "report" };
}

/** Étape du lancement : envoi des photos, puis analyse par la route. */
type SubmitPhase = "idle" | "uploading" | "analyzing";

interface PhotoFile {
  file: File;
  preview: string;
  width: number;
  height: number;
}

export default function NewCheckPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  // Stepper state
  const [step, setStep] = useState(1);

  // Step 1
  const [category, setCategory] = useState<Category | null>(null);

  // Step 2
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  // État BRUT : ce que l'utilisateur — ou la pré-sélection ?brand= — a choisi.
  // Personne ne le purge : c'est la DÉRIVATION ci-dessous qui garantit la
  // cohérence, à chaque rendu. Purger depuis un effet supposait que l'effet
  // tourne au bon moment ; c'est précisément cette hypothèse qui était fausse.
  const [brandChoice, setBrandChoice] = useState<Brand | null>(null);
  const [modelChoice, setModelChoice] = useState<Model | null>(null);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // La seule version cohérente de la sélection, recalculée à chaque rendu.
  // Une marque n'existe que si elle appartient à la catégorie courante ; un
  // modèle, que s'il appartient à la marque retenue. L'état incohérent devient
  // irreprésentable : aucun site d'appel n'a plus à penser à purger quoi que ce
  // soit, et l'ordre d'exécution des effets n'entre plus en jeu.
  const selectedBrand =
    brandChoice && brandChoice.category === category ? brandChoice : null;
  const selectedModel =
    selectedBrand && modelChoice?.brand_id === selectedBrand.id
      ? modelChoice
      : null;

  // Drapeau MONOTONE (false -> true, jamais reconsommé) : tout geste explicite
  // de l'utilisateur ferme définitivement la porte à la pré-sélection, qui
  // pourrait atterrir après lui et écraser son choix. Un jeton à usage unique
  // aurait le défaut inverse — rester armé quand personne ne le consomme, et
  // manger une action légitime plus tard.
  const userTouched = useRef(false);

  function chooseBrand(brand: Brand | null) {
    userTouched.current = true;
    setBrandChoice(brand);
  }
  function chooseModel(model: Model | null) {
    userTouched.current = true;
    setModelChoice(model);
  }

  // Step 3 — Variant & Collab
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<string | null>(null);

  // Step 4
  const [photos, setPhotos] = useState<Record<string, PhotoFile>>({});
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitting = phase !== "idle";

  // Paywall (zero-credit) modal state
  const [showPaywall, setShowPaywall] = useState(false);

  // Garde d'entrée : fetch crédits + plan AVANT d'autoriser l'accès au flow.
  // Si 0 crédits ET plan ≠ business → écran paywall plein écran (bloque tout).
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [hasCredits, setHasCredits] = useState(false);

  // Erreur de checkout Stripe (?error=stripe_unavailable&reason=<code>), affichée
  // dans le banner rouge du paywall. Le message vient d'une table fixe, jamais
  // du texte de l'URL (lib/checkout-errors.ts).
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === CHECKOUT_ERROR_PARAM) {
      setCheckoutError(checkoutErrorMessage(params.get("reason")));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?redirect=/check/new");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits_remaining, subscription_plan")
        .eq("id", user.id)
        .single();
      if (!mounted) return;
      const isBusiness = profile?.subscription_plan === "business";
      const credits = profile?.credits_remaining ?? 0;
      setHasCredits(isBusiness || credits > 0);
      setCreditsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  // Pre-select brand/model from URL query params (?brand=Nike&model=Air+Jordan+1)
  // Using window.location.search (client-side only) avoids the Suspense requirement
  // that useSearchParams() would impose in Next.js 14.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get("brand");
    const categoryParam = params.get("category");
    const modelParam = params.get("model");
    if (!brandParam) return;

    // Garde d'annulation, sur le motif de l'effet crédits ci-dessus : l'effet A
    // écrit après deux allers-retours réseau, il doit pouvoir être désarmé.
    // Neutralise aussi le double-invoke de Strict Mode en dev.
    let cancelled = false;

    async function preselect() {
      // Fetch brand by name (case-insensitive), filtered by category if provided.
      // Category filter is required when multiple DB entries share the same brand name
      // (multi-category brands like Balenciaga, Dior, Gucci, etc.).
      // Seules les lignes ayant au moins un modèle analysable comptent
      // (lib/analyzable.ts) : sans category, une ligne sans modèle, comme Gucci
      // en sneakers, ne doit jamais être retenue.
      // Hors montres aussi : la route d'analyse les refuse (lib/catalogue-recherche.ts).
      const { data: brandRows } = await lignesDeMarquePreselection(supabase, brandParam!, categoryParam);

      // Sans category, une marque peut avoir plusieurs lignes (Dior : sacs,
      // sneakers, vêtements) : la ligne qui porte le modèle demandé l'emporte,
      // sinon la plus ancienne, celle des sacs pour les maisons de luxe.
      const candidates = (brandRows ?? []) as Brand[];
      let brandData = candidates[0];
      if (!brandData) return;
      let modelData: Model | undefined;
      if (modelParam) {
        const { data: modelRows } = await supabase
          .from("models")
          .select("*")
          .in("brand_id", candidates.map((b) => b.id))
          .ilike("name", modelParam!)
          .eq("is_active", true)
          .neq("authentication_points", NO_AUTH_POINTS)
          .limit(1);
        modelData = modelRows?.[0] as Model | undefined;
        if (modelData) brandData = candidates.find((b) => b.id === modelData?.brand_id) ?? brandData;
      }
      // L'utilisateur est arrivé le premier : il gagne, on n'écrit rien.
      if (cancelled || userTouched.current) return;

      setCategory(brandData.category as Category);
      setBrandChoice(brandData);
      if (modelData) {
        setModelChoice(modelData);
        setStep(3); // Brand + model set → jump to variant/collab step
      } else {
        setStep(2); // Brand set, model absent or not found → stay on picker
      }
    }

    preselect();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // Fetch brands when category changes
  useEffect(() => {
    if (!category) return;
    // Chargement seul : la purge de la sélection aval a disparu d'ici. Elle
    // écrasait la marque que preselect venait de poser au même commit.
    setLoadingBrands(true);
    setBrands([]);

    // Marques ayant au moins un modèle analysable : voir lib/analyzable.ts
    supabase
      .from("brands")
      .select("*, models!inner()")
      .eq("category", category)
      .eq("is_active", true)
      .eq("models.is_active", true)
      .neq("models.authentication_points", NO_AUTH_POINTS)
      .order("name")
      .then(({ data }) => {
        setBrands((data as Brand[]) ?? []);
        setLoadingBrands(false);
      });
  }, [category, supabase]);

  // Fetch models when brand changes
  useEffect(() => {
    if (!selectedBrand) return;
    setLoadingModels(true);
    setModels([]);

    supabase
      .from("models")
      .select("*")
      .eq("brand_id", selectedBrand.id)
      .eq("is_active", true)
      // Modèles sans point d'authentification exclus : voir lib/analyzable.ts
      .neq("authentication_points", NO_AUTH_POINTS)
      .order("name")
      .then(({ data }) => {
        setModels((data as Model[]) ?? []);
        setLoadingModels(false);
      });
  }, [selectedBrand, supabase]);

  // Normalize photo_protocol: old brands (migration 001) used "type" instead of "name".
  // Migration 005 fixes the DB, but this fallback handles any stale data in-flight.
  const protocol: PhotoSlot[] = selectedModel && selectedBrand
    ? (selectedBrand.photo_protocol as unknown as Array<{ name?: string; type?: string; label: string; required: boolean }>).map(
        (slot) => ({
          name: (slot.name ?? slot.type ?? ""),
          label: slot.label,
          required: slot.required,
        })
      )
    : [];

  // Photos demandées, lues dans le protocole de la ligne de marque : c'est ce
  // que l'étape 4 exige (emplacements obligatoires) et permet (tous les
  // emplacements). Les champs min_photos / max_photos des modèles ne sont pas
  // tenus à jour et ne doivent pas être affichés.
  const protocolSlots = selectedBrand?.photo_protocol ?? [];
  const photosRequired = protocolSlots.filter((s) => s.required).length;
  const photosTotal = protocolSlots.length;
  const photosRange = photosRequired < photosTotal ? `${photosRequired}–${photosTotal}` : `${photosTotal}`;

  const requiredSlots = protocol.filter((s) => s.required);
  const allRequiredUploaded = requiredSlots.every((s) => photos[s.name]);

  const canProceed = () => {
    switch (step) {
      case 1: return category !== null;
      case 2: return selectedBrand !== null && selectedModel !== null;
      // variante/collab restent facultatives, mais l'étape n'a de sens que si
      // marque ET modèle tiennent : sinon « Analyser » s'active pour un submit
      // qui retombera sur le return muet de handleSubmit.
      case 3: return selectedBrand !== null && selectedModel !== null;
      case 4: return allRequiredUploaded;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 4 && canProceed()) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) {
      if (step === 2) {
        chooseBrand(null);
        chooseModel(null);
      }
      if (step === 3) {
        setSelectedVariant(null);
        setSelectedCollab(null);
      }
      if (step === 4) {
        setPhotos({});
      }
      setStep(step - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!category || !selectedBrand || !selectedModel || !allRequiredUploaded) return;

    setPhase("uploading");
    setSubmitError(null);
    // Vrai dès que la page part ailleurs : le bouton reste alors désactivé,
    // pour qu'un second clic ne crée pas une seconde analyse.
    let leaving = false;
    // Identifiant de l'analyse dès sa création : une erreur avant le
    // lancement la clôt en « failed » (rien n'est débité avant la route).
    let createdId: string | null = null;
    // Identifiant de l'analyse dès que la requête d'analyse est partie : toute
    // issue incertaine renvoie alors vers sa page.
    let launchedId: string | null = null;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        leaving = true;
        router.push("/auth");
        return;
      }

      // Check credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits_remaining")
        .eq("id", user.id)
        .single();

      if (!profile || profile.credits_remaining < 1) {
        // Pas de crédit → afficher le modal paywall (formules en vente)
        setShowPaywall(true);
        return;
      }

      // Create analysis record
      const { data: analysis, error: analysisError } = await supabase
        .from("analyses")
        .insert({
          user_id: user.id,
          brand_id: selectedBrand.id,
          model_id: selectedModel.id,
          category,
          status: "uploading",
        })
        .select("id")
        .single();

      if (analysisError || !analysis) {
        setSubmitError(t("check.errorCreate"));
        return;
      }
      createdId = analysis.id;

      // Upload photos to Supabase Storage. Tant que la route n'est pas
      // appelée, rien ne peut être débité : les messages le disent.
      const photoEntries = Object.entries(photos);
      setUploadProgress({ done: 0, total: photoEntries.length });
      for (let i = 0; i < photoEntries.length; i++) {
        const [photoType, photoFile] = photoEntries[i];
        // Extension réduite à des lettres et des chiffres : le chemin reste un
        // nom simple, le seul que la base accepte (migration 018, même règle
        // que lib/photo-path.ts).
        const ext =
          (photoFile.file.name.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "jpg";
        const storagePath = `${user.id}/${analysis.id}/${photoType}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("analysis-photos")
          .upload(storagePath, photoFile.file, {
            contentType: photoFile.file.type,
            upsert: true,
          });

        if (uploadError) {
          // Mark analysis as failed so it doesn't stay stuck on "uploading"
          await supabase
            .from("analyses")
            .update({ status: "failed" })
            .eq("id", analysis.id);
          // Libellé de l'emplacement (« Semelle »…), normalisé comme `protocol`.
          const slots = selectedBrand.photo_protocol as unknown as Array<{ name?: string; type?: string; label: string }>;
          const label = slots.find((slot) => (slot.name ?? slot.type) === photoType)?.label ?? photoType;
          setSubmitError(t("check.errorUpload").replace("{photo}", label));
          return;
        }

        // Create analysis_photos record
        const { error: photoRecordError } = await supabase
          .from("analysis_photos")
          .insert({
            analysis_id: analysis.id,
            user_id: user.id,
            storage_path: storagePath,
            photo_type: photoType,
            order_index: i,
            quality_check: {
              width: photoFile.width,
              height: photoFile.height,
              passed: true,
            },
          });

        if (photoRecordError) {
          await supabase
            .from("analyses")
            .update({ status: "failed" })
            .eq("id", analysis.id);
          setSubmitError(t("check.errorPhotoRecord"));
          return;
        }
        setUploadProgress({ done: i + 1, total: photoEntries.length });
      }

      // Toutes les photos sont envoyées : l'analyse passe à « pending »
      // (lancement demandé). Si la requête qui suit n'arrive jamais à la
      // route, sa page le dit et la classe en échec au bout de
      // LAUNCH_STALE_AFTER_SECONDS, au lieu d'annoncer un envoi en cours.
      // Conditionnel : une analyse déjà classée en échec n'est pas relancée.
      // Si cette écriture échoue, la route accepte aussi « uploading » : le
      // lancement reste possible.
      setPhase("analyzing");
      await supabase
        .from("analyses")
        .update({ status: "pending" })
        .eq("id", analysis.id)
        .eq("status", "uploading");

      // Appel de la route d'analyse.
      launchedId = analysis.id;
      const outcome = await launchAnalysis({
        analysisId: analysis.id,
        variant_selected: selectedVariant !== "Standard" ? selectedVariant : null,
        collab_selected: selectedCollab,
      });

      if (outcome.kind === "error") {
        // Refus avant lancement (crédits, limite de débit…) : l'analyse reste
        // « pending » (ou « uploading »). On la clôt ici, comme après un échec
        // d'envoi, pour qu'elle n'apparaisse pas « en cours » dans le tableau
        // de bord. Si la route l'a déjà passée à « failed », cette mise à jour
        // ne touche rien.
        await supabase
          .from("analyses")
          .update({ status: "failed" })
          .eq("id", analysis.id)
          .in("status", [...NOT_STARTED_STATUSES]);
        setSubmitError(outcome.message);
        return;
      }

      leaving = true;
      router.push(`/check/${analysis.id}`);
    } catch {
      if (launchedId) {
        // Requête d'analyse partie : le serveur a pu aller au bout. Sa page
        // dit où elle en est.
        leaving = true;
        router.push(`/check/${launchedId}`);
        return;
      }
      // Erreur avant le lancement : la route n'a pas été appelée, rien n'est
      // débité. L'analyse créée est close, comme dans les branches d'erreur
      // ci-dessus, pour ne pas rester « non lancée » dans l'historique. Si
      // cette écriture échoue aussi, la reprise la classera plus tard.
      if (createdId) {
        try {
          await supabase
            .from("analyses")
            .update({ status: "failed" })
            .eq("id", createdId)
            .in("status", [...NOT_STARTED_STATUSES]);
        } catch {
          // reprise différée : voir lib/analysis-stale.ts
        }
      }
      setSubmitError(t("check.errorBeforeLaunch"));
    } finally {
      if (!leaving) {
        setPhase("idle");
        setUploadProgress(null);
      }
    }
  }, [
    category,
    selectedBrand,
    selectedModel,
    allRequiredUploaded,
    photos,
    selectedVariant,
    selectedCollab,
    supabase,
    router,
    t,
  ]);

  // Nav réutilisée par les 3 états (loading, paywall, flow normal)
  const navbar = (
    <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Marque href="/dashboard" />
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );

  // ── Garde 1 : loader pendant le fetch des crédits ──────────────────────────
  if (creditsLoading) {
    return (
      <div className="min-h-screen bg-background">
        {navbar}
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  // ── Garde 2 : écran paywall si 0 crédits (bloque l'accès au flow) ─────────
  if (!hasCredits) {
    return (
      <div className="min-h-screen bg-background">
        {navbar}
        <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
          {checkoutError && (
            <div
              role="alert"
              className="mb-4 w-full max-w-md rounded-md border border-destructive/30 bg-destructive/10 p-4 text-ui text-destructive"
            >
              <p className="font-semibold">Paiement Stripe indisponible</p>
              <p className="mt-1 text-caption text-destructive/80">{checkoutError}</p>
              <p className="mt-2 text-caption text-destructive/60">
                {t("check.retryLater")}
              </p>
            </div>
          )}
          <div className="relative w-full max-w-md overflow-hidden rounded-md border border-line bg-card p-8 shadow-card">
            <div className="relative text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-line bg-surface-raised">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <h1 className="mt-4 font-heading text-h3 font-bold">
                {t("check.noCredits")}
              </h1>
              <p className="mt-2 text-ui text-muted-foreground">
                {t("check.buyCredits")}
              </p>
            </div>
            <div className="relative mt-6 space-y-3">
              <button
                onClick={() => { window.location.href = "/checkout?plan=single"; }}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-md bg-accent px-5 text-ui font-semibold text-accent-foreground shadow-card transition-[color,background-color,border-color,transform] duration-fast hover:scale-[1.02] hover:bg-accent-hover active:scale-100"
              >
                <span>{t("pricing.single")}</span>
                <span className="font-heading text-body">{FACTS.priceSingle}</span>
              </button>
              {SUBSCRIPTIONS_ON_SALE && (
                <>
                  <button
                    onClick={() => { window.location.href = "/checkout?plan=pro"; }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-5 text-ui font-semibold text-foreground transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                  >
                    <span>{t("pricing.proDesc")}</span>
                    <span className="font-heading text-body">{FACTS.pricePro}{t("check.perMonth")}</span>
                  </button>
                  <button
                    onClick={() => { window.location.href = "/checkout?plan=business"; }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-5 text-ui font-semibold text-foreground transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                  >
                    <span>{t("pricing.premiumDesc")}</span>
                    <span className="font-heading text-body">{FACTS.priceBusiness}{t("check.perMonth")}</span>
                  </button>
                </>
              )}
            </div>
            <div className="relative mt-5 flex items-center justify-between text-caption text-subtle">
              <span>{t("check.paymentSecure")}</span>
              <Link
                href="/dashboard"
                className="text-subtle transition-colors duration-fast hover:text-foreground"
              >
                Retour
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Flow normal : utilisateur a au moins 1 crédit (ou plan business) ──────
  return (
    <div className="min-h-screen bg-background">
      {navbar}

      {/* pb-24 : la bulle de l'assistant (fixe, en bas à droite) ne couvre plus
          « Lancer l'analyse », dernier élément de la page. */}
      <main className="mx-auto max-w-3xl px-4 pt-8 pb-24 sm:pt-12">
        {/* M5 : banner stripe_unavailable visible aussi dans le flow normal */}
        {checkoutError && (
          <div
            role="alert"
            className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-ui text-destructive"
          >
            <p className="font-semibold">Paiement Stripe indisponible</p>
            <p className="mt-1 text-caption text-destructive/80">{checkoutError}</p>
          </div>
        )}

        {/* Stepper indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-ui font-semibold transition-colors duration-fast ${
                  s === step
                    ? "bg-accent text-accent-foreground"
                    : s < step
                      ? "bg-accent/10 text-accent"
                      : "bg-surface-raised text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Category — auto-advance vers step 2 dès la sélection */}
        {step === 1 && (
          <CategoryPicker
            selected={category}
            onSelect={(cat) => {
              userTouched.current = true;
              setCategory(cat);
              setStep(2);
            }}
          />
        )}

        {/* Step 2: Brand & Model */}
        {step === 2 && (
          <div>
            {!selectedBrand ? (
              <>
                <h2 className="font-heading text-h3 font-bold">
                  {t("check.brand")}
                </h2>
                <p className="mt-2 text-ui text-muted-foreground">
                  {t("check.brandSubtitle")}
                </p>
                {loadingBrands ? (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  </div>
                ) : brands.length === 0 ? (
                  <p className="mt-8 text-center text-ui text-muted-foreground">
                    {t("check.brandEmpty")}
                  </p>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => chooseBrand(brand)}
                        className="flex flex-col items-center gap-3 rounded-md border border-line-subtle bg-card p-6 text-center transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                      >
                        <span className="font-heading text-lead font-semibold">
                          {brand.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : !selectedModel ? (
              <>
                <button
                  onClick={() => chooseBrand(null)}
                  className="mb-6 flex items-center gap-1 text-ui text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  {t("check.backToBrands")}
                </button>
                <h2 className="font-heading text-h3 font-bold">
                  {t("check.modelTitlePrefix")}{" "}
                  <span className="text-foreground">
                    {selectedBrand.name}
                  </span>{" "}
                  ?
                </h2>
                <p className="mt-2 text-ui text-muted-foreground">
                  {t("check.modelSubtitle")}
                </p>
                {loadingModels ? (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  </div>
                ) : models.length === 0 ? (
                  <p className="mt-8 text-center text-ui text-muted-foreground">
                    {t("check.modelEmpty")}
                  </p>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          chooseModel(model);
                          setStep(3);
                        }}
                        className="flex flex-col items-center gap-2 rounded-md border border-line-subtle bg-card p-6 text-center transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                      >
                        <span className="font-heading font-semibold">
                          {model.name}
                        </span>
                        <span className="text-caption text-muted-foreground">
                          {photosRange} {t("check.photosCount")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <button
                  onClick={() => chooseModel(null)}
                  className="mb-6 flex items-center gap-1 text-ui text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  {t("check.backToModels")}
                </button>
                <div className="rounded-md border border-line bg-surface-raised p-6">
                  <p className="text-ui text-muted-foreground">
                    {t("check.selection")}
                  </p>
                  <p className="mt-1 font-heading text-lead font-bold">
                    {selectedBrand.name} — {selectedModel.name}
                  </p>
                  <p className="mt-1 text-ui text-muted-foreground">
                    {photosRequired} {t("check.photosRequired")}
                    {photosRequired < photosTotal && `, ${t("check.photosUpTo")} ${photosTotal}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Variante & Collaboration */}
        {step === 3 && selectedBrand && selectedModel && (
          <div>
            <h2 className="font-heading text-h3 font-bold">
              {t("check.variantTitle")}
            </h2>
            <p className="mt-2 text-ui text-muted-foreground">
              {t("check.variantSubtitle")}
            </p>

            {/* Variantes */}
            {selectedModel.variants && selectedModel.variants.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-ui font-medium text-foreground">
                  Variante du{" "}
                  <span className="text-foreground">
                    {selectedBrand?.name} {selectedModel.name}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(selectedVariant === v ? null : v)}
                      className={`rounded-full border px-4 py-1.5 text-ui font-medium transition-colors duration-fast ${
                        selectedVariant === v
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line bg-surface-raised text-muted-foreground hover:border-line-strong hover:text-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedVariant("Standard")}
                    className={`rounded-full border px-4 py-1.5 text-ui font-medium transition-colors duration-fast ${
                      selectedVariant === "Standard"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line bg-surface-raised text-muted-foreground hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    Autre / Standard
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-md border border-line-subtle bg-surface px-4 py-3 text-ui text-muted-foreground">
                {t("check.noVariants")}
              </div>
            )}

            {/* Collaborations */}
            {selectedModel.collaborations && selectedModel.collaborations.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-ui font-medium text-foreground">
                  Collaboration (optionnel)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.collaborations.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCollab(selectedCollab === c.name ? null : c.name)}
                      title={c.detail || undefined}
                      className={`rounded-full border px-4 py-1.5 text-ui font-medium transition-colors duration-fast ${
                        selectedCollab === c.name
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line bg-surface-raised text-muted-foreground hover:border-line-strong hover:text-foreground"
                      }`}
                    >
                      ✦ {c.name}
                      {c.detail ? (
                        <span className="ml-1.5 text-caption opacity-70">
                          {c.detail}
                        </span>
                      ) : null}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCollab(null)}
                    className={`rounded-full border px-4 py-1.5 text-ui font-medium transition-colors duration-fast ${
                      selectedCollab === null
                        ? "border-line-strong bg-surface-hover text-foreground"
                        : "border-line bg-surface-raised text-muted-foreground hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    Pas de collab / Standard
                  </button>
                </div>
              </div>
            )}

            {/* Récap sélection */}
            {(selectedVariant || selectedCollab) && (
              <div className="mt-6 rounded-md border border-line bg-surface-raised px-4 py-3 text-ui">
                <span className="text-muted-foreground">Analyse ciblée sur : </span>
                <span className="font-semibold text-foreground">
                  {[selectedBrand?.name, selectedModel?.name, selectedVariant !== "Standard" ? selectedVariant : null, selectedCollab].filter(Boolean).join(" — ")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div>
            <div className="mb-6 rounded-md border border-line-subtle bg-card p-4">
              <p className="text-ui text-muted-foreground">
                {[selectedBrand?.name, selectedModel?.name, selectedVariant !== "Standard" ? selectedVariant : null, selectedCollab].filter(Boolean).join(" — ")}
              </p>
            </div>
            <PhotoUploader
              protocol={protocol}
              photos={photos}
              onPhotosChange={setPhotos}
            />

            {submitError && (
              <div className="mt-6 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-ui text-destructive">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons — auto-advance pour step 1+2, bouton conservé pour step 3+4 */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={step === 1 ? () => router.push("/dashboard") : handleBack}
            disabled={submitting}
            className="flex items-center gap-2 rounded-md border border-line px-5 py-2.5 text-ui font-medium transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent"
          >
            <ArrowLeft className="size-4" />
            {step === 1 ? "Dashboard" : "Retour"}
          </button>

          {step === 3 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent"
            >
              {t("check.continueToPhotos")}
              <ArrowRight className="size-4" />
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={!allRequiredUploaded || submitting}
              className="flex items-center gap-2 rounded-md bg-accent px-6 py-2.5 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card disabled:opacity-40 disabled:hover:bg-accent disabled:hover:shadow-none"
            >
              {phase === "uploading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("check.uploadingPhotos")}
                  {uploadProgress ? ` ${uploadProgress.done}/${uploadProgress.total}` : ""}…
                </>
              ) : phase === "analyzing" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("check.analyzing")}
                </>
              ) : (
                t("check.analyze")
              )}
            </button>
          )}
        </div>
        {/* Durée annoncée : médiane mesurée (site-facts), borne = délai au-delà
            duquel le rapport ou l'échec s'affiche (lib/analysis-limits.ts). */}
        {step === 4 && submitting && (
          <p aria-live="polite" className="mt-3 text-right text-caption text-muted-foreground">
            {phase === "uploading" ? t("check.uploadingHint") : t("check.analyzingHint")}
          </p>
        )}
      </main>

      {/* ── Paywall modal — affiché si l'utilisateur n'a aucun crédit ───────── */}
      {showPaywall && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paywall-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowPaywall(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-md border border-line bg-card p-8 shadow-card"
          >

            <button
              onClick={() => setShowPaywall(false)}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-line bg-surface-raised text-muted-foreground transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="relative text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-line bg-surface-raised">
                <Sparkles className="size-6 text-muted-foreground" />
              </div>
              <h3
                id="paywall-title"
                className="mt-4 font-heading text-h3 font-bold"
              >
                Aucun crédit d&apos;analyse
              </h3>
              <p className="mt-2 text-ui text-muted-foreground">
                {SUBSCRIPTIONS_ON_SALE
                  ? "Choisissez une formule pour lancer votre analyse."
                  : "Achetez un crédit pour lancer votre analyse."}
              </p>
            </div>

            <div className="relative mt-6 space-y-3">
              <button
                onClick={() => { window.location.href = "/checkout?plan=single"; }}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-md bg-accent px-5 text-ui font-semibold text-accent-foreground shadow-card transition-[color,background-color,border-color,transform] duration-fast hover:scale-[1.02] hover:bg-accent-hover active:scale-100"
              >
                <span>{t("pricing.single")}</span>
                <span className="font-heading text-body">{FACTS.priceSingle}</span>
              </button>
              {SUBSCRIPTIONS_ON_SALE && (
                <>
                  <button
                    onClick={() => { window.location.href = "/checkout?plan=pro"; }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-5 text-ui font-semibold text-foreground transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                  >
                    <span>{t("pricing.proDesc")}</span>
                    <span className="font-heading text-body">{FACTS.pricePro}{t("check.perMonth")}</span>
                  </button>
                  <button
                    onClick={() => { window.location.href = "/checkout?plan=business"; }}
                    className="flex h-12 w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-5 text-ui font-semibold text-foreground transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
                  >
                    <span>{t("pricing.premiumDesc")}</span>
                    <span className="font-heading text-body">{FACTS.priceBusiness}{t("check.perMonth")}</span>
                  </button>
                </>
              )}
            </div>

            <p className="relative mt-5 text-center text-caption text-subtle">
              {t("check.paymentSecure")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
