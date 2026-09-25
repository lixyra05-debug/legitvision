"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { CategoryPicker } from "@/components/check/CategoryPicker";
import { PhotoUploader } from "@/components/check/PhotoUploader";
import type { Category, Brand, Model, PhotoSlot } from "@/lib/types";
import { facts } from "@/lib/site-facts";
import { NO_AUTH_POINTS } from "@/lib/analyzable";

const FACTS = facts();

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Paywall (zero-credit) modal state
  const [showPaywall, setShowPaywall] = useState(false);

  // Garde d'entrée : fetch crédits + plan AVANT d'autoriser l'accès au flow.
  // Si 0 crédits ET plan ≠ business → écran paywall plein écran (bloque tout).
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [hasCredits, setHasCredits] = useState(false);

  // Erreur de checkout Stripe (lue depuis ?error=stripe_unavailable&reason=...)
  // Affichée dans le banner rouge en haut de l'écran paywall.
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "stripe_unavailable") {
      const reason = params.get("reason");
      setCheckoutError(reason ? decodeURIComponent(reason) : "Erreur Stripe inconnue");
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
      const brandQuery = supabase
        .from("brands")
        .select("*, models!inner()")
        .ilike("name", brandParam!)
        .eq("is_active", true)
        .eq("models.is_active", true)
        .neq("models.authentication_points", NO_AUTH_POINTS);
      const { data: brandRows } = await (categoryParam
        ? brandQuery.eq("category", categoryParam)
        : brandQuery
      ).order("created_at");

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

    setSubmitting(true);
    setSubmitError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
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
        // Pas de crédit → afficher le modal paywall (3 formules Stripe)
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

      // Upload photos to Supabase Storage
      const photoEntries = Object.entries(photos);
      for (let i = 0; i < photoEntries.length; i++) {
        const [photoType, photoFile] = photoEntries[i];
        const ext = photoFile.file.name.split(".").pop() ?? "jpg";
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
          setSubmitError(`${t("check.errorUpload")} "${photoType}": ${uploadError.message}`);
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
      }

      // Call the AI analysis API.
      // Note: the route accepts both "uploading" and "pending" status,
      // so no client-side status update is needed before calling it.
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          variant_selected: selectedVariant !== "Standard" ? selectedVariant : null,
          collab_selected: selectedCollab,
        }),
      });

      // Safely parse JSON — the route may return an HTML error page on
      // unexpected crashes, which would throw on .json().
      let analyzeResult: { error?: string } = {};
      try {
        analyzeResult = await analyzeResponse.json();
      } catch {
        setSubmitError(
          t("check.errorInvalid")
        );
        return;
      }

      if (!analyzeResponse.ok) {
        setSubmitError(
          analyzeResult.error ?? t("check.errorAnalysisFailed")
        );
        return;
      }

      router.push(`/check/${analysis.id}`);
    } catch {
      setSubmitError(t("check.errorUnexpected"));
    } finally {
      setSubmitting(false);
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
  ]);

  // Nav réutilisée par les 3 états (loading, paywall, flow normal)
  const navbar = (
    <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/legitvision-logo.png"
            alt="LegitVision"
            width={240}
            height={64}
            className="h-16 w-auto"
            priority
            fetchPriority="high"
          />
        </Link>
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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
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
            className="flex items-center gap-2 rounded-md border border-line px-5 py-2.5 text-ui font-medium transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover"
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
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("check.uploading")}
                </>
              ) : (
                t("check.analyze")
              )}
            </button>
          )}
        </div>
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
                Choisissez une formule pour lancer votre analyse.
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
