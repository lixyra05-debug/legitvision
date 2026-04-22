import type { ModelData } from "../../legit-check-types";

export const nikeModels: ModelData[] = [
  {
    slug: "air-jordan-1",
    name: "Air Jordan 1",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "180-2 500 €",
    retailYear: "1985 (rééditée)",
    tagline: "La sneaker la plus contrefaite au monde",
    intro:
      "La Nike Air Jordan 1, sortie en 1985 pour Michael Jordan, est la sneaker la plus iconique — et la plus contrefaite — de l'histoire du streetwear. Avec plus de 50 millions de paires vendues depuis sa création et une réédition annuelle (Retro High, Retro Low, Mid), la AJ1 concentre à elle seule environ 25 % du volume mondial de contrefaçons sneakers. Les coloris OG (Chicago, Bred, Royal, Shadow) sont les plus copiés, avec des super-fakes produits en Chine du Sud (Putian) qui reproduisent désormais correctement le Wings logo, le Swoosh, et le cuir pleine fleur. Le prix retail Retro High à 180-200 € et les prix marché sur les rééditions limitées (Chicago Lost & Found à 600 €, Travis Scott à 1 500 €, Off-White à 2 500-5 000 €) créent une marge de contrefaçon exceptionnelle. Pour distinguer une vraie AJ1 d'une contrefaçon en 2026, il faut examiner 5 détails techniques précis qui résistent encore aux super-fakes : la géométrie du Wings, la jointure cupsole-upper, la qualité du cuir, le Style Code et la box label.",
    signals: [
      {
        title: "Wings logo : proportions et perforations",
        description:
          "Le Wings logo authentique a 6 perforations par aile (12 au total) avec un espacement parfaitement régulier. Les plumes présentent une ouverture géométrique précise. Les contrefaçons ont souvent 5 ou 7 perforations par aile, ou un espacement irrégulier. La base du ballon Wings doit être parfaitement centrée.",
        difficulty: 2,
      },
      {
        title: "Style Code 9 caractères — format et vérification",
        description:
          "Le Style Code AJ1 est au format XXXXXX-XXX (ex. 555088-101 pour la Chicago). Vérifiez-le sur StockX ou Nike.com : il doit exister, correspondre au modèle exact et au colorway présenté. Un Style Code existant mais attribué à un autre coloris est une contrefaçon quasi-certaine.",
        difficulty: 1,
      },
      {
        title: "Jointure cupsole-upper : ligne parfaitement droite",
        description:
          "La jointure entre la cupsole (semelle) et l'upper (tige) AJ1 authentique est parfaitement rectiligne, avec une colle invisible. Les contrefaçons présentent souvent des vagues, des surplus de colle visibles (jaunâtres), ou une ligne irrégulière au niveau du talon. Inspectez au niveau de la languette médiale.",
        difficulty: 2,
      },
      {
        title: "Cuir — grain, souplesse, odeur",
        description:
          "Le cuir AJ1 authentique est un cuir pleine fleur qui marque à la pression et reprend sa forme. Il dégage une odeur de cuir caractéristique, pas d'odeur chimique de colle ou de solvant. Les contrefaçons utilisent du cuir refendu ou du simili qui sent le plastique ou la colle, et ne marque pas correctement.",
        difficulty: 3,
      },
      {
        title: "Police et alignement de la box label",
        description:
          "La box label AJ1 utilise la police Futura Bold avec un espacement précis entre les champs (STYLE, COLOR, SIZE). L'alignement est rigoureux, sans décalage. Les contrefaçons utilisent souvent une police trop grasse, un espacement trop serré, ou un alignement décalé de 1-2 mm. L'étiquette doit être collée droite, sans bulles.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Photos de la Chicago Lost & Found à 300 €",
        description:
          "La Jordan 1 Chicago Lost & Found (2022) a un prix marché stable à 600-900 €. Toute annonce sous 500 € est à 95 % une contrefaçon, souvent avec photos volées à StockX. Faites une reverse image search Google avant tout paiement.",
      },
      {
        title: "Travis Scott AJ1 Low Mocha neuve à 400 €",
        description:
          "Le prix marché secondaire de la Travis Scott AJ1 Low Mocha est de 1 100-1 600 € en état neuf. Une annonce sous 700 € est statistiquement une contrefaçon à 99 %. Les super-fakes reproduisent désormais le Swoosh inversé et le Cactus Jack tag, mais pas la densité du cuir reverse.",
      },
    ],
    faqs: [
      {
        question: "Comment vérifier une Air Jordan 1 sans les box ?",
        answer:
          "La box n'est qu'un signal parmi d'autres. Sans box, concentrez-vous sur les 5 signaux physiques : Wings logo (perforations et alignement), Style Code imprimé sur l'étiquette intérieure, jointure cupsole, qualité du cuir (odeur + marque à la pression), et cohérence des coutures (7-9 points par pouce). Une AJ1 authentique sans box reste authentifiable à 95 % via ces critères.",
      },
      {
        question: "Quelle différence entre AJ1 Retro High et Retro Low ?",
        answer:
          "La AJ1 Retro High arrive au-dessus de la malléole (tige haute) et se décline en coloris iconiques (Chicago, Bred, Royal). La AJ1 Retro Low s'arrête sous la malléole et est techniquement une réédition basée sur le prototype 1985. Les contrefaçons sont également répandues sur les deux versions. Les critères d'authentification (Wings, Swoosh, cupsole) sont identiques.",
      },
    ],
  },
  {
    slug: "air-jordan-4",
    name: "Air Jordan 4",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "200-2 000 €",
    retailYear: "1989 (rééditée)",
    tagline: "Le deuxième modèle Jordan le plus contrefait",
    intro:
      "La Nike Air Jordan 4, designée par Tinker Hatfield en 1989, est la deuxième paire Jordan la plus contrefaite au monde après la Jordan 1. Ses rééditions (Bred, White Cement, Fire Red, Oreo, Military Blue) se revendent entre 250 et 600 € sur le marché secondaire, tandis que les collaborations limitées (Travis Scott Cactus Jack 2018, Off-White 2020, Eminem Carhartt 2015) atteignent 1 500-8 000 €. Ces prix élevés alimentent une industrie de contrefaçon massive — environ 30 000 paires de fausses Travis Scott AJ4 Cactus Jack identifiées en circulation en 2025 selon StockX. La AJ4 est structurellement plus complexe que la AJ1 avec ses 4 wings latéraux, ses 6 œillets, son mudguard perforé et son talon en nubuck : cette complexité trahit les super-fakes qui reproduisent rarement l'alignement exact de tous ces éléments. La vérification technique d'une AJ4 exige l'examen de 5 points précis : Style Code, Nike Air jock tag talon, wings latéraux, mudguard et coutures du nubuck.",
    signals: [
      {
        title: "Jock tag talon « Nike Air » — police et alignement",
        description:
          "Le jock tag au talon AJ4 porte « Nike Air » sur 2 lignes avec une police Futura condensée. Les deux mots doivent être parfaitement centrés verticalement et horizontalement. Les contrefaçons présentent souvent un tag décalé, une police trop épaisse, ou un tag cousu de travers. Pour les rééditions Retro post-2016, vérifiez aussi le Jumpman au-dessus du tag.",
        difficulty: 2,
      },
      {
        title: "Wings latéraux : 4 ailes symétriques",
        description:
          "La AJ4 a 4 wings latéraux (2 de chaque côté) qui doivent être parfaitement symétriques en taille et en position. Les contrefaçons présentent souvent des wings asymétriques ou de tailles différentes. Mesurez la distance entre chaque wing et la cupsole : elle doit être identique côté médial et latéral.",
        difficulty: 2,
      },
      {
        title: "Mudguard perforé : nombre exact de perforations",
        description:
          "Le mudguard AJ4 a un nombre précis de perforations qui varie légèrement selon le coloris (typiquement 43-46 par côté). Les perforations doivent être parfaitement rondes avec un diamètre constant. Les contrefaçons présentent souvent des perforations ovales, de tailles variables, ou un nombre incorrect.",
        difficulty: 3,
      },
      {
        title: "Texture du nubuck talon et heel counter",
        description:
          "Le talon AJ4 utilise un nubuck (cuir retourné) de haute qualité avec un grain fin uniforme. Les contrefaçons utilisent souvent un simili-nubuck avec un grain trop gros, brillant ou irrégulier. Frottez doucement le nubuck : il doit changer de teinte temporairement sous la pression (effet « velour »).",
        difficulty: 2,
      },
      {
        title: "Style Code sur étiquette intérieure",
        description:
          "Le Style Code AJ4 suit le format 308497-XXX ou équivalent selon génération (ex. 308497-060 Bred). Vérifiez qu'il correspond au colorway exact sur StockX ou Nike.com. La languette doit aussi porter la pointure, le pays de fabrication (Vietnam ou Indonésie) et la date.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Travis Scott AJ4 Cactus Jack à 600 € sur Vinted",
        description:
          "Le prix marché de la Travis Scott AJ4 Cactus Jack (2018) oscille entre 1 400 et 2 200 €. Toute annonce sous 900 € est à 98 % une contrefaçon. Les super-fakes reproduisent le hang tag Cactus Jack mais pas la qualité du nubuck gris ni l'alignement exact des wings.",
      },
      {
        title: "AJ4 Bred Retro 2019 neuve à 220 €",
        description:
          "La AJ4 Bred (rééditée 2019) se vend 350-500 € en état DS (Deadstock). Une annonce à 220 € est suspecte — vérifiez systématiquement photos intérieur box, Style Code (308497-060), et jock tag talon.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Jordan 4 est-elle plus complexe à authentifier que la Jordan 1 ?",
        answer:
          "La AJ4 a plus d'éléments à vérifier : 4 wings (vs 2 pour AJ1), 6 œillets spécifiques, mudguard perforé, Nike Air jock tag talon (ou Jumpman post-2016), et nubuck au talon. Cette complexité structurelle multiplie les points d'erreur pour les contrefacteurs, mais exige aussi une vérification plus exhaustive. Les super-fakes AJ4 ratent souvent 1-2 de ces 5 points.",
      },
      {
        question: "Les AJ4 Retro post-2016 ont-elles le même jock tag ?",
        answer:
          "Non — à partir de 2016, Nike a modifié le jock tag talon pour ajouter le Jumpman au-dessus du « Nike Air ». Les rééditions 2016+ (Alternate Motorsport, Oreo 2021, Red Thunder 2022) ont donc Jumpman + Nike Air. Les éditions antérieures (pre-2016) ont uniquement « Nike Air ». Vérifiez la cohérence entre la date de fabrication sur l'étiquette et le type de jock tag présent.",
      },
    ],
  },
  {
    slug: "air-jordan-11",
    name: "Air Jordan 11",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "200-1 200 €",
    retailYear: "1995 (rééditée)",
    tagline: "Le cuir verni emblématique, le défi n°1 des super-fakes",
    intro:
      "La Nike Air Jordan 11, designée par Tinker Hatfield et sortie en 1995, est considérée par beaucoup comme la plus belle Air Jordan jamais produite. Son cuir verni (patent leather) enveloppant l'upper en mesh est une signature technique difficile à reproduire — ce qui en fait paradoxalement une cible privilégiée des super-fakes haut de gamme. Les rééditions annuelles « Holiday » (Bred 1995/2019, Concord 1995/2018, Space Jam 1995/2016, Playoff, Legend Blue) se vendent entre 280 et 700 € à retail, avec un marché secondaire entre 400 et 1 200 € selon génération et état. Environ 40 000 paires de fausses AJ11 sont en circulation sur le marché européen selon les estimations, principalement des Bred et Concord. Les super-fakes reproduisent désormais correctement la languette Jumpman et le cuir verni, mais ratent systématiquement 2 détails techniques : le gonflement précis de la cupsole air bubble arrière et la qualité du mesh ballistique. Vérifier une AJ11 authentique exige donc une attention particulière sur 5 signaux.",
    signals: [
      {
        title: "Cuir verni : brillance et pliage",
        description:
          "Le patent leather AJ11 authentique est un cuir verni de qualité militaire qui reste souple, se plie sans craqueler immédiatement, et présente une brillance profonde (pas miroir). Les contrefaçons utilisent souvent du PVC verni qui se fissure après peu d'utilisations et présente une brillance artificielle (miroir). Pliez doucement : l'authentique marque temporairement sans fissure.",
        difficulty: 2,
      },
      {
        title: "Air bubble arrière — forme et gonflement",
        description:
          "La cupsole AJ11 a une unité Zoom Air visible au niveau du talon, avec un gonflement précis visible de profil. Les contrefaçons présentent souvent une bulle d'air trop plate ou mal alignée. Comparez de profil avec une photo officielle Nike du même colorway : la silhouette arrière doit être identique.",
        difficulty: 3,
      },
      {
        title: "Mesh ballistique latéral — densité",
        description:
          "L'upper AJ11 utilise un mesh ballistique nylon à densité spécifique (trame visible mais serrée). Les contrefaçons utilisent un mesh plus lâche ou brillant. Frottez le mesh : il doit être rigide, non-flexible. Une flexibilité excessive indique une contrefaçon.",
        difficulty: 2,
      },
      {
        title: "Languette Jumpman et pull tab",
        description:
          "La languette porte un Jumpman brodé au fil, pas imprimé. Le pull tab arrière en cuir a une forme trapézoïdale précise avec « 23 » ou numéro brodé selon colorway. Les contrefaçons utilisent souvent un Jumpman imprimé ou thermo-collé et un pull tab aux proportions incorrectes.",
        difficulty: 2,
      },
      {
        title: "Semelle translucide : nuance et motif",
        description:
          "La semelle AJ11 est translucide (glace) avec un motif zoom visible. La teinte doit être parfaitement translucide sans tonalité jaunâtre ou bleuâtre (sauf modèles specific comme Columbia). Les contrefaçons présentent souvent une semelle légèrement jaunie ou avec un motif flou.",
        difficulty: 3,
      },
    ],
    scams: [
      {
        title: "AJ11 Concord 2018 à 300 € sur Vinted",
        description:
          "La AJ11 Concord 2018 (retail 220 €, marché 500-750 €) à 300 € est statistiquement une contrefaçon. Les super-fakes Concord reproduisent bien le patent leather mais ratent la cupsole et le mesh. Demandez toujours photos de profil pour vérifier l'air bubble.",
      },
      {
        title: "AJ11 Space Jam customisée en « Space Jam 2 »",
        description:
          "La Space Jam originale (2016) est parfois customisée ou rebrandée en « Space Jam 2 » inexistante (aucune sortie officielle Nike). Toute AJ11 « Space Jam 2 » annoncée est une customisation non-officielle ou une contrefaçon. La Space Jam Low (2021) existe mais pas de High « Space Jam 2 ».",
      },
    ],
    faqs: [
      {
        question: "Comment distinguer une AJ11 OG 1995 d'une réédition ?",
        answer:
          "Les AJ11 OG 1995 ont le « 45 » brodé sur le talon (numéro de Jordan en baseball), tandis que les rééditions 2000+ ont le « 23 ». La date de fabrication sur l'étiquette intérieure et le Style Code permettent de confirmer la génération. Les OG 1995 sont extrêmement rares en état DS et peuvent atteindre 3 000-5 000 € — mais 99,9 % des annonces revendiquant une OG 1995 à bas prix sont des contrefaçons ou des rééditions mal identifiées.",
      },
      {
        question: "Le cuir verni AJ11 jaunit-il avec le temps ?",
        answer:
          "Oui, le patent leather jaunit naturellement avec l'exposition UV et l'oxydation, particulièrement sur les zones blanches (Concord, Columbia). Ce jaunissement est normal après 3-5 ans de stockage, même DS. Un cuir verni parfaitement blanc sur une paire revendiquée « DS 2018 » est suspect — soit la paire a été blanchie (dégrade la qualité), soit c'est une contrefaçon récente.",
      },
    ],
  },
  {
    slug: "air-force-1",
    name: "Air Force 1",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "90-400 €",
    retailYear: "1982 (production continue)",
    tagline: "La sneaker la plus vendue au monde — et la plus copiée",
    intro:
      "La Nike Air Force 1 Low, designée par Bruce Kilgore en 1982, est la sneaker la plus vendue dans l'histoire avec plus de 250 millions de paires produites. Son design minimaliste (cuir blanc pleine fleur, Swoosh, Air sole) en fait la paire la plus portée au monde — et aussi la plus contrefaite. En volume brut, la AF1 blanche représente environ 35 % des contrefaçons sneakers mondiales selon les douanes européennes. Son prix retail bas (109-130 €) comparé à un coût de production clandestine de 8-15 € offre la marge la plus rentable pour les contrefacteurs industriels chinois. Les coloris OG (Triple White, Triple Black, Shadow) sont les plus copiés, suivis des collaborations (Travis Scott Cactus Jack, Off-White, Louis Vuitton). Paradoxalement, la simplicité du design rend les super-fakes techniquement crédibles sur photo — il faut examiner 5 détails précis pour les distinguer d'une paire authentique : le Swoosh, la forme du Air sole, la cupsole, l'étiquette intérieure et le Style Code.",
    signals: [
      {
        title: "Swoosh : forme asymétrique et pointe fine",
        description:
          "Le Swoosh AF1 authentique est asymétrique : la pointe est fine et effilée, tandis que la base est plus épaisse. Les contrefaçons ont souvent un Swoosh trop symétrique, trop bulbeux à la pointe, ou avec une courbure trop régulière. Comparez avec une photo officielle Nike.com du modèle exact.",
        difficulty: 1,
      },
      {
        title: "Air sole : bulle d'air visible sur le côté",
        description:
          "La AF1 Low a une unité Air sole visible sur la cupsole latérale (le « AIR » gravé). La bulle d'air doit être parfaitement centrée, avec un gonflement symétrique. Les contrefaçons présentent souvent une bulle asymétrique, un « AIR » mal aligné, ou un gonflement irrégulier.",
        difficulty: 2,
      },
      {
        title: "Cupsole : pattern en étoiles perlées",
        description:
          "La semelle AF1 a un pattern caractéristique en étoiles perlées avec un contraste précis entre les zones traction et les zones lisses. Les contrefaçons uniformisent souvent ce pattern ou le rendent trop flou. Regardez la base : chaque étoile doit être nette et régulièrement espacée.",
        difficulty: 2,
      },
      {
        title: "Étiquette intérieure : alignement et police",
        description:
          "L'étiquette intérieure AF1 porte Nike size chart + Style Code + pays de fabrication. La police doit être nette, les espacements réguliers. Les contrefaçons présentent souvent une police trop grasse, un espacement trop serré, ou un alignement décalé de 2-3 mm. Les AF1 authentiques sont majoritairement « Made in China » ou « Made in Vietnam ».",
        difficulty: 1,
      },
      {
        title: "Style Code format CW2288-XXX (ou équivalent)",
        description:
          "Le Style Code AF1 Low Triple White est CW2288-111. Chaque colorway a son propre code (ex. DM0209-100 pour Shadow White, DD8959-100 pour Para Noise). Vérifiez sur Nike.com ou StockX : le code doit exister et correspondre au colorway exact présenté en photo.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "AF1 Triple White « neuves » à 45 € sur Vinted",
        description:
          "Les AF1 Triple White retail à 109-130 € et se revendent 80-100 € en état DS. Toute annonce sous 50 € est statistiquement à 98 % une contrefaçon. Les super-fakes AF1 Triple White circulent massivement à 20-40 € en provenance directe d'usines Putian.",
      },
      {
        title: "Travis Scott AF1 Sail à 400 € sur Facebook Marketplace",
        description:
          "La Travis Scott AF1 Sail a un prix marché de 1 800-2 800 €. Une annonce à 400 € est à 99 % une contrefaçon. Les super-fakes reproduisent le Swoosh inversé et le Cactus Jack tag mais ratent toujours la cupsole beige spécifique et les coutures Sail.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi autant de fausses AF1 blanches sur Vinted ?",
        answer:
          "3 raisons principales : (1) c'est la sneaker la plus portée au monde donc volume de recherche massif sur Vinted, (2) le retail bas (109-130 €) crée une marge exceptionnelle sur les super-fakes à 20-40 € de production, (3) le design minimaliste (cuir blanc + Swoosh) est simple à reproduire visuellement sur photo. Environ 35 % des AF1 blanches mises en vente sur Vinted à moins de 60 € sont des contrefaçons selon les estimations.",
      },
      {
        question: "Les AF1 Mid et High ont-elles les mêmes critères d'auth ?",
        answer:
          "Oui, les signaux sont identiques : Swoosh asymétrique, Air sole visible, pattern cupsole en étoiles, étiquette intérieure, Style Code. La AF1 Mid ajoute une sangle supplémentaire à la cheville avec un Nike Air strap (vérifier que le « NIKE AIR » est correctement aligné sur la sangle). La AF1 High ajoute en plus un logo brodé à la cheville (vérifier broderie vs impression).",
      },
    ],
  },
  {
    slug: "dunk-low",
    name: "Dunk Low",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "110-500 €",
    retailYear: "1985 (comeback 2020)",
    tagline: "La revanche culturelle depuis 2020",
    intro:
      "La Nike Dunk Low, initialement sortie en 1985 comme chaussure de basket NCAA, a connu un comeback spectaculaire depuis 2020 grâce à la collaboration Travis Scott et aux rééditions Retro régulières. Son prix retail (110 €) et ses collaborations hyped ont créé un marché secondaire gigantesque : la Panda se revend 220-280 €, la Travis Scott à 2 000 €, l'Off-White « The 50 » entre 800 et 3 000 €. Cette explosion des prix a fait de la Dunk Low la deuxième sneaker la plus contrefaite au monde en 2024-2026, après la AJ1. Les contrefacteurs ciblent principalement les coloris hyped : Panda (blanche/noire), Chicago, Kentucky, Syracuse, et toutes les collaborations. Vérifier une Dunk Low authentique exige d'examiner 5 détails structurels spécifiques à ce modèle — pas la AF1, pas la AJ1 : la construction à 2 couleurs contrastées, l'overlay latéral, la Swoosh position, la languette et la cupsole herringbone.",
    signals: [
      {
        title: "Overlay latéral : forme et couture exacte",
        description:
          "La Dunk Low a un overlay en cuir au niveau du mudguard et du toe box. Cet overlay a une forme géométrique précise avec des coutures visibles à 7-9 points par pouce. Les contrefaçons présentent souvent un overlay aux angles mal découpés ou avec des coutures irrégulières.",
        difficulty: 2,
      },
      {
        title: "Languette : épaisseur et position du Nike tag",
        description:
          "La languette Dunk Low authentique est épaisse (5-7 mm rembourrée) avec le logo « NIKE » brodé centré. Les contrefaçons ont souvent une languette trop fine ou le logo mal centré/décalé. L'étiquette intérieure languette doit être cousue proprement des deux côtés.",
        difficulty: 2,
      },
      {
        title: "Swoosh position : angle et longueur",
        description:
          "Le Swoosh latéral Dunk Low démarre à une position précise sur l'overlay et s'étire jusqu'à l'arrière. La pointe finale du Swoosh doit dépasser l'overlay d'environ 2 mm. Les contrefaçons présentent souvent un Swoosh trop court, trop long, ou avec un angle incorrect.",
        difficulty: 2,
      },
      {
        title: "Cupsole : pattern herringbone + cup forme",
        description:
          "La semelle Dunk Low a un pattern herringbone (chevron) net avec une cupsole en forme de coupe visible. Les contrefaçons présentent souvent un herringbone flou ou irrégulier. L'alignement cupsole-upper doit être parfaitement rectiligne.",
        difficulty: 2,
      },
      {
        title: "Style Code et boîte orange",
        description:
          "Le Style Code Dunk Low suit le format DD1391-XXX (Panda : DD1391-100) ou équivalent selon collabs. La box doit être orange Nike signature avec code-barre et colorway. La box Travis Scott Dunk Low a un coloris spécifique brun avec Cactus Jack imprimé.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Dunk Low Panda « neuve » à 120 € sur Vinted",
        description:
          "La Dunk Low Panda retail à 115 € se revend 220-280 € en état DS. Une annonce sous 180 € pour une Panda neuve est à 90 % une contrefaçon. Les super-fakes Panda circulent massivement — vérifiez cupsole herringbone et coutures overlay latéral.",
      },
      {
        title: "Travis Scott Dunk Low à 500 € sur Facebook Marketplace",
        description:
          "La Travis Scott Dunk Low (2022) a un prix marché de 1 800-2 400 €. Une annonce à 500 € est une contrefaçon quasi-certaine. Les super-fakes reproduisent le reverse Swoosh et l'overlay tweed mais ratent la cupsole exact du coloris Travis Scott.",
      },
    ],
    faqs: [
      {
        question: "Dunk Low vs Dunk Low SB : quelle différence ?",
        answer:
          "La Dunk Low classique (Lifestyle, rééditée 2020+) utilise une cupsole basique. La Dunk Low SB (Skateboarding, ligne dédiée Nike Skateboarding depuis 2002) a une cupsole plus épaisse et amortie pour le skateboard, une languette encore plus rembourrée (Puffy Tongue), et des coloris exclusifs (Strangelove, Chunky Dunky, What The Dunk). Le Style Code SB commence par « CU », « CT » ou « BQ ». Les deux lignes sont distinctes mais toutes deux massivement contrefaites.",
      },
      {
        question: "Les Dunk Low PS (Preschool) sont-elles aussi contrefaites ?",
        answer:
          "Moins en volume mais en pourcentage similaire. La Dunk Low PS (version enfant) est souvent achetée par des collectionneurs pour leurs enfants, ce qui en fait une cible secondaire. Les mêmes critères d'auth s'appliquent : overlay, cupsole herringbone, Swoosh, languette, Style Code (avec suffixe PS différent du GS ou adulte).",
      },
    ],
  },
  {
    slug: "dunk-sb",
    name: "Dunk SB",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "130-3 000 €",
    retailYear: "2002 (ligne Skateboarding)",
    tagline: "La ligne collab culte, la plus complexe à authentifier",
    intro:
      "La Nike Dunk SB (Skateboarding) est la ligne sneaker la plus collab-intense de l'histoire Nike, avec plus de 800 colorways différents produits depuis 2002. De la Paris « Bernard Buffet » (2003, retail 150 €, marché 10 000-25 000 €) à la Chunky Dunky (2020), chaque drop SB est une événement marketing. Cette intensité collab rend la ligne SB particulièrement difficile à authentifier : il n'y a pas 5 mais plus de 800 « bonnes » versions à vérifier, chacune avec ses caractéristiques propres. La complexité favorise les contrefacteurs professionnels qui produisent des super-fakes ciblés sur les drops les plus hyped : Travis Scott SB (2020, 1 800-3 000 €), Strangelove (2020, 1 200-2 000 €), Holy Grail (ex. Freddy Krueger, Heineken) à 20 000-100 000 €. La vérification d'une Dunk SB exige de maîtriser les signatures communes de la ligne SB (Puffy Tongue, cupsole épaisse, Zoom Air) ET les détails spécifiques du colorway revendiqué. 5 signaux clés permettent une première filtration sur toute Dunk SB.",
    signals: [
      {
        title: "Puffy Tongue : épaisseur et hauteur signature",
        description:
          "La languette SB est Puffy (gonflée), notablement plus épaisse que la Dunk Low classique (12-15 mm vs 5-7 mm). Elle dépasse d'environ 2 cm au-dessus de la cheville. Les contrefaçons utilisent souvent une languette trop fine ou trop haute. Pressez-la : elle doit être rembourrée et résistante.",
        difficulty: 2,
      },
      {
        title: "Zoom Air insole — marquage intérieur",
        description:
          "Les SB ont une semelle intérieure Zoom Air avec un marquage spécifique (Zoom Air ou NIKE SB imprimé). Ce marquage est souvent absent sur les contrefaçons ou remplacé par un insole générique. Sortez l'insole pour vérifier.",
        difficulty: 2,
      },
      {
        title: "Cupsole SB : épaisseur et pattern herringbone",
        description:
          "La cupsole SB est environ 20-25 % plus épaisse que la Dunk Low classique, avec un pattern herringbone très marqué. Les contrefaçons SB utilisent souvent une cupsole Dunk Low classique (trop fine) ou un pattern herringbone flou. La différence est visible de profil.",
        difficulty: 2,
      },
      {
        title: "Style Code SB spécifique : format CT/CU/BQ",
        description:
          "Les Style Codes SB commencent par CT, CU, BQ, 304292, 313170 selon génération. Chaque drop SB a son code unique (ex. Travis Scott SB : CT5053-001). Un Style Code AF1 ou Dunk Low classique utilisé pour une paire revendiquée SB est une contrefaçon.",
        difficulty: 1,
      },
      {
        title: "Cohérence hang tags + packaging collab",
        description:
          "Chaque drop SB collab a son packaging spécifique : hang tags personnalisés, box spéciale (Travis Scott = box brune Cactus Jack, Strangelove = box rouge cœurs, etc.), insoles imprimés. L'absence de ces éléments ou leur mauvaise qualité trahit une contrefaçon. Vérifiez sur Sneaker News ou Hypebeast le packaging officiel du drop.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Travis Scott SB « neuve » à 500 € sur Vinted",
        description:
          "La Travis Scott SB retail à 135 € se revend 1 800-2 600 € en DS. Toute annonce sous 1 000 € est une contrefaçon certaine. Les super-fakes reproduisent bien le Swoosh removable mais ratent la cupsole SB spécifique et les hang tags Cactus Jack.",
      },
      {
        title: "Paris SB 2003 « DS dans la box » à 3 000 €",
        description:
          "Les Paris SB originales (2003) ont un prix marché de 15 000-30 000 € en DS. Toute annonce à moins de 8 000 € est statistiquement 99 % une contrefaçon. Les Paris SB sont l'un des Holy Grails les plus imités — exigez toujours authentification par expert dédié (StockX, Sole Swap).",
      },
    ],
    faqs: [
      {
        question: "Comment vérifier un drop SB rare (Paris, Heineken, etc.) ?",
        answer:
          "Pour les Holy Grails SB (valeur > 5 000 €), les critères visuels standard ne suffisent pas — les super-fakes peuvent reproduire la majorité des détails. Passez obligatoirement par un authentificateur professionnel dédié (StockX authentification complète, Sole Swap, CheckCheck) qui possèdent des paires authentiques de référence pour comparaison. Le coût d'authentification (50-300 €) est marginal face à la valeur de l'article.",
      },
      {
        question: "Les Dunk SB en collaboration Nike SB x Brand sont-elles toutes cupsole Zoom Air ?",
        answer:
          "Oui, toute Dunk SB authentique (collab ou non) utilise la cupsole SB spécifique avec Zoom Air insole. Une paire SB revendiquée sans Zoom Air ou avec une cupsole trop fine (comparable à Dunk Low Lifestyle) est soit une erreur de référencement, soit une contrefaçon. Seules exceptions : les Dunk Low Lifestyle Retro 2020+ inspirées de SB mais techniquement pas SB.",
      },
    ],
  },
  {
    slug: "air-max-1",
    name: "Air Max 1",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "130-500 €",
    retailYear: "1987 (rééditée)",
    tagline: "La première Air visible de l'histoire sneaker",
    intro:
      "La Nike Air Max 1, designée par Tinker Hatfield en 1987, a révolutionné le sneaker game en introduisant la première unité Air visible de l'histoire. Inspirée du Centre Pompidou à Paris (dont Hatfield a emprunté l'idée de la transparence structurelle), la AM1 a défini l'ADN de toute la ligne Air Max qui a suivi. Son retail actuel (130-160 €) et son marché secondaire sur les OG (Red 1987, Patta, Kiss of Death) entre 300 et 2 000 € en font une cible de contrefaçon historique. Moins contrefaite que la AJ1 ou la AF1 en volume pur, la AM1 présente néanmoins un taux de super-fakes de qualité élevée, particulièrement sur les collaborations Patta, atmos, et Cactus Jack. La signature technique de la AM1 réside dans l'air bubble talon, le mesh ballistique et le mudguard en cuir suède. Vérifier une AM1 exige d'examiner 5 détails spécifiques à ce modèle, différents de ceux d'une AF1 ou d'une AJ1.",
    signals: [
      {
        title: "Air bubble talon — forme et transparence",
        description:
          "L'air bubble AM1 est visible sur le talon latéral avec une forme ovale précise et une transparence parfaite. Les contrefaçons présentent souvent une bulle d'air jaunie, mal proportionnée ou légèrement décalée. Regardez à travers : vous devez voir clairement l'intérieur de la cupsole.",
        difficulty: 2,
      },
      {
        title: "Mesh ballistique upper — trame serrée",
        description:
          "L'upper AM1 utilise un mesh ballistique nylon à trame fine et serrée. Les contrefaçons utilisent un mesh trop lâche ou brillant. Frottez : il doit être rigide, non-extensible. La texture est mate, pas brillante.",
        difficulty: 2,
      },
      {
        title: "Suède du mudguard et Swoosh",
        description:
          "Le mudguard AM1 et le Swoosh latéral (coloris OG) sont en suède (peau retournée) de qualité, pas en simili. Le suède doit avoir un grain fin et changer de teinte temporairement sous pression. Les contrefaçons utilisent souvent un simili-suède brillant.",
        difficulty: 2,
      },
      {
        title: "Languette : logo Nike Air et rembourrage",
        description:
          "La languette AM1 porte « NIKE AIR » brodé (pas imprimé) en 2 lignes. Le rembourrage est moyen (pas Puffy comme SB). Les contrefaçons impriment souvent le logo ou utilisent une police trop fine/grasse.",
        difficulty: 1,
      },
      {
        title: "Style Code et date cohérente",
        description:
          "Style Code AM1 format 908375-XXX ou équivalent. Patta AM1 utilise codes DH1347-XXX selon collab. La date de fabrication sur l'étiquette doit être cohérente avec le drop : une AM1 Patta 2021 avec date 2019 est une contrefaçon.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Patta AM1 « neuve » à 300 € sur Grailed",
        description:
          "La Patta AM1 Noise Aqua (2021) a un prix marché de 800-1 400 €. Une annonce à 300 € est suspecte — vérifiez hang tags Patta, box spéciale, et date de fabrication cohérente. Les super-fakes Patta circulent depuis 2022.",
      },
      {
        title: "AM1 « 86 Pack » Centre Pompidou à 200 €",
        description:
          "La AM1 Big Bubble « 86 Pack » Centre Pompidou (2024) retail à 190 € et se revend 350-500 €. Une annonce à 200 € DS est crédible si le vendeur a une preuve d'achat, mais suspecte sinon. Vérifiez systématiquement le hang tag « 86 Pack » spécifique.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi les AM1 OG 1987 sont-elles si rares ?",
        answer:
          "Les AM1 OG 1987 (premier drop, Red ou Blue) ont été produites en quantités limitées comparé aux standards modernes. Leur disponibilité actuelle en état DS est quasi-nulle — la plupart ont été portées, jaunies ou détruites. Les rééditions 1992, 2002, 2013, 2017, 2022 sont beaucoup plus communes. Une AM1 revendiquée « OG 1987 DS » à moins de 2 500-3 500 € est statistiquement une contrefaçon ou une mauvaise identification.",
      },
      {
        question: "Différence entre AM1 et AM1 Big Bubble ?",
        answer:
          "La AM1 Big Bubble (2023-2024) reproduit la construction originale 1987 avec une air bubble plus grande (Big Bubble). Les rééditions standard post-1990 utilisent une bubble réduite pour des raisons de production. La Big Bubble est visible immédiatement : le talon est ~15 % plus épais qu'une AM1 standard. Les coloris Big Bubble (Anniversary Red, Royal, Patta reissues) ont un hang tag spécifique « Big Bubble Anniversary ».",
      },
    ],
  },
  {
    slug: "air-max-90",
    name: "Air Max 90",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "130-600 €",
    retailYear: "1990 (rééditée)",
    tagline: "L'Air Max la plus populaire en Europe",
    intro:
      "La Nike Air Max 90, designée par Tinker Hatfield en 1990, est la paire Air Max la plus vendue en Europe depuis 30 ans, particulièrement popularisée par la scène football/casual britannique et française dans les années 2000. Son retail à 130-160 € et son marché secondaire entre 200 et 800 € sur les rééditions rares (Infrared 1990/2020, Duck Camo, Undefeated) en font une cible de contrefaçon massive, spécifiquement ciblée sur les marchés européens. Volume de contrefaçons AM90 détectées en douane en 2025 : environ 80 000 paires pour la zone UE selon les rapports OLAF. La AM90 présente 5 signatures techniques distinctes des autres Air Max : la bulle d'air plus grande que la AM1, le mudguard tri-couche typique, la cupsole plus structurée, la languette plus épaisse, et l'overlay polyuréthane caractéristique. Ces 5 détails sont les points de vérification clés en 2026.",
    signals: [
      {
        title: "Bulle d'air talon : plus grande que AM1",
        description:
          "La bubble AM90 est environ 30 % plus grande que celle de l'AM1, avec une forme plus arrondie. Les contrefaçons utilisent parfois une bubble AM1 (trop petite) ou une bubble mal proportionnée. Mesurez la hauteur bubble vs cupsole : elle doit représenter environ 40 % de la hauteur totale du talon.",
        difficulty: 2,
      },
      {
        title: "Mudguard tri-couche : 3 couleurs distinctes",
        description:
          "Le mudguard AM90 a 3 couches visibles superposées (cuir + TPU + polyuréthane) sur les coloris OG. Chaque couche doit être nettement distincte avec une jointure propre. Les contrefaçons fusionnent souvent les couches ou présentent une jointure floue.",
        difficulty: 2,
      },
      {
        title: "Cupsole : pattern « waffle » carré",
        description:
          "La semelle AM90 utilise un pattern waffle (gaufré) avec des carrés nets, différent du herringbone Dunk. Les carrés doivent être parfaitement alignés avec des angles droits. Les contrefaçons présentent souvent des carrés flous ou irréguliers.",
        difficulty: 2,
      },
      {
        title: "Languette : logo Nike Air + pull loop",
        description:
          "La languette AM90 a un logo « Nike Air » brodé au centre et un pull loop arrière pour faciliter l'enfilage. Le pull loop doit être en textile tissé, bien cousu. Les contrefaçons omettent souvent le pull loop ou utilisent un nylon fin qui se déchire vite.",
        difficulty: 1,
      },
      {
        title: "Swoosh latéral : pointe et courbure",
        description:
          "Le Swoosh AM90 démarre sur le mudguard et s'étire jusqu'à l'arrière avec une pointe fine et un angle spécifique. Comparé à l'AF1, le Swoosh AM90 est légèrement plus long et plus plongeant à la pointe. Comparez avec une photo officielle du colorway exact.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "AM90 Infrared « DS 1990 » à 400 €",
        description:
          "Les AM90 Infrared OG 1990 DS sont quasi-introuvables à moins de 3 000-5 000 €. Une annonce à 400 € « DS 1990 » est à 99 % une contrefaçon. La réédition Infrared 2020 retail à 160 € et se revend 250-400 € DS — vérifiez la date de fabrication exacte.",
      },
      {
        title: "Undefeated x AM90 à 200 € sur Vinted",
        description:
          "La Undefeated x AM90 (2020, 4 colorways) retail à 180 € et se revend 450-700 € DS selon colorway. Une annonce à 200 € est suspecte — vérifiez hang tag Undefeated, box spéciale collab, et cohérence Style Code CJ2007-XXX.",
      },
    ],
    faqs: [
      {
        question: "AM90 vs AM90 Recraft : quelle différence ?",
        answer:
          "La « AM90 Recraft » est une ligne qui reproduit plus fidèlement les spec originales 1990 (cuir plus épais, mudguard tri-couche respecté, cupsole reconstitué). Les AM90 standard post-2010 ont des ajustements de production (cuir plus fin, composants simplifiés). Les Recraft se reconnaissent à leur hang tag spécifique et à leur Style Code (ex. DH6132-XXX pour Citron Recraft). Les contrefaçons Recraft reproduisent le hang tag mais pas la qualité du cuir reconstitué.",
      },
      {
        question: "Pourquoi la scène football UK adore-t-elle la AM90 ?",
        answer:
          "La AM90 Infrared 1990 est devenue dès 1995 la sneaker emblématique de la culture « casual » UK (football hooligan reconverti en lifestyle), portée par tous les firms de stade (Man Utd, Leeds, Chelsea). Le retail accessible (£65 à l'époque) et le design audacieux Infrared ont fait de la AM90 un symbole identitaire. Cette culture a maintenu la AM90 comme paire culte en Europe bien au-delà de son cycle initial — expliquant aussi pourquoi les contrefacteurs ciblent intensivement le marché UK/Europe.",
      },
    ],
  },
  {
    slug: "air-max-95",
    name: "Air Max 95",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "170-600 €",
    retailYear: "1995 (rééditée)",
    tagline: "Le design anatomique culte des années 90",
    intro:
      "La Nike Air Max 95, designée par Sergio Lozano en 1995, a introduit une rupture radicale dans le design sneaker : inspirée par l'anatomie humaine (les couches latérales représentent les muscles, la base les vertèbres, le mesh le tissu conjonctif), la AM95 est la première Air Max avec unités Air visibles au talon ET à l'avant-pied. Son retail actuel (170-200 €) et son marché secondaire sur les coloris OG (Neon, Solar Red) entre 300 et 700 € en font une paire culte du Japon et du Royaume-Uni. Au Japon en particulier, la AM95 Neon est un phénomène culturel depuis 1995 (vols et braquages documentés à l'époque), maintenant une demande soutenue et un volume de contrefaçons japonais-spécifiques élevé. La complexité de construction AM95 (gradient de couches latérales, 2 unités Air, mesh multi-densité) en fait l'une des Air Max les plus difficiles à contrefaire correctement — les super-fakes ratent systématiquement 1-2 des 5 détails techniques clés.",
    signals: [
      {
        title: "Gradient de couches latérales — 4 couches distinctes",
        description:
          "La AM95 a 4 couches superposées de cuir suède/nylon sur le flanc, avec un gradient de couleur (foncé au talon, clair à l'avant). Chaque couche doit être nettement distincte avec un gradient fluide. Les contrefaçons présentent souvent 3 couches ou un gradient trop marqué/cassé.",
        difficulty: 2,
      },
      {
        title: "Double Air : talon + avant-pied",
        description:
          "La AM95 a 2 unités Air visibles : une au talon (grande bulle) et une à l'avant-pied (plus petite). Les contrefaçons omettent parfois l'Air avant-pied ou le remplacent par un insert en plastique. Pressez l'avant-pied : il doit s'enfoncer légèrement comme une bulle pneumatique.",
        difficulty: 2,
      },
      {
        title: "Œillets sur le côté (pas sur le dessus)",
        description:
          "La AM95 a ses œillets positionnés sur les couches latérales (6 œillets de chaque côté), pas sur la languette. Les contrefaçons respectent souvent cette spécificité mais les œillets sont parfois mal alignés ou de tailles différentes. Comptez : 6 de chaque côté = 12 au total.",
        difficulty: 1,
      },
      {
        title: "Mesh respirant multi-densité",
        description:
          "L'upper AM95 alterne mesh fin (zones de ventilation) et mesh serré (zones de support). Les contrefaçons utilisent souvent un mesh uniforme. Examinez de près : vous devez voir des zones de densité différente.",
        difficulty: 3,
      },
      {
        title: "Style Code 95 + dates cohérentes",
        description:
          "Style Code AM95 historique : 609048-XXX, moderne : CT1805-XXX ou variations selon drop. Vérifiez sur StockX. Les OG Neon 1995 réelles ont des Style Codes qui n'existent plus officiellement — toute annonce OG 1995 « DS » exige authentification experte.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "AM95 Neon « OG 1995 » à 500 € sur Grailed",
        description:
          "Les AM95 Neon OG 1995 DS sont quasi-introuvables à moins de 3 000-5 000 €. Une annonce à 500 € « OG 1995 DS » est une contrefaçon. La réédition Neon 2020 retail à 170 € se revend 400-600 € DS — c'est sur cette gamme que les super-fakes arrivent en masse.",
      },
      {
        title: "AM95 « rare Japan exclusive » à bas prix",
        description:
          "Beaucoup de colorways AM95 Japan Exclusive ont été inventés par des contrefacteurs. Vérifiez sur Sneaker News ou Hypebeast si le colorway revendiqué a vraiment existé. Toute référence à un colorway Japan Exclusive introuvable sur sources officielles est une contrefaçon avec narrative.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Air Max 95 est-elle si culte au Japon ?",
        answer:
          "La AM95 Neon est sortie au Japon en septembre 1995 avec une stratégie marketing agressive (exclusivité temporaire). Son prix élevé (20 000 yens, équivalent 200 € à l'époque) et son design radical ont créé un phénomène culturel : des braquages de jeunes ont été documentés à Shibuya en 1995-1996 uniquement pour voler des AM95. Depuis, la AM95 reste la paire la plus symbolique du streetwear japonais 90s, maintenant une demande soutenue (40 % des ventes AM95 européennes viennent toujours du marché collector Japan).",
      },
      {
        question: "Les AM95 sans Neon sont-elles également hyped ?",
        answer:
          "Oui — les coloris Solar Red 1995 (rééditée 2016, 2018, 2022), Fresh Mint 1995 (rééditée 2020), et les collaborations (Corteiz 2023, Stüssy 2006) atteignent des prix marchés de 350-1 500 €. La Corteiz AM95 2023 se revend jusqu'à 2 000-3 500 € en DS. Ces coloris sont aussi contrefaits activement, avec les mêmes signaux d'auth applicables.",
      },
    ],
  },
  {
    slug: "air-max-97",
    name: "Air Max 97",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "170-800 €",
    retailYear: "1997 (rééditée)",
    tagline: "La silhouette full-length Air bubble",
    intro:
      "La Nike Air Max 97, designée par Christian Tresser en 1997, a été la première sneaker Nike avec une unité Air visible sur toute la longueur de la cupsole (full-length Air). Inspirée des trains à grande vitesse japonais (Shinkansen), sa silhouette futuriste tout en courbes a redéfini l'esthétique sneaker de la fin des années 90. Son retail actuel (170-190 €) et son marché secondaire sur les OG et collaborations (Silver Bullet, Gold Bullet, Skepta, Sean Wotherspoon) entre 250 et 2 500 € en font une cible de contrefaçon importante, particulièrement sur le marché UK/France. Les super-fakes AM97 ont atteint en 2024-2025 un niveau de sophistication élevé, notamment sur les Silver Bullet qui représentent 25 % du volume contrefait AM97 en Europe. Vérifier une AM97 exige d'examiner 5 détails techniques propres à ce modèle : la full-length Air, les lignes latérales réfléchissantes, la construction mesh-cuir, les lacets dissimulés et la cupsole profilée.",
    signals: [
      {
        title: "Full-length Air bubble visible",
        description:
          "La AM97 a une unité Air visible sur TOUTE la cupsole (talon + milieu + avant-pied). Les contrefaçons basiques utilisent une bubble partielle (juste au talon). Regardez de profil : vous devez voir la bulle d'air s'étendre du talon à l'avant-pied sans discontinuité.",
        difficulty: 1,
      },
      {
        title: "Lignes latérales : réflectivité et alignement",
        description:
          "La AM97 classique Silver Bullet (et coloris OG) a des lignes réfléchissantes métalliques sur les couches latérales. En éclairage direct, elles brillent fortement (test à faire de nuit au flash). Les contrefaçons utilisent souvent un simili-réflectif terne. Les lignes doivent être parfaitement parallèles.",
        difficulty: 2,
      },
      {
        title: "Lacets dissimulés sous capuchon",
        description:
          "La AM97 a un système de laçage dissimulé avec les lacets passant sous un capuchon textile latéral. Les contrefaçons respectent souvent cette spec mais le capuchon est mal cousu ou trop rigide. Le laçage doit être fluide et esthétiquement intégré.",
        difficulty: 2,
      },
      {
        title: "Upper mesh + overlay : transitions nettes",
        description:
          "L'upper AM97 alterne mesh respirant et overlays cuir/synthétique avec des transitions nettes. Les contrefaçons présentent souvent des jointures floues ou des bords effilochés. Chaque transition mesh-overlay doit être rectiligne.",
        difficulty: 2,
      },
      {
        title: "Cupsole profilée + Style Code",
        description:
          "La cupsole AM97 est profilée aérodynamiquement avec une pointe avant relevée. Style Code historique 921826-XXX, moderne BV6410-XXX ou DH8016-XXX selon drop. Vérifiez sur StockX. La Silver Bullet standard est 884421-001.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Silver Bullet « 1997 OG DS » à 400 €",
        description:
          "Les Silver Bullet OG 1997 DS sont quasi-introuvables à moins de 4 000-8 000 € (si elles existent vraiment en DS). Toute annonce « OG 1997 » à moins de 3 000 € est à 99 % une contrefaçon ou une mauvaise identification. Les rééditions 2017, 2018, 2022 se revendent 250-450 € DS — c'est la cible des super-fakes modernes.",
      },
      {
        title: "Sean Wotherspoon AM97 à 600 € sur Vinted",
        description:
          "La Sean Wotherspoon AM1/97 Hybrid (2018) a un prix marché de 1 400-2 200 €. Une annonce à 600 € est statistiquement une contrefaçon. Vérifiez la construction hybride AM1+97, le velours multicolore, et la box spéciale Sean Wotherspoon.",
      },
    ],
    faqs: [
      {
        question: "Comment tester la réflectivité des AM97 Silver Bullet ?",
        answer:
          "Test simple : photographiez la AM97 avec le flash du téléphone à 1-2 m de distance dans l'obscurité. Les lignes latérales authentiques brillent intensément (aspect métallique éclatant). Les contrefaçons donnent au mieux un reflet terne ou mat. Ce test est rapide et décisif pour les Silver Bullet, Gold Bullet, Medal Pack.",
      },
      {
        question: "La full-length Air peut-elle être réparée si elle crève ?",
        answer:
          "Non, une AM97 avec bulle d'air crevée (flat air) est définitivement inutilisable. Aucun service Nike officiel ne répare les unités Air. Les tentatives de reparation (colle, injection) dégradent la structure. Si vous achetez une AM97 et que la bulle est déjà flat, c'est soit usure naturelle (après 3-5 ans d'usage intense), soit défaut de fabrication précoce (rare sur authentiques, fréquent sur contrefaçons basse qualité).",
      },
    ],
  },
  {
    slug: "air-max-plus-tn",
    name: "Air Max Plus TN",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "180-600 €",
    retailYear: "1998 (rééditée)",
    tagline: "La « requin » culte de la culture banlieue française",
    intro:
      "La Nike Air Max Plus, designée par Sean McDowell en 1998 et surnommée « TN » (Tuned Air) en Europe et « requin » en France, est l'une des sneakers les plus culturellement marquées de l'histoire. En France particulièrement, la TN est devenue dès les années 2000 un symbole du streetwear banlieue, popularisée par le rap français (Booba, NTM, PNL) et adoptée massivement dans les cités. Son design radical — silhouette agressive avec couches « dents de requin », unité Tuned Air à double chambre, upper mesh ondulé — en fait une paire instantanément reconnaissable. Retail actuel 180-210 €, marché secondaire sur les coloris OG (Hyper Blue, Voltage Yellow, Triple Black) entre 220 et 500 €. Les contrefaçons TN sont pandémiques en France : environ 45 % des TN à moins de 100 € vendues sur Vinted sont des contrefaçons en 2025. Les signaux d'auth TN exigent une connaissance spécifique : dents de requin, Tuned Air, Swoosh latéral, étiquette jockey tag « Tuned 1 » et box orange Nike.",
    signals: [
      {
        title: "Dents de requin : 4 couches latérales distinctes",
        description:
          "La TN a 4 « dents de requin » TPU latérales en dégradé (gradient) qui représentent sa signature visuelle. Chaque dent doit être nette avec une pointe aiguë et un dégradé fluide. Les contrefaçons présentent souvent des dents arrondies, un nombre incorrect (3 ou 5), ou un dégradé cassé.",
        difficulty: 1,
      },
      {
        title: "Unité Tuned Air double chambre",
        description:
          "La TN utilise la technologie Tuned Air avec 2 chambres distinctes visibles au talon (contrairement à la Max classique). Les contrefaçons simplifient souvent en une seule chambre ou présentent des chambres mal séparées. Inspectez la cupsole : vous devez voir clairement 2 compartiments d'air distincts.",
        difficulty: 2,
      },
      {
        title: "Swoosh latéral court + Nike Air sur languette",
        description:
          "Le Swoosh TN est notablement plus court qu'un Swoosh AM90/95, positionné à l'arrière du flanc. La languette porte « TUNED » brodé (pas « Nike Air »). Les contrefaçons utilisent souvent le mauvais logo de languette.",
        difficulty: 1,
      },
      {
        title: "Jock tag talon « Tn » minuscule + Tuned Air",
        description:
          "Le jock tag TN porte « Tn » en minuscule (pas « TN ») avec « Tuned Air » en dessous. Cette spécificité typographique est souvent ratée par les contrefaçons qui écrivent « TN » en majuscules. Vérifiez lettre par lettre.",
        difficulty: 2,
      },
      {
        title: "Mesh ondulé + Style Code 604133",
        description:
          "L'upper TN utilise un mesh ondulé caractéristique (pas plat). Le Style Code des TN Hyper Blue OG 1998 est 604133-XXX, moderne 852630-XXX ou DM8331-XXX. Vérifiez que le Style Code existe sur StockX et correspond au colorway.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "TN Triple Black « neuves » à 60 € sur Vinted",
        description:
          "Les TN Triple Black retail à 180-210 € et se revendent 160-220 € DS. Une annonce à 60 € est à 99 % une contrefaçon. Les super-fakes TN circulent massivement en France à 20-40 € import direct Chine — ils reproduisent les dents de requin mais ratent le Tuned Air double chambre.",
      },
      {
        title: "TN « customisées » en colorway inexistant",
        description:
          "Beaucoup de TN sont présentées en coloris inventés (« TN Rainbow », « TN Flame », etc.) qui n'ont jamais existé officiellement. Vérifiez systématiquement sur SneakerNews, Hypebeast ou StockX si le colorway revendiqué a été produit par Nike. Tout colorway non-documenté officiellement est soit une customisation artisanale (légitime si annoncée comme telle), soit une contrefaçon avec invention.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi les TN sont-elles si associées à la culture française banlieue ?",
        answer:
          "Dès leur sortie fin 1998, les TN sont adoptées par la jeunesse urbaine française pour 3 raisons : leur prix élevé à l'époque (800 francs, équivalent 120 €) en faisait un symbole de statut, leur design agressif correspondait à l'esthétique rap/streetwear 2000s, et Nike les a distribuées intensivement en France via les circuits urbains. La popularisation par le rap (NTM, Booba, Ninho, PNL) et leur omniprésence dans les clips ont ancré la TN comme symbole identitaire banlieue, persistant 25 ans après.",
      },
      {
        question: "Comment reconnaître une TN OG 1998 vs une réédition ?",
        answer:
          "Les TN OG 1998 Hyper Blue ont des particularités : Style Code 604133-091 original, étiquette intérieure avec date 1998, cuir TPU dents de requin légèrement différent (plus épais) que les rééditions. Les OG 1998 DS sont quasi-introuvables (moins de 100 paires identifiées mondialement en DS) et valent 2 000-4 000 €. Toute annonce TN « OG 1998 DS » à moins de 1 500 € est suspecte — les rééditions 2018, 2020, 2022 se revendent 220-400 € DS et sont la cible principale des super-fakes.",
      },
    ],
  },
  {
    slug: "blazer-mid-77",
    name: "Blazer Mid '77",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "100-350 €",
    retailYear: "1977 (rééditée)",
    tagline: "La silhouette basketball vintage revenue dans la hype",
    intro:
      "La Nike Blazer Mid '77, sortie originellement en 1972 (et marquée « '77 » en référence à sa production complète cette année-là) comme chaussure de basketball, a connu un revival majeur depuis 2017 grâce à la collaboration Off-White « The Ten » (2017). Virgil Abloh a propulsé la Blazer Mid dans le luxe streetwear, transformant une sneaker vintage abordable (retail 100 €) en paire hyped (Off-White Blazer Mid 2017 se revend aujourd'hui 700-2 500 € selon colorway). Depuis, la Blazer Mid '77 est devenue la 3e sneaker Nike la plus collab-intense avec des drops sacai, Supreme, Pigeon, Peace Minus One (G-Dragon). Son retail actuel (110 €) et son marché secondaire sur les Off-White (500-2 500 €), sacai (800-1 500 €), et Supreme (400-900 €) alimentent une contrefaçon ciblée sur les collaborations haut de gamme. 5 signaux techniques permettent la vérification d'une Blazer Mid authentique, différents de ceux d'une Dunk ou d'une AF1.",
    signals: [
      {
        title: "Swoosh oblique : angle et épaisseur",
        description:
          "Le Swoosh Blazer Mid est positionné obliquement sur le flanc avec un angle spécifique d'environ 15° par rapport à l'horizontale. Les contrefaçons présentent souvent un angle incorrect ou un Swoosh trop épais. La pointe doit toucher l'arrière du talon.",
        difficulty: 2,
      },
      {
        title: "Languette textile + logo Nike",
        description:
          "La languette Blazer Mid est en textile (pas en cuir) avec un logo « NIKE » imprimé ou brodé selon colorway. Les contrefaçons utilisent parfois une languette en cuir (incorrect) ou un logo mal positionné. La languette doit être proportionnée : ni trop haute ni trop basse.",
        difficulty: 1,
      },
      {
        title: "Cupsole vulcanisée : jointure visible",
        description:
          "La Blazer Mid utilise une cupsole vulcanisée (comme une Converse) avec une jointure visible sur la bande blanche latérale. Cette jointure doit être rectiligne sans vagues. Les contrefaçons présentent souvent des vagues ou des surplus de colle jaunâtres.",
        difficulty: 2,
      },
      {
        title: "Overlay heel cuir + « Blazer » texte",
        description:
          "Le talon a un overlay cuir avec souvent « BLAZER » ou un text spécifique selon collab. Le cuir doit être pleine fleur, souple. Les contrefaçons utilisent du simili plus rigide. Pour les Off-White, l'overlay porte « SHOELACES » en guillemets avec la police Helvetica.",
        difficulty: 2,
      },
      {
        title: "Style Code + packaging collab",
        description:
          "Blazer Mid standard : Style Code CZ1055-XXX. Off-White Blazer Mid (2017) : AA3832-XXX selon colorway. sacai Blazer : BV0072-XXX. Vérifiez cohérence Style Code et packaging spécifique (hang tag Off-White, box sacai brune, etc.).",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Off-White Blazer Mid « The Ten » à 300 €",
        description:
          "Les Off-White Blazer Mid « The Ten » (2017) ont un prix marché de 800-2 500 € selon colorway (All Hallows Eve, Serena, etc.). Une annonce à 300 € est statistiquement à 99 % une contrefaçon. Les super-fakes reproduisent les guillemets « SHOELACES » mais ratent la cupsole vulcanisée exacte.",
      },
      {
        title: "sacai Blazer Low à 200 € sur Grailed",
        description:
          "Les sacai Blazer Low Hybrid (2019-2021) se revendent 700-1 400 €. Une annonce à 200 € est une contrefaçon. Les super-fakes sacai reproduisent le double Swoosh et le hybrid upper mais ratent toujours l'alignement exact des deux languettes.",
      },
    ],
    faqs: [
      {
        question: "Blazer Mid vs Blazer Low : signaux d'auth différents ?",
        answer:
          "Les signaux sont largement identiques (Swoosh oblique, cupsole vulcanisée, cuir pleine fleur, Style Code). La différence principale : la Blazer Low a une tige basse (sous la malléole) donc pas d'overlay talon haut. Les proportions Swoosh sont légèrement différentes (Swoosh Blazer Low est plus court et plus bas). Les contrefaçons ciblent plus la Blazer Mid (plus hyped collab) que la Low.",
      },
      {
        question: "Pourquoi les Off-White Blazer sont-elles si hyped ?",
        answer:
          "La Off-White Blazer Mid « The Ten » (2017) est la collaboration sneaker la plus emblématique du 21e siècle selon les experts. Virgil Abloh a entièrement déconstruit la Blazer Nike en exposant les coutures, rajoutant des textes en Helvetica (« AIR », « SHOELACES »), un zip tie rouge signature, et une palette de 10 coloris conceptuels. Cette sortie a inventé le genre « sneaker deconstructed » qui a dominé 2017-2022. Depuis le décès de Virgil fin 2021, les Off-White Blazer ont pris une valeur posthume patrimoniale — les prix continuent de monter lentement.",
      },
    ],
  },
  {
    slug: "vapormax",
    name: "Vapormax",
    brandSlug: "nike",
    category: "sneakers",
    priceRange: "190-450 €",
    retailYear: "2017",
    tagline: "La semelle Air en plots visible — révolution technique",
    intro:
      "La Nike Vapormax, sortie en 2017 pour célébrer les 30 ans de la technologie Air, a introduit une rupture radicale : une semelle composée entièrement de plots d'air séparés, sans mousse intermédiaire. Cette construction « visible Air pods » représente l'aboutissement 30 ans après la AM1 de la philosophie « voir la technologie ». Son retail à 190-220 € et ses collaborations (Off-White Vapormax 2018, Comme des Garçons, Cactus Plant Flea Market) avec des prix marchés entre 400 et 2 500 € en font une cible de contrefaçon technique complexe. Les super-fakes Vapormax ratent systématiquement la construction exacte des plots d'air — soit trop rigides, soit mal espacés, soit avec une compression incorrecte. La vérification d'une Vapormax exige d'examiner 5 signaux propres à ce modèle : les plots Air, le Flyknit upper, la Swoosh-bande, la languette minimaliste et le Style Code.",
    signals: [
      {
        title: "Plots Air : nombre et alignement",
        description:
          "La semelle Vapormax Flyknit a typiquement 18-22 plots d'air distincts selon le modèle exact. Chaque plot doit être gonflé uniformément et parfaitement aligné. Les contrefaçons présentent souvent un nombre incorrect de plots ou des plots avec gonflement irrégulier. Comptez et comparez avec la photo officielle Nike.com du modèle.",
        difficulty: 2,
      },
      {
        title: "Flyknit upper : maillage 3D régulier",
        description:
          "L'upper Vapormax Flyknit est un tricot 3D avec des zones de densité variable. Les zones supportives (talon, avant-pied) sont plus denses, les zones flex (médio-pied) plus lâches. Les contrefaçons utilisent souvent un Flyknit uniforme ou un nylon standard qui imite le tricot mais sans les variations de densité.",
        difficulty: 3,
      },
      {
        title: "Swoosh-bande latérale intégrée",
        description:
          "Le Swoosh Vapormax est intégré dans une bande TPU latérale (pas cousu comme AF1). Cette bande enveloppe le pied avec une structure continue de l'avant au talon. Les contrefaçons présentent souvent une bande interrompue ou mal fixée au Flyknit.",
        difficulty: 2,
      },
      {
        title: "Languette minimaliste sans rembourrage",
        description:
          "La Vapormax a une languette mince, non-rembourrée, intégrée au Flyknit. Les contrefaçons ajoutent parfois un rembourrage (incorrect pour ce modèle) ou utilisent une languette en tissu séparé (incorrect). La languette doit être continue avec l'upper.",
        difficulty: 1,
      },
      {
        title: "Style Code + box spéciale",
        description:
          "Style Code Vapormax Flyknit : 849558-XXX ou AJ6900-XXX selon génération. Vérifiez cohérence. Off-White Vapormax 2018 : AA3831-XXX. La box Vapormax est souvent spéciale avec finition minimaliste (noir/blanc) différente de la box orange Nike classique.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Off-White Vapormax « Black » à 400 € sur Vinted",
        description:
          "La Off-White Vapormax Black (2018) a un prix marché de 1 000-1 800 € en DS. Une annonce à 400 € est à 98 % une contrefaçon. Les super-fakes reproduisent le zip tie rouge et les plots d'air mais ratent l'alignement exact du Swoosh-bande latérale.",
      },
      {
        title: "Vapormax « Triple Black » neuves à 80 € sur Vinted",
        description:
          "Les Vapormax Triple Black retail à 190-210 € et se revendent 130-180 € DS. Une annonce à 80 € est à 95 % une contrefaçon. Les super-fakes Triple Black présentent typiquement des plots d'air mous ou mal gonflés.",
      },
    ],
    faqs: [
      {
        question: "Les plots d'air Vapormax peuvent-ils se déconnecter avec l'usage ?",
        answer:
          "Oui, c'est un défaut de fabrication connu sur les premières générations Vapormax (2017-2018) : un ou plusieurs plots peuvent se détacher de la bande supérieure après 300-500 km d'usage, créant un « wobble ». Nike a amélioré la construction depuis 2019. Sur les contrefaçons, cette déconnexion arrive beaucoup plus tôt (parfois après quelques heures) car les plots sont mal collés. Un Vapormax avec plots déjà déconnectés en DS est presque certainement une contrefaçon.",
      },
      {
        question: "Vapormax Flyknit vs Vapormax Plus vs Vapormax 2020 : différences ?",
        answer:
          "Vapormax Flyknit (2017-2019) : upper Flyknit 3D, ~18-22 plots. Vapormax Plus (2018+) : hybride avec dents de requin TN intégrées, ~16 plots plus gros. Vapormax 2020 : refonte avec plus de matériaux recyclés, plots redessinés. Chaque version a son Style Code distinct et ses signaux d'auth spécifiques. Les contrefaçons confondent parfois les versions, utilisant des plots 2017 avec un upper 2020 par exemple — ce décalage est un red flag.",
      },
    ],
  },
];
