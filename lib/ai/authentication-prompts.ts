import type { AuthenticationPoint } from "@/lib/types";

// ── Brand-specific authentication knowledge ──────────────────────────────────

const BRAND_EXPERTISE: Record<string, string> = {
  nike: "forme et placement du Swoosh (symétrie, angle, coutures), étiquettes de languette (police, code produit, pays), motif et densité de la semelle, codes produits intérieurs, qualité des matières (cuir, mesh, daim)",
  adidas: "forme des 3 bandes (symétrie, espacement, coutures), qualité et placement du Trefoil, technologie Boost (grain, couleur), étiquettes taille (QR code format, police), qualité toecap shell",
  jordan: "placement du Jumpman et Wings (proportions, embossage), qualité du cuir (grain, souplesse), étiquettes Nike Air (police, placement), numéros (23, 45), semelle translucide (clarté)",
  "new balance": "qualité du logo N (broderie vs appliqué, symétrie), suède/cuir overlays (grain, nap), codes modèle (ENCAP, Fresh Foam mentions), étiquettes taille (format NB spécifique)",
  bape: "qualité et positionnement du Ape Head (yeux, proportions), motif camo (régularité des pixels), coutures Shark Hoodie (dents alignées), étiquette col (police japonaise)",
  converse: "étoile All Star (proportions, centrage), qualité canvas/cuir, patch talon (logo, police), semelle vulcanisée (motif diamant, régularité)",
  vans: "side stripe (régularité, largeur constante), waffle sole (régularité des carreaux, flexibilité), étiquette intérieure (police, placement logo)",
  puma: "Formstrip (coutures, proportions), qualité IMEVA/RS-X semelle (symétrie multicouche), étiquettes (PUMA Cat logo, police)",
  reebok: "vecteur Union Jack (angles précis), qualité cuir Classic (piqûres régulières), Pump bladder (fonctionnement), étiquettes (police Reebok heritage)",
  salomon: "qualité cordura/TPU, semelle Contagrip (profondeur crampons), Quick Lace system (fonctionnement), étiquette de taille (codes usine)",
  "louis vuitton": "alignement monogramme LV (jamais coupé aux coutures), code date (LSXX modern / XXXX vintage), qualité toile enduite (rigidité, odeur), ferrures (gravure LV, poids, finition), estampille dorée intérieure (police, placement)",
  chanel: "numéro de série holographique (11 chiffres, authenticité sticker), cuir matelassé (diamants réguliers, profondeur), ferrures CC (poids, gravure, finition), coutures bord-à-bord (régularité), authenticity card (hologramme matching)",
  "hermès": "marquage à chaud HERMÈS PARIS MADE IN FRANCE (police, depth), lettre aveugle artisan (format année), qualité cuir (grain, odeur), ferrures palladium/or (poids, gravure précise), coutures en selle (régularité, résistance tirage)",
  gucci: "monogramme GG (alignement, netteté, régularité), ferrures avec gravure Gucci (police, depth), étiquette intérieure (police serif, espacement lettres), doublure (tissu, couleur, logo imprimé)",
  prada: "triangle Prada (vissé métal vs cousu, police Helvetica exacte), nappa/saffiano (texture en croix régulière, rigidité), étiquette blanche intérieure (typo, espacement), coutures régulières et tension constante",
  dior: "oblique canvas (alignement motif CD, netteté), ferrures dorées D.I.O.R (lettres individuelles vissées, poids), estampille intérieure (police Christian Dior spécifique), code S (format S-XXXXXXXX visible)",
  balenciaga: "police Balenciaga (espacement précis entre lettres, épaisseur des traits), semelles Triple S (3 couches distinctes, proportions), qualité mesh/cuir, étiquette composition (typo, placement)",
  "bottega veneta": "intrecciato (maille régulière, largeur constante, orientation 45°), cuir nappa veau (souplesse, grain fin), ferrures minimalistes (poids, finition mate/brillante), broderie étiquette intérieure",
  "saint laurent": "YSL logo (proportions, épaisseur), qualité cuir de veau (grain, odeur), ferrures (poids, finition), étampille intérieure (police YSL Paris)",
  celine: "CELINE PARIS en lettres capitales sans accent (police précise, espacement), ferrures (gravure, poids), cuir box (brillance, rigidité), coutures régulières (tension uniforme)",
  fendi: "double F logo (proportions Zucca, alignement), ferrures (gravure FENDI, finition), cuir/nylon (qualité, odeur), doublure (tissu, impression logo)",
  goyard: "motif Goyardine (dots réguliers en Y, alignement), lettres chevrons (régularité, netteté), cuir de bœuf naturel (vachette, patine), gravure Goyard Paris sur ferrures",
  jacquemus: "qualité cuir/matières (souplesse, finition bords), logo JACQUEMUS (police, placement), fermetures magnétiques (alignement), proportions micro-sac (symétrie)",
  "miu miu": "logo MIU MIU (police, espacement), qualité cuir (grain, odeur), ferrures (poids, finition), motif nappa matelassé (régularité diamants)",
  valentino: "VALENTINO GARAVANI (police précise, espacement), Rockstuds (régularité placement, solidité fixation), qualité cuir, ferrures (poids, finition métal)",
  givenchy: "G logo (proportions, finition), qualité cuir (grain, bords finis), coutures régulières, étampille intérieure (police Givenchy Paris)",
  "maison margiela": `La Replica GATS (German Army Trainer) est l'un des modèles les plus contrefaits de la maison. C'est une réplique fidèle des chaussures d'entraînement de l'armée allemande des années 1970, devenue iconique dans la mode. Points d'authentification critiques :
- Les 4 points de couture blancs sur l'étiquette col : signature absolue de la maison. Ils doivent être cousus à la main, légèrement irréguliers et espacés de manière organique. Sur les contrefaçons, ils sont souvent imprimés, collés ou parfaitement symétriques (machine).
- La semelle en gomme : reproduction fidèle de la semelle militaire allemande originale. La texture doit être granuleuse et spécifique, avec un motif de traction net. Les fausses ont souvent une gomme lisse ou un motif flou.
- Le cuir : grain fin, souple mais structuré. Les bords sont nets et polis à la main (pas de traces de colle visibles). Les contrefaçons utilisent du cuir synthétique rigide avec des bords irréguliers.
- L'étiquette intérieure : typographie Maison Margiela Paris, numéro de ligne 22 (ligne sneakers), mention Made in Italy. Police spécifique, espacement précis.
- Le talon : forme arrondie caractéristique. La couture du contrefort est cachée et invisible de l'extérieur. Sur les faux, la couture est souvent visible ou le talon est trop anguleux.
- La languette : épaisseur et souplesse du cuir spécifiques, marquage discret sans logo visible (la maison est connue pour son approche anti-logo).
- La boîte : blanche, minimaliste, étiquette avec code article S57WS0236. Les fausses boîtes ont souvent une impression de moindre qualité ou un grammage de carton inférieur.`,
  supreme: "Box Logo (broderie: fil, densité, alignement parfait), étiquette col (police Supreme, placement, couleur fil), tissu (poids Hanes vs Supreme authentique), qualité print sérigraphie",
  "off-white": "Helvetica Neue (espacement arrows/quotes EXACT, épaisseur traits), grille orange étiquette (typo Futura, espacement), coutures extérieures exposées (régularité), zip Talon (qualité)",
  "stone island": "patch bussole (broderie qualité: fil, régularité, compass pointing N), étiquette col en rouleau (police, placement), garment dye (uniformité couleur, pas de zones décolorées)",
  "the north face": "half-dome logo (proportions, police TNF), qualité nylon/Gore-Tex (imperméabilisation, couture soudée), zips YKK (fluidité, marquage), coutures taped (régularité)",
  carhartt: "patch Carhartt (qualité broderie, police script), qualité denim/canvas (poids, couleur uniforme), coutures triple piqûre (régularité), étiquette WIP (police, placement)",
  kith: "logo Kith (police, couleur, broderie qualité), qualité tissu (poids, texture), étiquette col (placement, police Kith), finition générale",
  asics: "logo ASICS Tiger stripes (symétrie, angles, coutures), semelle GEL visible (transparence, couleur, motif), étiquette languette (police Asics, code produit format XXX-XXXX, pays), mesh/suède qualité, numéro de modèle gravé semelle",
  "on running": "logo ON (proportions cercle + point), CloudTec pods semelle (nombre, alignement, fermeté caoutchouc), Speedboard visible, étiquette intérieure Swiss Engineered (police, placement), qualité mesh engineered",
  "chrome hearts": "argent sterling .925 (poids, patine naturelle, poinçon CH), gravures Gothic (symétrie croix/dagger/fleur-de-lys), étiquette col typographie Gothic exclusive, qualité cuir (odeur, grain), tags prix originaux présents (marque ultra-contrefaite)",
  longchamp: "toile nylon Le Pliage (texture, rigidité, couleur uniforme), cuir Russie poignées (grain, patine), ferrures gravées LONGCHAMP PARIS (police, profondeur), étiquette intérieure made in France/Tunisie (typo, placement), coutures régulières",
  guess: "logo Guess triangle (police, proportions, broderie/appliqué), qualité PU/cuir (grain, souplesse), ferrures dorées (poids, finition, gravure G), étiquette intérieure (police Guess, made in China typique), doublure signature",
  "michael kors": "logo MK entrelacé (symétrie, alignement, gravure ferrures), qualité saffiano/pebbled leather (texture en croix, uniformité), étiquette intérieure MICHAEL KORS (police, couleur, numéro série cuir collé), ferrures dorées (poids, finition)",
  "vanessa bruno": "toile cabas (tissage serré, couleur uniforme), paillettes cousues (régularité, densité, pas de colle visible), poignées cuir (grain, finition bords), étiquette intérieure VANESSA BRUNO PARIS (police, placement, made in France)",
  default: "logos et monogrammes (alignement, symétrie, proportions), qualité des matériaux (grain, odeur, souplesse), coutures et finitions (régularité, tension), étiquettes intérieures (police, placement, typo), ferrures et accessoires (poids, gravure, finition)",
};

function getBrandExpertise(brandName: string): string {
  const key = brandName.toLowerCase();
  // Direct match first
  if (BRAND_EXPERTISE[key]) return BRAND_EXPERTISE[key];
  // Partial match (e.g. "Jordan Brand" → "jordan")
  for (const [k, v] of Object.entries(BRAND_EXPERTISE)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return BRAND_EXPERTISE.default;
}

const CATEGORY_LABEL: Record<string, string> = {
  sneakers: "chaussures de sport et streetwear",
  bag: "maroquinerie et accessoires de luxe",
  clothing: "vêtements streetwear et luxe",
  watch: "horlogerie de luxe",
};

// ── Main export ───────────────────────────────────────────────────────────────

export function getAuthenticationPrompt(
  brandName: string,
  modelName: string,
  category: string,
  authenticationPoints: AuthenticationPoint[],
  photoDescriptions: string[],
  variantSelected?: string | null,
  collabSelected?: string | null,
  specificAuthPoints?: string[] | null,
): { systemPrompt: string; userPrompt: string } {
  const expertise =
    specificAuthPoints && specificAuthPoints.length > 0
      ? specificAuthPoints.join(", ")
      : getBrandExpertise(brandName);
  const categoryLabel = CATEGORY_LABEL[category] ?? category;

  // Build model identity string
  const variantStr = variantSelected && variantSelected !== "Standard"
    ? ` version ${variantSelected}`
    : "";
  const collabStr = collabSelected
    ? ` — Édition spéciale ${collabSelected}`
    : "";
  const modelIdentity = `${brandName} ${modelName}${variantStr}${collabStr}`;

  // Collab-specific instructions
  const collabSection = collabSelected
    ? `\nÉDITION SPÉCIALE ${collabSelected.toUpperCase()} :
Cette pièce est une collaboration limitée. Sois particulièrement attentif aux :
- Tags, étiquettes et packaging spécifiques à la collab
- Détails exclusifs (coloris, broderies, impressions propres à la collab)
- Numéros de lot / certificats d'authenticité collab
- Qualité généralement supérieure aux modèles standards : toute dégradation est suspecte\n`
    : "";

  const systemPrompt = `Tu es un expert senior en authentification ${categoryLabel}, spécialisé dans la marque ${brandName} depuis 15 ans. Tu analyses des ${modelIdentity} avec une précision chirurgicale.

CONTEXTE DÉCLARÉ PAR L'UTILISATEUR :
- Marque : ${brandName}
- Modèle : ${modelName}
- Catégorie : ${categoryLabel}
L'utilisateur affirme posséder un ${modelIdentity}. Ta mission est de VÉRIFIER cette affirmation, PAS de réidentifier l'article. Si la silhouette ne correspond visuellement pas à un ${modelIdentity} authentique, considère cela comme un INDICATEUR FORT de contrefaçon (score bas + verdict "likely_fake"), mais conserve l'identité déclarée "${modelIdentity}" dans \`analyst_summary\` et tous les findings. NE remplace JAMAIS "${modelIdentity}" par une autre marque ou modèle (ex : "Puma", "Nike générique", "running shoe non identifiée") dans ta réponse — décris plutôt la divergence visuelle dans \`findings\` (ex : "silhouette atypique pour un ${modelIdentity} authentique, ressemblance suspecte avec un produit générique").

EXPERTISE ${brandName.toUpperCase()} — Marqueurs d'authenticité clés :
${expertise}
${collabSection}

RÈGLES ABSOLUES :
- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION DE PROBABILITÉ basée sur l'analyse visuelle.
- Tes observations sont factuelles, précises et ancrées dans ce que tu vois sur les photos.
- Tu mentionnes les preuves visuelles spécifiques qui justifient chaque score.
- Tu réponds UNIQUEMENT en JSON valide, sans texte avant ou après.

MÉTHODOLOGIE :
1. Examine chaque photo en la reliant à son type (vue de face, semelle, étiquette, etc.)
2. Pour chaque point d'authentification, compare avec les standards ${brandName} ${modelName}
3. Cherche : logos mal positionnés, polices incorrectes, coutures irrégulières, matériaux non conformes
4. Vérifie la cohérence entre les photos (même article, même coloris)
5. Extrais les données OCR visibles (codes produit, numéros de série, pays de fabrication)
6. Pondère ton score final en favor des zones les plus discriminantes pour ${brandName}

RÈGLE confidence_level — sois rigoureux et cohérent :
- "insufficient" si tu NE PEUX PAS conclure de façon fiable, c'est-à-dire dans AU MOINS un de ces cas : (a) photos floues, trop sombres ou de trop basse résolution pour distinguer les détails d'authentification ; (b) angles critiques manquants (ex. pas de photo de la semelle, de l'étiquette intérieure, du logo en gros plan, du code/numéro de série) ; (c) trop peu de zones d'authentification clés réellement visibles pour trancher. Dans ce cas, liste précisément ce qui manque dans "missing_evidence" et NE donne PAS de verdict confiant.
- "low" : tu peux donner une estimation mais avec un doute important (qualité limitée, zones partiellement visibles).
- "medium" : la plupart des zones clés sont exploitables.
- "high" : toutes les zones discriminantes sont nettes et exploitables.
Ne déclare "high" ou "medium" que si la qualité réelle des photos le justifie.

FORMAT DE RÉPONSE (JSON strict) :
{
  "overall_score": <number 0-100>,
  "confidence_level": "<high|medium|low|insufficient>",
  "verdict": "<likely_authentic|likely_fake|inconclusive>",
  "sub_scores": {
    "<zone_id>": <number 0-100>
  },
  "findings": [
    {
      "zone": "<zone_id>",
      "observation": "<description factuelle précise en français>",
      "score": <number 0-100>,
      "severity": "<critical|important|minor>"
    }
  ],
  "missing_evidence": ["<élément manquant pour affiner l'analyse>"],
  "ocr_extracted": {
    "size_label_text": "<texte extrait de l'étiquette taille ou vide>",
    "product_code": "<code produit ou vide>",
    "manufacturing_info": "<pays, usine si visible ou vide>"
  },
  "recommendations": ["<conseil actionnable en français>"],
  "analyst_summary": "<résumé 2-3 phrases en français — DOIT commencer par '${modelIdentity}' ou 'Ce ${modelIdentity}' — ne JAMAIS le requalifier en autre marque/modèle>"
}`;

  const pointsList = authenticationPoints
    .map(
      (p, i) =>
        `${i + 1}. **${p.label}** (zone: \`${p.zone}\`, poids: ${(p.weight * 100).toFixed(0)}%)`
    )
    .join("\n");

  const photosList = photoDescriptions
    .map((desc, i) => `- Photo ${i + 1} : ${desc}`)
    .join("\n");

  const userPrompt = `Analyse ces ${photoDescriptions.length} photos pour estimer la probabilité d'authenticité de ce ${modelIdentity}.

**Article :** ${modelIdentity}
**Catégorie :** ${categoryLabel}${variantSelected && variantSelected !== "Standard" ? `\n**Variante déclarée :** ${variantSelected}` : ""}${collabSelected ? `\n**Collaboration déclarée :** ${collabSelected} — vérifie les marqueurs spécifiques à cette collab` : ""}

**Photos fournies :**
${photosList}

**Points d'authentification spécifiques ${brandName} ${modelName} — par ordre d'importance :**
${pointsList}

Pour chaque zone, attribue un score de 0 à 100 basé sur la conformité avec les standards ${brandName} ${modelName} authentiques :
- 90-100 : parfaitement conforme, aucun doute
- 70-89 : conforme avec quelques imperfections mineures
- 50-69 : présence d'anomalies significatives
- 30-49 : plusieurs indicateurs suspects
- 0-29 : clairement non conforme aux standards ${brandName}

⚠️ Concentre-toi en priorité sur les détails les plus difficiles à reproduire fidèlement pour ${brandName}${collabSelected ? ` — et sur les marqueurs exclusifs de la collab ${collabSelected}` : ""}.

Réponds UNIQUEMENT avec le JSON structuré demandé, sans aucun texte additionnel.`;

  return { systemPrompt, userPrompt };
}
