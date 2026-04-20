"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/auth/UserMenu";
import { CategoryPicker } from "@/components/check/CategoryPicker";
import { PhotoUploader } from "@/components/check/PhotoUploader";
import type { Category, Brand, Model, PhotoSlot } from "@/lib/types";

interface PhotoFile {
  file: File;
  preview: string;
  width: number;
  height: number;
}

export default function NewCheckPage() {
  const router = useRouter();
  const supabase = createClient();

  // Stepper state
  const [step, setStep] = useState(1);

  // Step 1
  const [category, setCategory] = useState<Category | null>(null);

  // Step 2
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Step 3 — Variant & Collab
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<string | null>(null);

  // Step 4
  const [photos, setPhotos] = useState<Record<string, PhotoFile>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-select brand/model from URL query params (?brand=Nike&model=Air+Jordan+1)
  // Using window.location.search (client-side only) avoids the Suspense requirement
  // that useSearchParams() would impose in Next.js 14.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get("brand");
    const categoryParam = params.get("category");
    const modelParam = params.get("model");
    if (!brandParam) return;

    async function preselect() {
      // Fetch brand by name (case-insensitive), filtered by category if provided.
      // Category filter is required when multiple DB entries share the same brand name
      // (multi-category brands like Balenciaga, Dior, Gucci, etc.).
      const { data: brandData } = await (categoryParam
        ? supabase.from("brands").select("*").ilike("name", brandParam!).eq("is_active", true).eq("category", categoryParam)
        : supabase.from("brands").select("*").ilike("name", brandParam!).eq("is_active", true)
      ).maybeSingle();

      if (!brandData) return;

      setCategory(brandData.category as Category);
      setSelectedBrand(brandData as Brand);

      if (modelParam) {
        // Fetch model by name within this brand
        const { data: modelData } = await supabase
          .from("models")
          .select("*")
          .eq("brand_id", brandData.id)
          .ilike("name", modelParam!)
          .eq("is_active", true)
          .maybeSingle();

        if (modelData) {
          setSelectedModel(modelData as Model);
          setStep(3); // Brand + model set → jump to variant/collab step
        } else {
          setStep(2); // Brand set, model not found → stay on picker
        }
      } else {
        setStep(2); // Brand set, no model param → stay on picker
      }
    }

    preselect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // Fetch brands when category changes
  useEffect(() => {
    if (!category) return;
    setLoadingBrands(true);
    setBrands([]);
    setSelectedBrand(null);
    setSelectedModel(null);
    setModels([]);

    supabase
      .from("brands")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
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
    setSelectedModel(null);

    supabase
      .from("models")
      .select("*")
      .eq("brand_id", selectedBrand.id)
      .eq("is_active", true)
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

  const requiredSlots = protocol.filter((s) => s.required);
  const allRequiredUploaded = requiredSlots.every((s) => photos[s.name]);

  const canProceed = () => {
    switch (step) {
      case 1: return category !== null;
      case 2: return selectedBrand !== null && selectedModel !== null;
      case 3: return true; // variant/collab always skippable
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
        setSelectedBrand(null);
        setSelectedModel(null);
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
        setSubmitError(
          "Crédits insuffisants. Rechargez votre compte pour continuer."
        );
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
        setSubmitError("Erreur lors de la création de l'analyse.");
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
          setSubmitError(`Erreur upload photo "${photoType}": ${uploadError.message}`);
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
          setSubmitError("Erreur lors de l'enregistrement des photos.");
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
          "Le serveur a retourné une réponse invalide. Vérifiez les logs serveur."
        );
        return;
      }

      if (!analyzeResponse.ok) {
        setSubmitError(
          analyzeResult.error ?? "Erreur lors de l'analyse."
        );
        return;
      }

      router.push(`/check/${analysis.id}`);
    } catch {
      setSubmitError("Une erreur inattendue est survenue.");
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

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={240}
              height={64}
              className="h-16 w-auto"
              priority
              unoptimized
            />
          </Link>
          <UserMenu />
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* Stepper indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  s === step
                    ? "bg-emerald-500 text-white"
                    : s < step
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-white/5 text-muted-foreground"
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

        {/* Step 1: Category */}
        {step === 1 && (
          <CategoryPicker
            selected={category}
            onSelect={(cat) => {
              setCategory(cat);
            }}
          />
        )}

        {/* Step 2: Brand & Model */}
        {step === 2 && (
          <div>
            {!selectedBrand ? (
              <>
                <h2 className="font-heading text-xl font-bold sm:text-2xl">
                  Quelle marque ?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sélectionnez la marque de votre article
                </p>
                {loadingBrands ? (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-emerald-500" />
                  </div>
                ) : brands.length === 0 ? (
                  <p className="mt-8 text-center text-sm text-muted-foreground">
                    Aucune marque disponible pour cette catégorie.
                  </p>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand)}
                        className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-card p-6 text-center transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
                      >
                        <span className="font-heading text-lg font-semibold">
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
                  onClick={() => setSelectedBrand(null)}
                  className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Retour aux marques
                </button>
                <h2 className="font-heading text-xl font-bold sm:text-2xl">
                  Quel modèle{" "}
                  <span className="text-emerald-500">
                    {selectedBrand.name}
                  </span>{" "}
                  ?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sélectionnez le modèle exact
                </p>
                {loadingModels ? (
                  <div className="mt-12 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-emerald-500" />
                  </div>
                ) : models.length === 0 ? (
                  <p className="mt-8 text-center text-sm text-muted-foreground">
                    Aucun modèle disponible pour cette marque.
                  </p>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-card p-6 text-center transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
                      >
                        <span className="font-heading font-semibold">
                          {model.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {model.min_photos}–{model.max_photos} photos
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Retour aux modèles
                </button>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <p className="text-sm text-muted-foreground">
                    Sélection
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold">
                    {selectedBrand.name} — {selectedModel.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedModel.min_photos}–{selectedModel.max_photos}{" "}
                    photos requises
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Variante & Collaboration */}
        {step === 3 && selectedModel && (
          <div>
            <h2 className="font-heading text-xl font-bold sm:text-2xl">
              Variante &amp; Collaboration
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Précisez la version pour une analyse encore plus ciblée — ou passez directement aux photos.
            </p>

            {/* Variantes */}
            {selectedModel.variants && selectedModel.variants.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Variante du{" "}
                  <span className="text-emerald-400">
                    {selectedBrand?.name} {selectedModel.name}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(selectedVariant === v ? null : v)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                        selectedVariant === v
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedVariant("Standard")}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      selectedVariant === "Standard"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    Autre / Standard
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground">
                Aucune variante connue pour ce modèle.
              </div>
            )}

            {/* Collaborations */}
            {selectedModel.collaborations && selectedModel.collaborations.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Collaboration (optionnel)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.collaborations.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedCollab(selectedCollab === c.name ? null : c.name)}
                      title={c.detail || undefined}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                        selectedCollab === c.name
                          ? "border-amber-500 bg-amber-500/20 text-amber-400"
                          : "border-amber-500/20 bg-amber-500/5 text-amber-400/70 hover:border-amber-500/40 hover:text-amber-400"
                      }`}
                    >
                      ✦ {c.name}
                      {c.detail ? (
                        <span className="ml-1.5 text-[10px] opacity-70">
                          {c.detail}
                        </span>
                      ) : null}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCollab(null)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      selectedCollab === null
                        ? "border-white/20 bg-white/10 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    Pas de collab / Standard
                  </button>
                </div>
              </div>
            )}

            {/* Récap sélection */}
            {(selectedVariant || selectedCollab) && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Analyse ciblée sur : </span>
                <span className="font-semibold text-emerald-400">
                  {[selectedBrand?.name, selectedModel?.name, selectedVariant !== "Standard" ? selectedVariant : null, selectedCollab].filter(Boolean).join(" — ")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div>
            <div className="mb-6 rounded-xl border border-white/5 bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {[selectedBrand?.name, selectedModel?.name, selectedVariant !== "Standard" ? selectedVariant : null, selectedCollab].filter(Boolean).join(" — ")}
              </p>
            </div>
            <PhotoUploader
              protocol={protocol}
              photos={photos}
              onPhotosChange={setPhotos}
            />

            {submitError && (
              <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={step === 1 ? () => router.push("/dashboard") : handleBack}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <ArrowLeft className="size-4" />
            {step === 1 ? "Dashboard" : "Retour"}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500"
            >
              {step === 3 ? "Continuer →" : "Suivant"}
              {step !== 3 && <ArrowRight className="size-4" />}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allRequiredUploaded || submitting}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-40 disabled:hover:bg-emerald-500 disabled:hover:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Upload en cours…
                </>
              ) : (
                "Lancer l'analyse"
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
