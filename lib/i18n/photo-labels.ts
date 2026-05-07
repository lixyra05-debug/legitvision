import type { Locale } from "./translations";

/**
 * Map de traduction des labels `photo_protocol` stockés en DB (Supabase JSON).
 * Les labels FR sont la source de vérité (DB) — la version EN est calculée
 * côté client via translatePhotoLabel(label, locale).
 *
 * Couverture : sneakers, bags, clothing, watch + Margiela GATS (mig 015).
 * Si un label n'est pas trouvé, le label FR brut est retourné (fallback safe).
 */
const PHOTO_LABEL_FR_TO_EN: Record<string, string> = {
  // ── Sneakers (mig 001/008/014) ──────────────────────────────
  "Vue de face": "Front view",
  "Vue arriere": "Rear view",
  "Vue arrière": "Rear view",
  "Vue laterale": "Side view",
  "Vue latérale": "Side view",
  "Semelle exterieure (dessous)": "Outsole (bottom)",
  "Semelle extérieure (dessous)": "Outsole (bottom)",
  "Semelle dessous": "Outsole",
  "Bout de chaussure (gros plan)": "Toe box (close-up)",
  "Etiquette de languette": "Tongue label",
  "Étiquette de languette": "Tongue label",
  "Étiquette de langue": "Tongue label",
  "Etiquette de taille": "Size label",
  "Étiquette de taille": "Size label",
  "Étiquette taille": "Size label",
  "Semelle interieure": "Insole",
  "Semelle intérieure": "Insole",

  // ── Bags ──────────────────────────────────────────────────
  "Face avant": "Front",
  "Face arriere": "Back",
  "Face arrière": "Back",
  "Interieur complet": "Full interior",
  "Intérieur complet": "Full interior",
  "Base du sac": "Bag base",
  Quincaillerie: "Hardware",
  "Logo / monogramme": "Logo / monogram",
  "Estampille interieure": "Interior stamp",
  "Estampille intérieure": "Interior stamp",
  "Code date / serie": "Date / serial code",
  "Code date / série": "Date / serial code",

  // ── Clothing ──────────────────────────────────────────────
  "Etiquette col": "Neck label",
  "Étiquette col": "Neck label",
  "Etiquette lavage": "Wash label",
  "Étiquette lavage": "Wash label",
  "Logo gros plan": "Logo close-up",
  "Matiere gros plan": "Material close-up",
  "Matière gros plan": "Material close-up",

  // ── Margiela GATS (mig 015) ───────────────────────────────
  "Étiquette intérieure": "Interior label",
  "Étiquette boîte": "Box label",
  "Détail coutures": "Stitching detail",
};

export function translatePhotoLabel(label: string, locale: Locale): string {
  if (locale === "fr") return label;
  return PHOTO_LABEL_FR_TO_EN[label] ?? label;
}
