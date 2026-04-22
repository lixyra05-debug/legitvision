import type { ModelData } from "../../legit-check-types";

export const supremeModels: ModelData[] = [
  {
    slug: "box-logo-hoodie",
    name: "Box Logo Hoodie",
    brandSlug: "supreme",
    category: "clothing",
    priceRange: "250-1 500 €",
    retailYear: "1996 (drops récurrents)",
    tagline: "Le hoodie streetwear le plus contrefait au monde",
    intro:
      "Le Supreme Box Logo Hoodie, lancé pour la première fois en 1996 par James Jebbia (fondateur Supreme) et drop récurrent depuis, est le hoodie streetwear le plus recherché et le plus contrefait au monde. Retail 168 $ (environ 160 €) au drop, avec prix marché secondaire 250-1 500 € selon coloris et année. Les box logos « White on White », « Black on Black », « Red on Red » sont les plus accessibles (200-400 €), tandis que les collaborations (Louis Vuitton 2017, Nike, Takashi Murakami, Rammellzee) atteignent 2 000-5 000 €. La contrefaçon Box Logo est une industrie à part entière : Putian produit des dizaines de milliers de fakes par semaine, revendus sur Vinted, Depop, Grailed, StockX (où 20 % des Box Logos sont rejetés à l'authentification). Les cinq signaux ci-dessous ciblent les points invariables : police du box logo (Futura Heavy Oblique italique), couture bouton de col, tag intérieur Made in Canada, qualité du coton 500 gsm et étiquette taille stitché.",
    signals: [
      {
        title: "Police Box Logo — Futura Heavy Oblique italique",
        description:
          "Le texte « supreme » dans le box logo est en Futura Heavy Oblique italique (inclinaison 12°), avec un espacement précis entre les lettres. Les contrefaçons utilisent souvent Futura Bold droite (pas italique) ou une police trop fine. La hauteur de la lettre 'S' est exactement 2,2 cm sur taille M.",
        difficulty: 1,
      },
      {
        title: "Couture bouton de col — triangle renforcé",
        description:
          "Le col du Box Logo Hoodie a une couture triangle renforcé à la base du V (zone où le col rejoint le torse), avec 3 points en triangle. Les contrefaçons ont souvent une couture droite sans triangle, ou un triangle décentré.",
        difficulty: 3,
      },
      {
        title: "Tag intérieur — Made in Canada + wash label",
        description:
          "Le tag intérieur indique « Made in Canada » avec un wash label blanc séparé (instructions lavage). Police spécifique avec espacement précis. Les contrefaçons ont souvent « Made in China » ou un tag unique incluant wash label (fusion incorrecte).",
        difficulty: 2,
      },
      {
        title: "Coton 500 gsm — densité et poids",
        description:
          "Le Box Logo Hoodie authentique utilise un coton 500 gsm (grammes par mètre carré) — un coton très dense qui donne un poids spécifique : M = 950-1 000 g. Les contrefaçons utilisent souvent un coton 350-400 gsm, ce qui rend le hoodie plus léger (700-800 g) et plus fin.",
        difficulty: 2,
      },
      {
        title: "Étiquette taille — stitché, pas imprimé",
        description:
          "L'étiquette taille (S/M/L/XL) est stitchée sur le tag Made in Canada, pas imprimée séparément. Les contrefaçons ont souvent une étiquette taille imprimée directement sur le tissu ou collée avec adhésif thermique.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Box Logo « Red on White FW22 » à 100 €",
        description:
          "Le Box Logo Red on White FW22 a un prix marché 250-400 €. Toute annonce à 100 € avec photos « deadstock avec sticker » est une contrefaçon Putian. Les vraies Box Logos ne descendent jamais sous 200 €.",
      },
      {
        title: "Receipt Supreme NYC photographié",
        description:
          "Les contrefacteurs utilisent des receipts Supreme NYC photographiés recyclés sur des centaines d'annonces. Vérifiez la date, le numéro de commande unique, et demandez des photos du receipt avec le produit sur la même photo.",
      },
    ],
    faqs: [
      {
        question: "Comment différencier un Box Logo 2018 d'un 2024 ?",
        answer:
          "Le tag intérieur a évolué : « Made in Canada » a été en vigueur de 1994 à 2022. Depuis 2022, certains Box Logos sont « Made in Portugal » ou USA. Le washlabel a aussi changé de format. Un Box Logo 2024 « Made in Canada » est suspect (vérifiez drop date).",
      },
      {
        question: "Les Box Logos collabs (LV, Murakami) sont-ils aussi contrefaits ?",
        answer:
          "Oui, massivement. La collab LV x Supreme 2017 a un prix marché 3 000-8 000 € et les super-fakes coûtent 400-600 € à produire. Pour les collabs rares, exigez des photos HD de tous les tags intérieurs + receipt original + dustbag LV + bag LV (tous fournis avec collab authentique).",
      },
    ],
  },
  {
    slug: "box-logo-tee",
    name: "Box Logo Tee",
    brandSlug: "supreme",
    category: "clothing",
    priceRange: "150-800 €",
    retailYear: "1994 (drops anniversaires)",
    tagline: "Le t-shirt box logo des anniversaires Supreme",
    intro:
      "Le Supreme Box Logo Tee, drop uniquement lors des anniversaires Supreme (chaque printemps) pour célébrer la fondation de la marque en 1994, est un t-shirt collectionneur à tirage limité. Retail 38-58 $ au drop (environ 45-60 €), mais prix marché secondaire 150-800 € selon coloris et année. Les Box Logo Tees sont encore plus rares que les Hoodies (drop annuel unique vs plusieurs drops hoodie par an). Comme le Hoodie, les contrefaçons sont massives. Les cinq signaux sont globalement similaires au Box Logo Hoodie mais adaptés au t-shirt : police Box Logo, couture col ribbed, tag Made in USA/Canada, qualité coton 180-200 gsm, et étiquette taille stitchée.",
    signals: [
      {
        title: "Police Box Logo — identique Hoodie",
        description:
          "Le texte « supreme » utilise la même Futura Heavy Oblique italique que le Hoodie, avec espacement précis. Les contrefaçons utilisent souvent des polices approchantes mais non-identiques (Futura Bold droite, Helvetica).",
        difficulty: 1,
      },
      {
        title: "Col ribbed — 1×1 knit tension uniforme",
        description:
          "Le col est en ribbed 1×1 knit (côtes serrées) avec tension uniforme. Les contrefaçons utilisent souvent un ribbed 2×2 (trop large) ou un knit jersey simple (pas ribbed).",
        difficulty: 3,
      },
      {
        title: "Tag Made in USA ou Canada — police",
        description:
          "Les Box Logo Tees sont « Made in USA » ou « Made in Canada » selon année. Police tag spécifique. Les contrefaçons ont souvent « Made in China » ou une police bold incorrecte.",
        difficulty: 2,
      },
      {
        title: "Coton 180-200 gsm — densité medium",
        description:
          "Le coton Box Logo Tee est 180-200 gsm (medium weight). Poids M = 180-220 g. Les contrefaçons utilisent souvent un coton 140-160 gsm plus fin (poids 150-170 g), ce qui rend le tee plus léger et moins dense.",
        difficulty: 2,
      },
      {
        title: "Étiquette taille — stitchée col arrière",
        description:
          "Étiquette taille stitchée à côté du tag Made in USA/Canada, pas imprimée. Les contrefaçons ont souvent une étiquette collée thermique ou imprimée sur le tissu.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Box Logo Tee Anniversary 25 « neuf » à 50 €",
        description:
          "Le Box Logo Tee Anniversary 25 (2019) a un prix marché 200-350 €. Une annonce à 50 € avec photos « deadstock plié » est une contrefaçon.",
      },
      {
        title: "« Box Logo Tee FW21 » hors saison",
        description:
          "Les Box Logo Tees sont drop uniquement au printemps (anniversaire), pas en FW (automne-hiver). Un vendeur proposant un « Box Logo Tee FW21 » vend une contrefaçon (Supreme n'a jamais produit ce modèle).",
      },
    ],
    faqs: [
      {
        question: "Les Box Logo Tees anciens (années 2000) valent-ils plus que les récents ?",
        answer:
          "Oui, généralement. Les Box Logo Tees Anniversary 1994-2005 valent 300-1 500 € en deadstock (tirage ultra-limité, forte rareté). Les récents (2020-2024) valent 150-400 €. Les contrefaçons sur les anciens sont plus rentables pour les fakers, donc plus fréquentes.",
      },
      {
        question: "Comment identifier un Box Logo Tee vintage authentique ?",
        answer:
          "Outre les 5 signaux standards, les vintage ont des détails spécifiques : tags « Fruit of the Loom » (pre-2004) ou « Anvil » (2005-2012). Les contrefaçons vintage imitent ces tags mais avec une police légèrement incorrecte. Comparez avec photos de référence StockX ou Grailed.",
      },
    ],
  },
];
