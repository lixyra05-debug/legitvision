"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
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

  // Step 3
  const [photos, setPhotos] = useState<Record<string, PhotoFile>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const protocol: PhotoSlot[] = selectedModel
    ? (selectedBrand?.photo_protocol ?? [])
    : [];

  const requiredSlots = protocol.filter((s) => s.required);
  const allRequiredUploaded = requiredSlots.every((s) => photos[s.type]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return category !== null;
      case 2:
        return selectedBrand !== null && selectedModel !== null;
      case 3:
        return allRequiredUploaded;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3 && canProceed()) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) {
      if (step === 2) {
        setSelectedBrand(null);
        setSelectedModel(null);
      }
      if (step === 3) {
        setPhotos({});
      }
      setStep(step - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!category || !selectedBrand || !selectedModel || !allRequiredUploaded)
      return;

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
        body: JSON.stringify({ analysisId: analysis.id }),
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
    supabase,
    router,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-emerald-500" />
            <span className="font-heading text-lg font-bold tracking-tight">
              LegitVision
            </span>
          </Link>
          <UserMenu />
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* Stepper indicator */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
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
              {s < 3 && (
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

        {/* Step 3: Photos */}
        {step === 3 && (
          <div>
            <div className="mb-6 rounded-xl border border-white/5 bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {selectedBrand?.name} — {selectedModel?.name}
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

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500"
            >
              Suivant
              <ArrowRight className="size-4" />
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
