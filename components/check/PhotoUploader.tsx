"use client";

import { useRef, useState, useCallback, type Dispatch, type SetStateAction } from "react";
import { Camera, X, AlertCircle, Check, Loader2 } from "lucide-react";
import type { PhotoSlot } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { translatePhotoLabel } from "@/lib/i18n/photo-labels";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE_MB = 10;
const MIN_DIMENSION = 800;

/** iOS exporte du HEIC/HEIF ; file.type est parfois vide → on teste aussi l'extension. */
function isHeic(file: File): boolean {
  const type = (file.type ?? "").toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  return /\.(heic|heif)$/i.test(file.name);
}

/** Convertit un HEIC/HEIF en JPEG côté client. Import dynamique (lib client-only → pas de SSR). */
async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const jpegBlob = Array.isArray(out) ? out[0] : out;
  const base = file.name.replace(/\.[^./\\]+$/, "") || "photo";
  return new File([jpegBlob], `${base}.jpg`, { type: "image/jpeg" });
}

interface PhotoFile {
  file: File;
  preview: string;
  width: number;
  height: number;
}

interface PhotoUploaderProps {
  protocol: PhotoSlot[];
  photos: Record<string, PhotoFile>;
  onPhotosChange: Dispatch<SetStateAction<Record<string, PhotoFile>>>;
}

type ValidationResult = {
  valid: boolean;
  errorKey?: "format" | "size" | "min" | "read";
  width: number;
  height: number;
};

function validateImage(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      resolve({
        valid: false,
        errorKey: "format",
        width: 0,
        height: 0,
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      resolve({
        valid: false,
        errorKey: "size",
        width: 0,
        height: 0,
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        resolve({
          valid: false,
          errorKey: "min",
          width: img.width,
          height: img.height,
        });
      } else {
        resolve({ valid: true, width: img.width, height: img.height });
      }
    };
    img.onerror = () =>
      resolve({
        valid: false,
        errorKey: "read",
        width: 0,
        height: 0,
      });
    img.src = URL.createObjectURL(file);
  });
}

export function PhotoUploader({
  protocol,
  photos,
  onPhotosChange,
}: PhotoUploaderProps) {
  const { locale, t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [converting, setConverting] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const requiredCount = protocol.filter((s) => s.required).length;
  const uploadedRequired = protocol.filter(
    (s) => s.required && photos[s.name]
  ).length;
  const allRequiredDone = uploadedRequired === requiredCount;

  const buildErrorMessage = useCallback(
    (key: NonNullable<ValidationResult["errorKey"]>, w: number, h: number): string => {
      switch (key) {
        case "format":
          return t("check.photoErrorFormat");
        case "size":
          return `${t("check.photoErrorSize")} : ${MAX_SIZE_MB} MB`;
        case "min":
          return `${t("check.photoErrorMin")} : ${MIN_DIMENSION}×${MIN_DIMENSION}px (${t("check.photoErrorReceived")} ${w}×${h})`;
        case "read":
          return t("check.photoErrorRead");
      }
    },
    [t],
  );

  const handleFileSelect = useCallback(
    async (slotType: string, file: File) => {
      let workingFile = file;

      // iPhone : convertir HEIC/HEIF → JPEG AVANT preview / validation / upload.
      if (isHeic(file)) {
        setConverting((prev) => ({ ...prev, [slotType]: true }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next[slotType];
          return next;
        });
        try {
          workingFile = await convertHeicToJpeg(file);
        } catch (err) {
          console.error("[PhotoUploader] Conversion HEIC échouée:", err);
          setConverting((prev) => {
            const next = { ...prev };
            delete next[slotType];
            return next;
          });
          setErrors((prev) => ({
            ...prev,
            [slotType]: t("check.photoErrorConvert"),
          }));
          return;
        }
        setConverting((prev) => {
          const next = { ...prev };
          delete next[slotType];
          return next;
        });
      }

      const result = await validateImage(workingFile);

      if (!result.valid && result.errorKey) {
        setErrors((prev) => ({
          ...prev,
          [slotType]: buildErrorMessage(result.errorKey!, result.width, result.height),
        }));
        return;
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next[slotType];
        return next;
      });

      const preview = URL.createObjectURL(workingFile);
      onPhotosChange((prev) => {
        const existing = prev[slotType];
        if (existing) {
          URL.revokeObjectURL(existing.preview);
        }
        return {
          ...prev,
          [slotType]: {
            file: workingFile,
            preview,
            width: result.width,
            height: result.height,
          },
        };
      });
    },
    [onPhotosChange, t, buildErrorMessage]
  );

  const handleRemove = useCallback(
    (slotType: string) => {
      onPhotosChange((prev) => {
        const existing = prev[slotType];
        if (existing) {
          URL.revokeObjectURL(existing.preview);
        }
        const next = { ...prev };
        delete next[slotType];
        return next;
      });
    },
    [onPhotosChange]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-h4 font-bold sm:text-h3">
            {t("check.photos")}
          </h2>
          <p className="mt-2 text-ui text-muted-foreground">
            {t("check.photosHelpDesc")}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-ui">
          <span
            className={
              allRequiredDone ? "text-accent" : "text-muted-foreground"
            }
          >
            {uploadedRequired}/{requiredCount}
          </span>
          <span className="text-muted-foreground">requises</span>
          {allRequiredDone && <Check className="size-4 text-accent" />}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {protocol.map((slot) => {
          const photo = photos[slot.name];
          const error = errors[slot.name];
          const isConverting = !!converting[slot.name];

          return (
            <div key={slot.name} className="flex flex-col gap-2">
              <button
                type="button"
                disabled={isConverting}
                onClick={() => inputRefs.current[slot.name]?.click()}
                className={`relative aspect-square overflow-hidden rounded-md border-2 border-dashed transition-colors duration-fast disabled:cursor-wait ${
                  photo
                    ? "border-accent/30"
                    : error
                      ? "border-destructive/30"
                      : "border-line hover:border-line-strong"
                }`}
              >
                {isConverting ? (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-3">
                    <Loader2 className="size-7 animate-spin text-muted-foreground" />
                    <span className="text-center text-caption text-muted-foreground">
                      {t("check.photoConverting")}
                    </span>
                  </div>
                ) : photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob:// preview from URL.createObjectURL, next/image cannot optimize */}
                    <img
                      src={photo.preview}
                      alt={translatePhotoLabel(slot.label, locale)}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(slot.name);
                      }}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-fast hover:bg-destructive"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center text-caption text-white">
                      {photo.width}×{photo.height}
                    </div>
                  </>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-3">
                    <Camera className="size-8 text-muted-foreground" />
                    <span className="text-center text-caption text-muted-foreground">
                      {translatePhotoLabel(slot.label, locale)}
                    </span>
                  </div>
                )}
              </button>

              <div className="flex items-center gap-1">
                <span className="truncate text-caption font-medium">
                  {translatePhotoLabel(slot.label, locale)}
                </span>
                {slot.required && (
                  <span className="shrink-0 text-caption text-muted-foreground">*</span>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-1 text-caption text-destructive">
                  <AlertCircle className="mt-0.5 size-3 shrink-0" />
                  {error}
                </div>
              )}

              <input
                ref={(el) => {
                  inputRefs.current[slot.name] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(slot.name, file);
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
