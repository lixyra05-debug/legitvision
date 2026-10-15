import { cn } from "@/lib/utils";

/**
 * Mention posée sur toute image ou vidéo générée par IA (décision d'Hector du
 * 14/10/2026 : « Toutes les images et vidéos IA doivent afficher la mention
 * « image / vidéo d'illustration » »). En bas à gauche du média : son
 * conteneur doit être en `relative`. La liste des médias IA du site est dans
 * tests/unit/mention-illustration.test.ts, qui vérifie que chacun la porte.
 */
export function MentionIllustration({
  type,
  className,
}: {
  type: "image" | "video";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-background/80 px-2 py-0.5 text-caption font-medium text-foreground",
        className,
      )}
    >
      {type === "video" ? "Vidéo d'illustration" : "Image d'illustration"}
    </span>
  );
}
