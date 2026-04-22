import type { ModelData } from "../../legit-check-types";

export const bapeModels: ModelData[] = [
  {
    slug: "shark-hoodie",
    name: "Shark Hoodie",
    brandSlug: "bape",
    category: "clothing",
    priceRange: "250-600 €",
    retailYear: "2005-présent",
    tagline: "Le hoodie japonais au visage de requin iconique",
    intro:
      "Le BAPE Shark Hoodie, lancé par A Bathing Ape en 2005 sous la direction de Nigo, est le hoodie zippé intégral avec impression « visage de requin » sur la capuche (dents, yeux, nez en ABC camo). Retail 320-400 $ (environ 300-380 €), avec prix marché secondaire 250-600 € selon coloris et année. Les coloris classiques (green, purple, black, pink camo) sont les plus accessibles (250-400 €), tandis que les coloris spéciaux (1st camo, limited drops, collabs Adidas/Undefeated) atteignent 500-1 200 €. La contrefaçon Shark Hoodie est massive et sophistiquée : les « super fakes » (UA quality, Putian) sont très proches de l'authentique et trompent même certains revendeurs. Les cinq signaux ci-dessous ciblent les points les plus difficiles à contrefaire : impression visage requin (alignement dents/yeux), zipper YKK full length, tag intérieur BAPE Made in Japan, broderie WGM arrière, et qualité coton 450 gsm lourd.",
    signals: [
      {
        title: "Impression visage requin — alignement parfait",
        description:
          "L'impression du visage (dents, yeux, nez) sur la capuche doit être parfaitement alignée : les dents suivent exactement le bord de la capuche, les yeux sont symétriques. Les contrefaçons ont souvent un décalage de 2-5 mm entre le dessin et la couture capuche, ou des yeux asymétriques. Détail pro : les dents doivent être au nombre exact de 12 visibles.",
        difficulty: 1,
      },
      {
        title: "Zipper YKK full length — dents et tirette",
        description:
          "Le zipper zip-up est un YKK pleine longueur (65-75 cm selon taille) avec dents en métal (pas plastique) et tirette BAPE gravée. Les contrefaçons utilisent souvent des zippers chinois sans marquage YKK, ou avec un YKK contrefait (marquage flou).",
        difficulty: 2,
      },
      {
        title: "Tag intérieur — « Made in Japan » police exacte",
        description:
          "Le tag intérieur indique « A Bathing Ape — Made in Japan » avec police exacte (serif spécifique BAPE). Les contrefaçons ont souvent « Made in China » ou une police sans-serif incorrecte. Le tag inclut aussi un code produit 13 chiffres spécifique.",
        difficulty: 2,
      },
      {
        title: "Broderie WGM arrière — 8 000 points",
        description:
          "Le logo WGM (World Gone Mad) brodé sur le dos a environ 8 000 points en fil Madeira premium. Les contrefaçons ont souvent 5 000-6 000 points (broderie plus fine et rapide), avec des points visibles ou un fil qui peluche. Le contour WGM authentique est parfaitement net.",
        difficulty: 3,
      },
      {
        title: "Coton 450 gsm lourd — poids et toucher",
        description:
          "Le Shark Hoodie utilise un coton 450 gsm (lourd et dense) produit au Japon, poids M = 1 100-1 200 g. Les contrefaçons utilisent un coton 300-350 gsm, poids M = 800-900 g (plus léger). Le toucher authentique est dense-cartonné, les fakes sont plus souples.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Shark Hoodie « 1st camo green » à 100 €",
        description:
          "Le Shark Hoodie 1st camo green (coloris classique) a un prix marché 300-450 €. Toute annonce à 100 € avec photos « deadstock » est une contrefaçon Putian (prix de production fake UA quality = 50-80 €).",
      },
      {
        title: "Vente avec « receipt BAPE store Harajuku »",
        description:
          "Les contrefacteurs utilisent des receipts photographiés d'une vraie boutique BAPE Harajuku recyclés sur des centaines d'annonces. Vérifiez : date du receipt, numéro de commande unique, et exigez photo du receipt avec le produit sur la même photo (pas deux photos séparées).",
      },
    ],
    faqs: [
      {
        question: "Comment distinguer un Shark Hoodie BAPE original d'un Bape USA ?",
        answer:
          "Depuis 2023, BAPE a ouvert des stores US avec production locale (prix plus bas, 280-320 €). Tag intérieur « Made in USA » au lieu de « Made in Japan ». Les collectionneurs préfèrent les Made in Japan (valeur revente supérieure). Les contrefaçons imitent souvent Made in Japan (plus recherché).",
      },
      {
        question: "Les Shark Hoodies collabs (Adidas, Undefeated) sont-ils aussi contrefaits ?",
        answer:
          "Oui. Les collabs Adidas x BAPE Shark Hoodie 2003-2024 ont des prix marché 500-1 500 €, les super-fakes coûtent 150-200 € à produire. Exigez photos HD de tous les tags intérieurs (double tag BAPE + Adidas), receipt original et dustbag Adidas. Les collabs Undefeated x BAPE ont un tag spécifique « UNDFTD x BAPE ».",
      },
    ],
  },
  {
    slug: "abc-camo-hoodie",
    name: "ABC Camo Hoodie",
    brandSlug: "bape",
    category: "clothing",
    priceRange: "200-450 €",
    retailYear: "2000-présent",
    tagline: "Le hoodie camouflage lettres BAPE iconique",
    intro:
      "Le BAPE ABC Camo Hoodie, produit depuis 2000 par A Bathing Ape sous la direction de Nigo, est le hoodie pull-over avec camouflage « ABC » (composé des lettres A-B-A-T-H-I-N-G-A-P-E formant le motif camo). Retail 250-320 $ (environ 240-300 €), avec prix marché secondaire 200-450 € selon coloris et millésime. Les coloris classiques (green, purple, blue, pink ABC camo) sont les plus accessibles (200-300 €), tandis que les coloris rares (1st camo 2000-2005, collabs Pharrell Williams, limited drops) atteignent 400-800 €. L'ABC Camo Hoodie est une des pièces BAPE les plus populaires et contrefaites avec le Shark Hoodie. Les signaux d'authentification ciblent : motif ABC camo (lettres lisibles à zoom), tag BAPE Made in Japan, broderie « Ape Head » frontale, qualité coton japonais, et drawstring aglets (embouts cordon capuche).",
    signals: [
      {
        title: "Motif ABC camo — lettres lisibles au zoom",
        description:
          "Le camouflage ABC est composé de lettres A-B-A-T-H-I-N-G-A-P-E stylisées — au zoom x5, les lettres doivent être parfaitement lisibles et régulières. Les contrefaçons ont souvent des lettres déformées ou des patterns approximatifs qui ressemblent à des blobs (pas des lettres nettes).",
        difficulty: 1,
      },
      {
        title: "Tag intérieur — « A Bathing Ape Made in Japan »",
        description:
          "Le tag intérieur indique « A Bathing Ape — Made in Japan » avec police exacte et code produit 13 chiffres (commence généralement par 001CSM ou 001CSP). Les contrefaçons ont souvent « Made in China » ou un code produit trop court/incorrect.",
        difficulty: 2,
      },
      {
        title: "Broderie Ape Head frontale — 6 000 points",
        description:
          "Le logo Ape Head (tête de singe) brodé sur le cœur a environ 6 000 points en fil premium, avec contour net et yeux précis (2 points distincts). Les contrefaçons ont souvent 4 000 points, des yeux fusionnés, ou une impression sérigraphie imitant broderie (aplat au lieu de points visibles).",
        difficulty: 3,
      },
      {
        title: "Coton japonais — 400 gsm mid-weight",
        description:
          "Le coton ABC Camo Hoodie est japonais (Osaka/Nagoya) avec densité 400 gsm (légèrement moins lourd que Shark Hoodie 450 gsm). Poids M = 900-1 000 g authentique. Les contrefaçons utilisent coton 280-320 gsm (poids M = 700-800 g), plus léger et souple.",
        difficulty: 2,
      },
      {
        title: "Drawstring aglets — embouts métal BAPE",
        description:
          "Les aglets (embouts du cordon de la capuche) sont en métal avec logo BAPE « Ape Head » gravé. Les contrefaçons utilisent souvent des aglets en plastique (pas métal) ou métal sans logo gravé. Détail pro : les aglets authentiques pèsent chacun 2-3 g.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "ABC Camo Hoodie « 1st camo » à 80 €",
        description:
          "L'ABC Camo Hoodie 1st camo green/purple a un prix marché 250-350 €. Toute annonce à 80 € avec photos « deadstock plié » est une contrefaçon Putian. Les 1st camo authentiques ne descendent pas sous 200 €.",
      },
      {
        title: "« Lot BAPE pas cher » — packs contrefaçon",
        description:
          "Certains vendeurs proposent des « lots 3 hoodies BAPE » à 200-300 € total, soit 70-100 € par pièce. Impossible pour du BAPE authentique (prix min revente = 200 €). Ces lots sont systématiquement des contrefaçons en gros.",
      },
    ],
    faqs: [
      {
        question: "Quelle est la différence entre ABC Camo et 1st Camo BAPE ?",
        answer:
          "1st Camo est le tout premier camouflage BAPE (1993-présent), avec lettres ABC plus grandes et plus stylisées, typiquement en coloris green/pink/purple classiques. ABC Camo est un terme générique incluant toutes les variations de camouflage ABC (1st Camo, 2nd Camo, Color Camo, Space Camo, etc.). Les collectionneurs valorisent particulièrement le 1st Camo original.",
      },
      {
        question: "Comment identifier un ABC Camo Hoodie vintage (2000-2010) ?",
        answer:
          "Les vintages ont des tags spécifiques : « Nowhere Co. Ltd » au lieu de « A Bathing Ape Co. Ltd » (changement juridique post-2011), police légèrement différente, et code produit plus court (10 chiffres au lieu de 13). Les contrefaçons vintage imitent ces tags mais avec des polices et codes incorrects. Comparez toujours avec photos de référence sur Grailed ou StockX.",
      },
    ],
  },
];
