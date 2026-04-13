"use client";

import { useRef, useState, useCallback, type Dispatch, type SetStateAction } from "react";
import { Camera, X, AlertCircle, Check } from "lucide-react";
import type { PhotoSlot } from "@/lib/types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;
const MIN_DIMENSION = 800;

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

function validateImage(
  file: File
): Promise<{ valid: boolean; error?: string; width: number; height: number }> {
  return new Promise((resolve) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      resolve({
        valid: false,
        error: "Format accepté : JPEG, PNG ou WebP",
        width: 0,
        height: 0,
      });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      resolve({
        valid: false,
        error: `Taille max : ${MAX_SIZE_MB} MB`,
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
          error: `Résolution min : ${MIN_DIMENSION}×${MIN_DIMENSION}px (reçu ${img.width}×${img.height})`,
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
        error: "Impossible de lire l'image",
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const requiredCount = protocol.filter((s) => s.required).length;
  const uploadedRequired = protocol.filter(
    (s) => s.required && photos[s.name]
  ).length;
  const allRequiredDone = uploadedRequired === requiredCount;

  const handleFileSelect = useCallback(
    async (slotType: string, file: File) => {
      const result = await validateImage(file);

      if (!result.valid) {
        setErrors((prev) => ({ ...prev, [slotType]: result.error! }));
        return;
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next[slotType];
        return next;
      });

      const preview = URL.createObjectURL(file);
      onPhotosChange((prev) => {
        const existing = prev[slotType];
        if (existing) {
          URL.revokeObjectURL(existing.preview);
        }
        return {
          ...prev,
          [slotType]: {
            file,
            preview,
            width: result.width,
            height: result.height,
          },
        };
      });
    },
    [onPhotosChange]
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
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Photos de l&apos;article
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prenez des photos nettes et bien éclairées. Min 800×800px.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm">
          <span
            className={
              allRequiredDone ? "text-emerald-500" : "text-muted-foreground"
            }
          >
            {uploadedRequired}/{requiredCount}
          </span>
          <span className="text-muted-foreground">requises</span>
          {allRequiredDone && <Check className="size-4 text-emerald-500" />}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {protocol.map((slot) => {
          const photo = photos[slot.name];
          const error = errors[slot.name];

          return (
            <div key={slot.name} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => inputRefs.current[slot.name]?.click()}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                  photo
                    ? "border-emerald-500/30"
                    : error
                      ? "border-red-500/30"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                {photo ? (
                  <>
                    <img
                      src={photo.preview}
                      alt={slot.label}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(slot.name);
                      }}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-500"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
                      {photo.width}×{photo.height}
                    </div>
                  </>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-3">
                    <Camera className="size-8 text-muted-foreground" />
                    <span className="text-center text-xs text-muted-foreground">
                      {slot.label}
                    </span>
                  </div>
                )}
              </button>

              <div className="flex items-center gap-1">
                <span className="truncate text-xs font-medium">
                  {slot.label}
                </span>
                {slot.required && (
                  <span className="shrink-0 text-xs text-emerald-500">*</span>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-1 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 size-3 shrink-0" />
                  {error}
                </div>
              )}

              <input
                ref={(el) => {
                  inputRefs.current[slot.name] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
