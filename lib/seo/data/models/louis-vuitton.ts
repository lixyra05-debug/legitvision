import type { ModelData } from "../../legit-check-types";

export const louisVuittonModels: ModelData[] = [
  {
    slug: "neverfull-mm",
    name: "Neverfull MM",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "1 400-1 800 €",
    retailYear: "2007 (production continue)",
    tagline: "Le tote iconique, le plus vendu de LV",
    intro:
      "Le Louis Vuitton Neverfull MM, lancé en 2007, est le tote bag le plus vendu de l'histoire de Louis Vuitton — plus de 12 millions d'unités écoulées en 17 ans. Disponible en Monogram Canvas, Damier Ebene, Damier Azur et coloris saisonniers (Escale, By The Pool, Jungle), son prix retail 2026 est de 1 600 € pour la version standard, avec les éditions limitées collaborations (Yayoi Kusama, Takashi Murakami) atteignant 2 500-4 000 € en resell. Cette popularité massive en fait la cible numéro 1 des contrefacteurs : les super-fakes chinois (China 1:1) coûtent 150-300 € à produire et se revendent jusqu'à 800-1 000 € sur les marketplaces. Les contrefaçons 2025-2026 maîtrisent le pattern Monogram Canvas, la forme trapézoïdale et les poignées en cuir Vachetta, mais échouent sur quatre points invariables : l'alignement du Monogram sur les couture, la qualité du Vachetta naturel non teinté, le date code format DU/SD/SP et le zipper pochette intérieure amovible. Les cinq signaux ci-dessous permettent d'identifier 95 % des fakes.",
    signals: [
      {
        title: "Alignement Monogram — symétrie sur couture centrale",
        description:
          "Le motif Monogram Canvas authentique est symétrique autour de la couture centrale avant : les LV doivent être alignés en miroir de part et d'autre. Les contrefaçons ont souvent un Monogram asymétrique (LV coupés à la couture, décalage de 5-10 mm entre les deux côtés).",
        difficulty: 2,
      },
      {
        title: "Vachetta — couleur naturelle non teintée",
        description:
          "Les poignées et tirettes Vachetta authentiques sont en cuir tanné au chrome naturel non teinté, qui patine progressivement en miel puis caramel avec le temps. Neuf, le Vachetta est rose pâle. Les contrefaçons utilisent souvent un cuir déjà teinté (beige uniforme) qui ne patine pas correctement.",
        difficulty: 2,
      },
      {
        title: "Date code — format DU/SD/SP + 4 chiffres",
        description:
          "Le date code intérieur authentique (Neverfull produits avant 2021) est au format DU1234 (France), SP2345 (Espagne), SD3456 (USA), avec 2 lettres + 4 chiffres décodables (1er+3e = semaine, 2e+4e = année). À partir de mars 2021, LV utilise des RFID chip au lieu de date codes. Une Neverfull 2025 avec date code est une contrefaçon.",
        difficulty: 1,
      },
      {
        title: "Zipper pochette amovible — gravure LV et cran",
        description:
          "La pochette intérieure amovible est reliée au sac par un cran métal gravé LV. Le zipper Lampo ou YKK porte la gravure LV sur l'envers de la tirette. Les contrefaçons ont souvent un cran sans gravure ou un zipper générique.",
        difficulty: 2,
      },
      {
        title: "Stitching — couleur crème spécifique et régularité",
        description:
          "Le stitching authentique utilise un fil crème tirant légèrement sur le jaune, avec 8 points par centimètre parfaitement réguliers. Les contrefaçons utilisent souvent un fil plus blanc ou plus orangé, avec des points irréguliers visibles à la loupe.",
        difficulty: 3,
      },
    ],
    scams: [
      {
        title: "Neverfull MM Monogram « neuve » à 650 €",
        description:
          "Le Neverfull MM retail à 1 600 € et son prix marché ne descend pas sous 1 100 € pour une pièce authentique en bon état. Une annonce à 650 € est une contrefaçon super-fake, souvent avec photos LV.com volées.",
      },
      {
        title: "Faux date code « DU1185 »",
        description:
          "Les contrefacteurs utilisent souvent le même date code sur des milliers de fakes (ex. DU1185). Reverse-search le code sur Google : si tu vois des dizaines de résultats Vinted/eBay avec ce code exact, c'est une contrefaçon.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi certaines Neverfull n'ont-elles pas de date code ?",
        answer:
          "Depuis mars 2021, Louis Vuitton a remplacé les date codes par des micro-chips RFID embarqués dans la doublure. Une Neverfull post-mars 2021 sans date code est normale. Une Neverfull 2025 avec un date code est une contrefaçon.",
      },
      {
        question: "Comment authentifier une Neverfull sans date code (post-2021) ?",
        answer:
          "Sans date code, l'authentification repose sur les 4 autres signaux (alignement Monogram, Vachetta, stitching, zipper) et l'inspection interne (RFID chip détectable). LegitVision analyse vos photos HD pour détecter les incohérences sur pièces post-2021.",
      },
    ],
  },
  {
    slug: "speedy-30",
    name: "Speedy 30",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "1 300-1 700 €",
    retailYear: "1930 (production continue)",
    tagline: "Le bowling bag iconique porté par Audrey Hepburn",
    intro:
      "Le Louis Vuitton Speedy 30, créé en 1930 comme bowling bag portable et popularisé par Audrey Hepburn dans les années 1960, est l'un des sacs les plus intemporels de LV. Retail 2026 : 1 400-1 700 € selon canvas (Monogram, Damier Ebene, Damier Azur). Sa forme iconique, son cadenas Serrure 2 avec clé gravée, ses poignées Vachetta et son double zipper Lampo en font un sac à la fois fonctionnel et statutaire. Les contrefaçons Speedy sont massives sur Vinted, Leboncoin, Vestiaire Collective. Les super-fakes maîtrisent la forme et le canvas mais échouent sur la qualité du Vachetta, le numéro de série du cadenas, le zipper pull « LV » spécifique et les sangles de renfort intérieures. Les cinq signaux ci-dessous sont spécifiques à la Speedy et complémentaires aux signaux Neverfull.",
    signals: [
      {
        title: "Cadenas Serrure 2 — numéro + cuivre brossé",
        description:
          "Le cadenas authentique est gravé « Louis Vuitton » + un numéro à 3 chiffres (ex. 319) sur la face avant. Le métal est en cuivre brossé (pas laiton doré). Les contrefaçons ont souvent un cadenas sans numéro, numéro répété, ou en laiton chromé brillant.",
        difficulty: 1,
      },
      {
        title: "Clé cadenas — gravure LV et forme",
        description:
          "Les deux clés sont gravées « Louis Vuitton » sur le corps, avec une forme spécifique (poignée arrondie). Les contrefaçons ont souvent des clés sans gravure ou avec une gravure « LV » simplifiée.",
        difficulty: 2,
      },
      {
        title: "Double zipper Lampo — tirettes et alignement",
        description:
          "Les deux tirettes Lampo authentiques portent la gravure « Louis Vuitton Made in France » sur l'envers, et s'alignent parfaitement au centre quand le sac est fermé. Les contrefaçons utilisent des zippers YKK standards sans gravure.",
        difficulty: 2,
      },
      {
        title: "Sangles de renfort intérieures — Vachetta",
        description:
          "L'intérieur présente des sangles de renfort en Vachetta reliant la base aux poignées, visibles quand on ouvre le sac. Les contrefaçons omettent souvent ces sangles (économie de matériaux) ou les remplacent par du tissu de couleur.",
        difficulty: 2,
      },
      {
        title: "Date code — localisation intérieure poche zippée",
        description:
          "Sur la Speedy pre-2021, le date code est sur un petit patch cuir à l'intérieur de la poche zippée intérieure (pas sur la doublure principale). Les contrefaçons placent souvent le date code au mauvais endroit (sur la doublure tissu visible immédiatement).",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Speedy 30 « authentique, vintage 1990 » à 400 €",
        description:
          "Les vintage Speedy 30 des années 1990 ont un prix minimum 500-700 € en bon état. Une annonce à 400 € « vintage authentique » est suspecte, surtout sans photo du date code intérieur poche zippée.",
      },
      {
        title: "Clé cadenas vendue séparément",
        description:
          "Certains vendeurs de fakes vendent le sac sans cadenas en disant « clé perdue » pour éviter l'inspection. Exigez photos du cadenas avec clé insérée, et demandez à voir le numéro gravé sur le cadenas.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre Speedy 25, 30, 35 et 40 ?",
        answer:
          "Les chiffres indiquent la largeur en cm. Speedy 25 (25 cm) est le plus petit, 30 cm le plus vendu, 35 et 40 cm sont plus grands (tailles voyage). Chaque taille a son code article et son prix retail différent. Les contrefaçons mélangent parfois tailles (Speedy 35 vendu comme 30).",
      },
      {
        question: "Le Vachetta de la Speedy doit-il foncer avec le temps ?",
        answer:
          "Oui, le Vachetta patine progressivement du rose pâle au miel puis au caramel foncé en 2-5 ans selon exposition soleil/huile naturelle. Une Speedy annoncée « vintage 1995 » avec Vachetta encore rose pâle est une contrefaçon ou une réédition récente.",
      },
    ],
  },
  {
    slug: "keepall-50",
    name: "Keepall 50",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "2 000-2 800 €",
    retailYear: "1930 (production continue)",
    tagline: "Le weekender iconique popularisé par Kanye et Virgil",
    intro:
      "Le Louis Vuitton Keepall 50, né dans les années 1930 comme sac de voyage et relancé par Virgil Abloh avec les collabs Monogram Empreinte et collaborations hip-hop (Kanye West 2009, Virgil SS19), est l'un des sacs voyage les plus iconiques du luxe. Retail 2026 : 2 100-2 800 € selon version (Monogram Canvas, Damier Graphite, Bandouliere). Le Keepall Bandouliere ajoute une sangle détachable + pads Vachetta. Les collabs limited editions (Supreme, Nigo, Virgil Multicolor) s'échangent 4 000-15 000 €. La cible principale des contrefaçons est le Keepall Monogram Canvas standard et Damier Graphite (Men's), reproduits en UA à 300-500 €. Les cinq signaux spécifiques au Keepall : cadenas rectangulaire avec n°, stitching au niveau des sangles Vachetta, sangle épaule avec piping, fond rectangulaire avec pieds métal et date code dans poche zippée.",
    signals: [
      {
        title: "Cadenas rectangulaire — gravure complète",
        description:
          "Le cadenas Keepall est rectangulaire (pas rond comme la Speedy), gravé « Louis Vuitton Paris Made in France » + numéro à 3 chiffres. Les contrefaçons utilisent souvent un cadenas rond de Speedy ou un cadenas rectangulaire sans gravure complète.",
        difficulty: 2,
      },
      {
        title: "Sangles Vachetta — stitching double et longueur",
        description:
          "Les sangles Vachetta sont stitchées en double piqûre, avec une longueur exacte de 35 cm (Keepall 50) et une largeur 3 cm. Les contrefaçons ont souvent un stitching simple, une longueur décalée ou une largeur incorrecte.",
        difficulty: 2,
      },
      {
        title: "Sangle épaule — piping cuir et mousquetons gravés",
        description:
          "La sangle épaule Bandouliere authentique a un piping cuir renforcé sur les bords et des mousquetons gravés « Louis Vuitton ». Les contrefaçons ont souvent un piping absent ou des mousquetons sans gravure.",
        difficulty: 2,
      },
      {
        title: "Fond — 4 pieds métal gravés LV",
        description:
          "Le fond du Keepall 50 a 4 pieds métal dorés gravés « LV » pour protéger le canvas. Les contrefaçons ont souvent 4 pieds sans gravure, ou seulement 2 pieds (économie).",
        difficulty: 1,
      },
      {
        title: "Date code — intérieur poche zippée",
        description:
          "Le date code est sur un petit patch à l'intérieur de la poche zippée intérieure (pas visible au premier coup d'œil). Format DU/SD/FL + 4 chiffres. Les contrefaçons placent souvent le date code sur la doublure principale, immédiatement visible.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Keepall 50 Damier « neuf » à 800 €",
        description:
          "Le Keepall 50 Damier retail à 2 400 € et son prix marché ne descend pas sous 1 600 € en bon état. Une annonce à 800 € est une contrefaçon garantie, souvent avec photos LV.com volées.",
      },
      {
        title: "Collab Virgil « Monogram Multicolor » à 3 000 €",
        description:
          "La collab Virgil SS19 Keepall Monogram Multicolor a un prix marché 6 000-12 000 €. Une annonce à 3 000 € est une contrefaçon avancée (China 1:1) ou un modèle repeint/modifié.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre Keepall et Keepall Bandouliere ?",
        answer:
          "Le Keepall classique n'a pas de sangle épaule, le Keepall Bandouliere inclut une sangle épaule détachable + 2 pads Vachetta fixés sur le sac pour protéger le canvas. Les contrefaçons mélangent parfois les deux (Bandouliere vendu sans sangle).",
      },
      {
        question: "Le Keepall existe-t-il en cuir plein ?",
        answer:
          "Oui, LV produit des Keepall en cuir Taïga (noir, gris), Epi (grainé coloré) et Monogram Empreinte (cuir embossé Monogram). Chaque version a son retail et ses signes d'authentification. Les contrefaçons se concentrent sur Monogram Canvas et Damier Graphite (Men's) par volume.",
      },
    ],
  },
  {
    slug: "alma-bb",
    name: "Alma BB",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "1 400-2 000 €",
    retailYear: "1934 (BB lancée en 2011)",
    tagline: "Le mini-sac structuré au cadenas iconique",
    intro:
      "Le Louis Vuitton Alma BB, version miniature du sac Alma créé en 1934, a été lancée en 2011 et s'est imposée comme l'un des mini-sacs les plus désirés de LV. Sa forme bombée-structurée rappelle l'Alma Original (porté par Coco Chanel en 1930), avec une taille crossbody parfaite (23,5 × 17 × 11,5 cm). Retail 2026 : 1 500-1 800 € selon cuir (Monogram Vernis, Epi, Monogram Canvas). Les coloris Vernis (Rose Ballerine, Amarante, Jaune Citron) sont les plus contrefaits car ils attirent les jeunes acheteuses Gen Z. Les super-fakes Alma BB reproduisent la forme mais échouent sur la brillance exacte du Vernis (trop plastique sur fakes), les 4 pieds métal gravés LV, la structure interne rigide et le numéro série sur le cadenas rond.",
    signals: [
      {
        title: "Vernis — brillance et texture",
        description:
          "Le cuir Vernis authentique a une brillance profonde (pas plastique) avec une finition lisse sans micro-bulles. Les contrefaçons utilisent un PVC laqué qui a une brillance trop plastique et des micro-bulles visibles à la loupe.",
        difficulty: 2,
      },
      {
        title: "Cadenas rond Alma — numéro 3 chiffres",
        description:
          "Le cadenas Alma BB est rond avec gravure « Louis Vuitton Paris Made in France » + numéro à 3 chiffres. Plus petit que celui de la Speedy. Les contrefaçons ont souvent un cadenas trop grand ou sans numéro.",
        difficulty: 1,
      },
      {
        title: "4 pieds métal base — gravure LV",
        description:
          "Le fond de l'Alma BB a 4 pieds métal dorés gravés « LV ». Les contrefaçons ont souvent des pieds sans gravure ou en métal chromé argenté au lieu de doré.",
        difficulty: 1,
      },
      {
        title: "Structure interne — rigidité",
        description:
          "L'Alma BB authentique est rigide (tient debout seule) grâce à une structure interne carton-toile. Les contrefaçons ont souvent une structure molle ou utilisent du carton bas de gamme qui se déforme rapidement.",
        difficulty: 2,
      },
      {
        title: "Date code — poche zippée interne",
        description:
          "Le date code est sur un patch cuir à l'intérieur de la poche zippée (format DU/SD/FL + 4 chiffres pour pre-2021). Les contrefaçons le placent sur la doublure centrale.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Alma BB Vernis « neuve » à 450 €",
        description:
          "L'Alma BB retail 1 500 € et prix marché 1 100-1 400 € en bon état. Une annonce à 450 € est une contrefaçon Vernis PVC avec cadenas non gravé.",
      },
      {
        title: "Alma BB « défaut Vernis — prix bas »",
        description:
          "Certains vendeurs justifient un prix cassé par un « défaut Vernis ». Les vrais défauts Vernis (micro-craquelures) ne justifient pas une décote de plus de 30 %. Sous 70 % du prix marché, c'est une contrefaçon.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre Alma BB, PM, MM et GM ?",
        answer:
          "Les tailles Alma sont BB (mini, 23,5 cm), PM (petit, 32 cm), MM (moyen, 35 cm), GM (grand, 39 cm). La BB est la plus populaire pour le crossbody. Chaque taille a son retail et son date code format.",
      },
      {
        question: "Le Vernis Alma BB se fissure-t-il avec le temps ?",
        answer:
          "Oui, le Vernis peut micro-craqueler après 3-5 ans d'usage quotidien ou de stockage sec. Ce n'est pas un signe de contrefaçon mais d'usage. Les contrefaçons PVC se fissurent beaucoup plus vite (6-12 mois).",
      },
    ],
  },
  {
    slug: "pochette-metis",
    name: "Pochette Metis",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "2 000-2 500 €",
    retailYear: "2017 (production continue)",
    tagline: "Le crossbody Monogram Empreinte le plus demandé",
    intro:
      "La Louis Vuitton Pochette Metis, lancée en 2017 en Monogram Canvas puis en Monogram Empreinte (cuir embossé), est devenue en moins de 5 ans l'un des crossbody les plus désirés et revendus de LV — avec des ruptures permanentes en boutique et un marché secondaire très liquide (Vestiaire, Rebag, Fashionphile). Retail 2026 : 2 100-2 400 € selon version (Canvas, Empreinte). La version Monogram Empreinte (cuir souple embossé) est la plus recherchée, avec une vraie pénurie en boutique qui alimente le marché gris. Les super-fakes Pochette Metis sont devenus extrêmement convaincants en 2025 : reproduction correcte de l'embossage Empreinte, fermoir S-lock fonctionnel et strap détachable. Les cinq signaux ci-dessous : embossage Empreinte, fermoir S-lock, strap, format exact et date code.",
    signals: [
      {
        title: "Embossage Empreinte — profondeur et netteté",
        description:
          "L'embossage Monogram sur le cuir Empreinte est profond (2 mm) et parfaitement net, avec des LV en relief 3D. Les contrefaçons ont souvent un embossage superficiel (0,5-1 mm) ou flou, avec des bords peu nets.",
        difficulty: 2,
      },
      {
        title: "Fermoir S-lock — fonctionnalité et gravure",
        description:
          "Le fermoir S-lock est gravé « Louis Vuitton » en relief, et fonctionne en rotation parfaite (90°). Les contrefaçons ont souvent un fermoir sans gravure, en rotation dure ou lâche.",
        difficulty: 1,
      },
      {
        title: "Strap détachable — boucles et adjustable",
        description:
          "Le strap est détachable avec boucles métal gravées LV, et ajustable sur 4 positions (crossbody ou épaule). Les contrefaçons ont souvent des boucles sans gravure ou un strap non ajustable.",
        difficulty: 2,
      },
      {
        title: "Format exact — 25 × 19 × 7 cm",
        description:
          "La Pochette Metis a des dimensions exactes 25 × 19 × 7 cm (L × H × P). Les contrefaçons ont souvent des dimensions légèrement différentes (±1-2 cm), ce qui trahit une réplication imprécise.",
        difficulty: 3,
      },
      {
        title: "Date code / RFID — post-2021 absence normale",
        description:
          "Les Pochette Metis produites après mars 2021 utilisent un micro-chip RFID embarqué (pas de date code visible). Les pre-2021 ont un date code au format DU/SD/FL + 4 chiffres. Une Metis 2024 avec date code est une contrefaçon.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Pochette Metis Empreinte « neuve » à 900 €",
        description:
          "La Pochette Metis Empreinte retail 2 100 € et son prix marché est stable à 1 800-2 200 € en bon état (parfois au-dessus à cause de la pénurie). Une annonce à 900 € est une contrefaçon Empreinte fake.",
      },
      {
        title: "« Pré-commande boutique » à prix retail + 200 €",
        description:
          "Des vendeurs Vinted proposent des Pochette Metis en « pré-commande boutique » à prix retail + 200 € en disant avoir un contact LV. C'est presque toujours une arnaque : soit fake, soit vendeur qui disparaît après paiement.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Pochette Metis est-elle en rupture permanente ?",
        answer:
          "LV limite volontairement la production Pochette Metis Empreinte pour maintenir la désirabilité (stratégie de scarcity). Les listes d'attente boutique peuvent atteindre 6-12 mois. Ce déséquilibre offre-demande alimente le marché secondaire et attire les contrefacteurs.",
      },
      {
        question: "Quelle différence entre Pochette Metis et Pochette Felicie ?",
        answer:
          "La Metis est un crossbody flap bag rigide avec fermoir S-lock. La Felicie est une pochette 3-en-1 plus souple avec chaîne intérieure amovible. Tailles et structures différentes. Les contrefaçons mélangent parfois les deux pour profiter de la popularité Metis.",
      },
    ],
  },
  {
    slug: "capucines-bb",
    name: "Capucines BB",
    brandSlug: "louis-vuitton",
    category: "bags",
    priceRange: "5 500-7 500 €",
    retailYear: "2013 (production continue)",
    tagline: "Le sac couture au LV métal latéral pivotant",
    intro:
      "Le Louis Vuitton Capucines BB, créé en 2013 et nommé d'après la rue Capucines (adresse historique LV à Paris), est positionné comme le sac « haute couture » de LV, plus proche d'une Birkin que d'un Monogram Canvas. Retail 2026 : 5 700-7 200 € selon cuir (Taurillon, Galet, Python, Croco en édition limitée 25 000 €+). Son cuir Taurillon (bovin tanné minéral), son monogramme LV métal pivotant sur le flanc et sa forme rigide avec poignée + sangle détachable en font un sac de statut premium. Les contrefaçons Capucines sont moins massives (prix de production UA élevé, ~500 €+) mais elles existent et visent les acheteurs d'occasion sur Vestiaire Collective, The RealReal, Rebag. Les cinq signaux spécifiques Capucines : cuir Taurillon (grain orangé pebble), LV métal pivotant, stitching tone-on-tone, doublure agneau, et hallmark argent platinium.",
    signals: [
      {
        title: "Cuir Taurillon — grain pebble orangé",
        description:
          "Le cuir Taurillon authentique a un grain pebble orangé caractéristique (pores proéminents comme des grains de poivre). Les contrefaçons utilisent un cuir embossé artificiel avec un grain trop régulier ou trop fin.",
        difficulty: 3,
      },
      {
        title: "LV métal pivotant — rotation 360°",
        description:
          "Le monogramme LV métal sur le flanc pivote sur 360° avec un mouvement fluide. Le métal est en argent platinium brossé (pas chromé). Les contrefaçons ont souvent un LV fixe (non pivotant) ou un pivotement bloqué.",
        difficulty: 1,
      },
      {
        title: "Stitching tone-on-tone — 8 points/cm",
        description:
          "Le stitching Capucines est tone-on-tone (fil de même couleur que le cuir) avec 8 points par centimètre parfaitement réguliers. Les contrefaçons ont souvent un fil légèrement contrastant ou des points irréguliers.",
        difficulty: 3,
      },
      {
        title: "Doublure agneau — souplesse et couleur",
        description:
          "La doublure intérieure est en cuir d'agneau souple (pas en tissu ni PU). La couleur varie selon le cuir extérieur (généralement crème ou ton du cuir). Les contrefaçons utilisent souvent une doublure tissu ou PU pour économiser sur les matériaux.",
        difficulty: 2,
      },
      {
        title: "Hallmark LV argent platinium — fond intérieur",
        description:
          "Un hallmark « Louis Vuitton Paris Made in France » est embossé/gravé à l'intérieur sur un patch cuir. Argent platinium pour les Capucines. Les contrefaçons ont souvent un hallmark absent, flou ou en doré au lieu de platinium.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Capucines BB Taurillon « neuve » à 2 500 €",
        description:
          "La Capucines BB retail 5 700 € et son prix marché est stable à 4 500-5 500 € en bon état. Une annonce à 2 500 € est une contrefaçon Taurillon fake ou une Capucines très usée restaurée.",
      },
      {
        title: "Python « édition limitée » à 8 000 €",
        description:
          "Les Capucines Python retail 15 000-25 000 € et leur marché est très restreint (peu d'offre). Une annonce à 8 000 € sur Vinted est une contrefaçon Python peint ou un matériau synthétique imitant le serpent.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Capucines est-elle si chère par rapport à la Neverfull ?",
        answer:
          "La Capucines utilise du cuir Taurillon premium (pas de canvas), une structure rigide, une doublure agneau et des finitions haute couture (stitching tone-on-tone, LV métal pivotant). Son coût de production est 4-5x supérieur à celui de la Neverfull.",
      },
      {
        question: "La Capucines a-t-elle un numéro de série ou date code ?",
        answer:
          "Oui, les Capucines pre-2021 ont un date code format DU/SD/FL. Post-2021, elles utilisent un RFID chip intégré. Le hallmark intérieur argent platinium sert de signature complémentaire. LegitVision détecte les incohérences hallmark/date code/format.",
      },
    ],
  },
];
