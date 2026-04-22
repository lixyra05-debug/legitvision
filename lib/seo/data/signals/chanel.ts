import type { GuideSignal } from "../../guide-types";

export const chanelSignals: GuideSignal[] = [
  {
    slug: "hologramme-sticker",
    name: "Sticker hologramme",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Analyser le sticker hologramme Chanel : position, changement d'angle, numéro",
    intro:
      "Le sticker hologramme Chanel est collé à l'intérieur de chaque sac depuis 1986, en complément de la carte d'authenticité et du numéro de série embossé. C'est un petit sticker argenté mesurant environ 20×12 mm, collé dans une position précise selon modèle : Classic Flap = intérieur du rabat sous la patte de serrure ; Boy = à l'intérieur du compartiment central sur la doublure ; WOC = intérieur du compartiment principal. Le sticker authentique a quatre caractéristiques techniques : 1) un numéro à 7-8 chiffres qui doit correspondre EXACTEMENT au numéro embossé sur la carte d'authenticité ; 2) un hologramme 3D qui change de motif selon l'angle de vue (le logo Chanel CC apparaît sous certains angles, disparaît sous d'autres) ; 3) une police spécifique pour le numéro, Helvetica Neue Bold, taille 8pt, kerning ultra-régulier ; 4) un fond argenté avec reflets arc-en-ciel légers sous lumière directe. Les contrefaçons trahissent plusieurs erreurs typiques : numéro qui ne correspond pas à la carte, hologramme statique sans changement d'angle (impression simple sur film métallisé au lieu du véritable hologramme), police trop grasse ou mal kernée, ou encore un sticker décollable facilement (LV utilise une colle industrielle qui fusionne au cuir). Le test d'angle de vue (incliner le sticker de 0° à 90°) est le plus révélateur : hologramme authentique = animation fluide du logo CC, fake = motif figé. Ce test prend dix secondes et tranche les fakes moyen de gamme.",
    steps: [
      {
        title: "Localiser le sticker selon modèle",
        description:
          "Classic Flap : sous la patte de serrure à l'intérieur du rabat. Boy Bag : doublure du compartiment central. WOC : intérieur du rabat. Sticker mesurant ~20×12 mm, argenté.",
      },
      {
        title: "Tester l'hologramme 3D",
        description:
          "Tenez le sticker à 30 cm des yeux. Inclinez lentement de 0° à 90° en passant par l'horizontale. Le logo CC (deux C entrelacés) doit apparaître et disparaître, avec une animation fluide. Un motif figé = fake.",
      },
      {
        title: "Lire le numéro de série (7-8 chiffres)",
        description:
          "Notez le numéro imprimé sur le sticker. Format : 7 chiffres (avant 2005) ou 8 chiffres (depuis 2005). Police Helvetica Neue Bold, kerning régulier. Un numéro flou, mal aligné, avec des chiffres de tailles différentes = fake.",
      },
      {
        title: "Cross-check avec carte d'authenticité",
        description:
          "La carte d'authenticité (petit carton blanc 50×85 mm) livrée avec le sac porte le MÊME numéro. Vérifiez correspondance exacte. Un différentiel d'un seul chiffre = sac fake ou carte remplacée.",
      },
      {
        title: "Décoder le millésime (premier chiffre)",
        description:
          "Chaque chiffre initial correspond à une période : 1=1986-1988, 4=1996-1997, 8=2003-2004, 14=2010-2011, 24=2017-2018, 30=2022+. Vérifiez cohérence millésime ↔ design (un Boy Bag marqué « 4 » serait suspect, le Boy ayant été lancé en 2011).",
      },
    ],
    commonErrors: [
      {
        title: "Croire que tous les Chanel ont un sticker hologramme",
        description:
          "Certains modèles vintage pré-1986 n'ont pas de sticker (authentification par autres moyens). Les nouveaux modèles post-2021 avec puce NFC ont parfois le sticker + la puce. Vérifiez le millésime avant d'exiger un sticker.",
      },
      {
        title: "Tester l'hologramme en lumière faible",
        description:
          "L'hologramme nécessite une lumière vive pour révéler le changement de motif. Testez en pleine lumière (fenêtre, LED forte). En lumière tamisée, le mouvement est invisible et peut faire conclure à tort à un sticker fake.",
      },
      {
        title: "Accepter un sticker décollé/remplacé",
        description:
          "Un sticker qui se décolle facilement, ou qui a été manifestement recollé (résidus de colle, bords abîmés) est suspect. Chanel colle ses stickers définitivement — un retrait endommage le sticker. Un sticker propre mais décollable = probablement remplacé.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires produisent des stickers avec hologrammes 3D réels (technologie accessible depuis 2018) mais avec une profondeur d'animation réduite : le logo CC bouge mais avec une seule couche au lieu de 3 couches Chanel authentique. Test avancé : sous lampe UV (365 nm), le sticker authentique Chanel fluoresce légèrement vert-jaune pâle sur les bords. Un sticker fake reste totalement noir ou fluoresce d'une couleur différente (bleue, violette). Cette fluorescence est due à un marqueur chimique ajouté par Chanel dans la colle. Pour les fakes haut de gamme 2024, même cette fluorescence est imitée — mais avec une teinte légèrement différente. En dernier recours, comparer deux stickers (un authentique confirmé + le douteux) sous même lampe UV révèle les écarts.",
    faqs: [
      {
        question: "Mon sticker hologramme est décollé dans mon sac Chanel, fake ?",
        answer:
          "Pas nécessairement. Sur des sacs très anciens (10+ ans), la colle peut se dégrader et le sticker se détacher partiellement. Si le sticker est présent (collé ou détaché) et que le numéro correspond à la carte d'authenticité, le sac peut rester authentique. En revanche, un sticker absent totalement (jamais collé ou perdu) sur un sac post-1986 est problématique — l'authentification devient dépendante des autres indicateurs (cuir, coutures, hardware).",
      },
      {
        question: "Les Chanel neuves (post-2021) ont-elles encore un sticker ?",
        answer:
          "Oui, en complément d'une puce NFC invisible. Chanel a conservé le sticker hologramme pour continuité avec les sacs vintage et familiarité client. La puce NFC (scannable avec smartphone) ajoute une couche cryptographique. Un Chanel post-2021 qui n'a QUE le sticker (sans puce NFC détectable) est suspect — demandez une vérification en boutique Chanel.",
      },
    ],
  },
  {
    slug: "numero-serie",
    name: "Numéro de série",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Vérifier le numéro de série Chanel et sa cohérence millésime",
    intro:
      "Chaque sac Chanel produit depuis 1986 porte un numéro de série unique à 7 chiffres (1986-2004) ou 8 chiffres (à partir de 2005, pour absorber le volume de production croissant). Ce numéro apparaît à trois endroits : embossé discrètement sur un morceau de cuir intérieur (souvent sous une couture), imprimé sur le sticker hologramme, et imprimé sur la carte d'authenticité blanche livrée avec le sac. Ces trois numéros doivent être ABSOLUMENT identiques — tout différentiel signe une contrefaçon ou un sac reconstitué. La séquence des premiers chiffres permet de déterminer l'année de production : série 1xxxxxx = 1986-1988, 5xxxxxx = 1997-1999, 9xxxxxx = 2004-2005, 13xxxxxx = 2008-2009, 17xxxxxx = 2012-2013, 21xxxxxx = 2015-2016, 25xxxxxx = 2018-2019, 29xxxxxx = 2021-2022, 32xxxxxx = 2024+. Ces correspondances sont documentées par la communauté d'authentification et fiables à ±6 mois. Les contrefacteurs commettent trois erreurs : 1) numéro inventé qui ne rentre dans aucune plage historique, 2) incohérence millésime ↔ modèle (un sac Boy marqué « 9xxxxxx » = année 2004, alors que le Boy a été lancé en 2011), 3) décalage numérique entre le cuir embossé et le sticker. Vérifier ces cohérences prend cinq minutes avec un accès à la grille de millésimes — et tranche 60 % des cas douteux.",
    steps: [
      {
        title: "Localiser le numéro embossé sur cuir",
        description:
          "Le numéro est embossé discrètement sur une patte de cuir intérieure, souvent cachée sous une couture ou à l'intérieur d'un rabat. Emplacement variable selon modèle — consultez des guides modèle-spécifiques pour localiser rapidement.",
      },
      {
        title: "Noter précisément les 7 ou 8 chiffres",
        description:
          "Utilisez une loupe x5 et lumière rasante. Attention à la confusion 0/O (aucune lettre dans un numéro Chanel, exclusivement chiffres). Notez sans erreur : un chiffre mal lu fausse toute la vérification.",
      },
      {
        title: "Cross-check avec sticker hologramme et carte",
        description:
          "Comparez le numéro du cuir avec celui du sticker et celui de la carte d'authenticité. Les 3 doivent être STRICTEMENT identiques, chiffre par chiffre. Un différentiel = fake ou reconstitution frauduleuse.",
      },
      {
        title: "Déterminer le millésime via les premiers chiffres",
        description:
          "Consultez une grille de millésimes (référence : Yoogi's Closet, Fashionphile). Pour un numéro « 25123456 » : plage 25xxxxxx = 2018-2019. Vérifiez ensuite que le modèle était en production à cette date.",
      },
      {
        title: "Contrôler la profondeur d'embossage",
        description:
          "L'embossage authentique a 0,4-0,6 mm de profondeur, net, régulier. Un embossage superficiel (< 0,2 mm), floutté ou avec des bavures autour des chiffres révèle un outillage fake.",
      },
    ],
    commonErrors: [
      {
        title: "Ignorer l'évolution du format 7 → 8 chiffres",
        description:
          "Avant 2005 : 7 chiffres. Depuis 2005 : 8 chiffres. Un sac supposé « 1990 » avec 8 chiffres est fake (format non existant à l'époque). Inversement, un sac « 2015 » avec 7 chiffres est fake.",
      },
      {
        title: "Accepter un numéro incohérent avec modèle",
        description:
          "Le Boy Bag (lancé 2011) ne peut avoir un numéro pré-2011. Le Flap Bag Classique existe depuis 1955 — tout millésime post-1986 est possible. Croisez systématiquement numéro ↔ date de lancement du modèle.",
      },
      {
        title: "Valider sur le seul numéro, sans cross-check",
        description:
          "Un numéro authentique sur un cuir embossé peut être apposé sur un sac fake (numéro recopié). La preuve d'authenticité exige cohérence numéro + qualité cuir + coutures + hardware + sticker + carte. Un seul élément ne suffit jamais.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires consultent des bases Chanel leakées (disponibles sur forums clandestins) avec des milliers de numéros authentiques et leurs millésimes. Ils choisissent un numéro cohérent avec le modèle à contrefaire et l'embossent correctement. Le défaut signature : les embossages fakes sont réalisés à la presse froide alors que Chanel utilise un embossage chaud (150-180°C) qui laisse une légère empreinte brune autour des chiffres (caramélisation du cuir). À la loupe x10, les chiffres Chanel authentiques ont un halo brun-doré de 0,2-0,3 mm, les fakes n'ont pas ce halo. Autre tactique : certains fakes haut de gamme produisent des cartes d'authenticité parfaites avec numéro assorti — mais le papier utilisé est un cardstock standard 300 gsm alors que Chanel utilise un cardstock spécial 350 gsm avec texture légèrement grainée.",
    faqs: [
      {
        question: "Mon sac Chanel a deux numéros différents (cuir vs sticker), est-il forcément fake ?",
        answer:
          "Dans 95 % des cas, oui. Chanel produit ses sacs avec un seul numéro de série imprimé simultanément sur les 3 supports (cuir, sticker, carte). Un différentiel révèle soit un sac fake avec numéros pris de sources différentes, soit un sac authentique reconstitué (cuir d'un sac + sticker d'un autre). Dans les deux cas, la valeur revente est compromise et l'authentification globale invalidée.",
      },
      {
        question: "La carte d'authenticité perdue invalide-t-elle l'authentification ?",
        answer:
          "Elle rend l'authentification plus difficile mais ne tranche pas. Si le numéro embossé sur cuir et sur sticker correspond, le sac peut rester authentique malgré la carte manquante. Chanel ne remplace PAS les cartes perdues (politique officielle). La valeur revente diminue de 10-20 % sans carte, mais le sac reste commercialisable. En revanche, une carte RETROUVÉE avec un numéro différent du cuir est très suspecte — carte récupérée d'un autre sac.",
      },
    ],
  },
  {
    slug: "matelasse-losanges",
    name: "Matelassage en losanges",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Compter et mesurer les losanges du matelassage Chanel classique",
    intro:
      "Le matelassage diamond quilting — ces losanges réguliers embossés sur le cuir — est la signature visuelle la plus immédiate du Chanel Classic Flap et de ses dérivés (Mini, Jumbo, Maxi, Boy). Chanel applique une règle de production stricte : nombre de losanges constant par modèle et par taille, dimensions millimétriques standardisées, couture parfaitement centrée sur chaque diagonale. Sur un Classic Flap Medium (25 cm de large), la face avant compte 9 losanges horizontalement × 6 losanges verticalement = 54 losanges visibles, chacun mesurant environ 25×20 mm. Sur un Jumbo (30 cm) : 10×7 = 70 losanges. Sur un Mini (20 cm) : 7×5 = 35 losanges. Ces comptages sont vérifiables en deux minutes avec un mètre souple et permettent un tri rapide : un Classic Flap Medium avec 8×6 losanges ou 10×7 est une contrefaçon structurelle (le faussaire n'a pas respecté le dessin de référence). Au-delà du comptage, la couture en X aux intersections des losanges doit être parfaitement centrée (tolérance ±1 mm) et chaque losange doit être symétrique dans ses quatre côtés. Les fakes présentent quasi systématiquement des losanges légèrement trapézoïdaux (côtés opposés de longueurs différentes) ou des coutures en X décalées. Le rembourrage interne des losanges — ouate synthétique dense chez Chanel, fil de polyester chez les fakes — influence aussi la « puffyness » : losange authentique ferme et bombé, losange fake mou et plat.",
    steps: [
      {
        title: "Compter les losanges en hauteur et largeur",
        description:
          "Sur la face avant du sac, comptez : nombre de losanges sur une ligne horizontale × nombre de losanges sur une ligne verticale. Comparez avec la grille de référence Chanel (Classic Flap Medium = 9×6, Jumbo = 10×7, Mini = 7×5).",
      },
      {
        title: "Mesurer les dimensions d'un losange",
        description:
          "Avec un réglet : largeur ≈ 25 mm, hauteur ≈ 20 mm sur Classic Flap Medium. Variations selon modèle : consultez la page produit chanel.com. Un losange hors dimensions ±3 mm est suspect.",
      },
      {
        title: "Vérifier la symétrie des côtés",
        description:
          "Chaque losange doit avoir ses 4 côtés de même longueur. Mesurez à la règle 2-3 losanges aléatoires. Un losange trapézoïdal (côtés opposés de 22 mm et 28 mm) trahit un matelassage mal guidé = fake.",
      },
      {
        title: "Examiner les coutures en X aux intersections",
        description:
          "Aux intersections des losanges, la couture forme un X parfait, centré, symétrique. Une couture décalée de 2 mm+, ou un X mal formé (une branche plus longue), révèle un matelassage industriel fake.",
      },
      {
        title: "Tester la puffyness (rembourrage)",
        description:
          "Pressez doucement un losange avec le pouce : il doit offrir une résistance ferme et revenir à sa forme bombée. Un losange qui s'enfonce facilement et reste plat révèle un rembourrage insuffisant (fake en coton léger au lieu de ouate synthétique dense Chanel).",
      },
    ],
    commonErrors: [
      {
        title: "Comparer losanges entre modèles",
        description:
          "Le Classic Flap a 9×6 losanges, le Boy Bag a une grille différente (losanges légèrement plus petits, 8×5 en medium). Comparer un Boy avec les standards Classic Flap est une erreur — chaque modèle a sa grille.",
      },
      {
        title: "Accepter un matelassage mou comme « vintage »",
        description:
          "Un matelassage mou sur un sac vintage 10+ ans est normal (tassement du rembourrage). Sur un sac neuf ou < 3 ans, c'est suspect. Ne confondez pas patine naturelle et défaut de fabrication.",
      },
      {
        title: "Valider le comptage sans mesurer",
        description:
          "Un fake peut avoir le bon nombre de losanges (9×6) mais avec des dimensions décalées (losanges de 22×18 mm au lieu de 25×20 mm) pour s'adapter à une taille de sac légèrement différente. Mesurer confirme la cohérence proportionnelle.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme (Mirror 1:1 HK) respectent le comptage et les dimensions mais butent sur la tension du matelassage : Chanel utilise une machine à matelasser brevetée (Brevet 1987) qui applique une tension constante sur le fil, créant des losanges parfaitement tendus. Les machines industrielles chinoises produisent un matelassage avec des variations de tension : certains losanges plus tendus, d'autres plus relâchés. À l'œil nu, les losanges fakes semblent légèrement irréguliers (certains plus « écrasés », d'autres plus « bombés »). Ce défaut est invisible en photo commerciale (éclairé avantageusement) mais visible en inspection directe. La règle : balayer le sac à 30 cm de distance — une surface authentique a une texture homogène, une surface fake présente des irrégularités.",
    faqs: [
      {
        question: "Le matelassage peut-il se détendre avec le temps ?",
        answer:
          "Très peu. Le matelassage Chanel est réalisé sur cuir structuré (lambskin ou caviar) avec des coutures haute tension qui maintiennent la forme 15-20 ans sans détente notable. Un matelassage visiblement aplati sur un sac de 5 ans est anormal — soit le cuir est de mauvaise qualité (fake), soit le rembourrage s'est tassé (fake avec rembourrage insuffisant). Comparer avec un Chanel vintage même âge en boutique revente confirme la référence de tenue.",
      },
      {
        question: "Chanel produit-il des Classic Flap en matelassage chevron ?",
        answer:
          "Oui, en édition spéciale. Le matelassage chevron (motif en V répété) remplace le diamond quilting sur certaines collections saisonnières. C'est documenté sur chanel.com et stockx. Un Classic Flap chevron n'est pas fake — mais ses dimensions de chevrons doivent respecter le standard collection (5-7 chevrons par rangée horizontale selon taille). Un chevron sur un modèle classique (non-collection spéciale) serait effectivement suspect.",
      },
    ],
  },
  {
    slug: "chaine-poids",
    name: "Chaîne et poids du sac",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Vérifier la chaîne entrelacée cuir + métal et le poids total",
    intro:
      "La chaîne Chanel — signature Classic Flap avec cuir entrelacé dans les maillons métalliques — est un élément d'authentification à la fois visuel et physique. Chanel utilise une chaîne en laiton massif plaqué or 24 carats (hardware doré) ou palladium (hardware argenté), composée de maillons oblongs de 8-10 mm de long, reliés entre eux par anneaux ronds de 6-7 mm. Un lambskin noir ou assorti à la couleur du sac s'entrelace dans la chaîne sur toute sa longueur. Les signaux physiques : 1) poids de la chaîne seule ≈ 180-220 g sur Classic Flap Medium (chaîne totale) ; 2) chaque maillon est fermé par soudure invisible, sans jointure ouverte ; 3) le laiton plaqué or résiste au test magnétique (rivets non attirés par aimant) ; 4) le lambskin entrelacé est souple mais tendu, sans plis ni zones qui flottent. Le poids TOTAL d'un Classic Flap Medium authentique (sac vide + chaîne) est de 830-870 grammes selon millésime. Cette mesure est un premier tri efficace : un sac sous 700 g ou au-dessus de 1 kg révèle quasi systématiquement une contrefaçon (matières de poids incorrect). Les fakes utilisent une chaîne en acier creux léger (gain de poids de 40-60 %) plaquée or brillant chrome, ou une chaîne en laiton mais avec maillons mal soudés qui s'ouvrent sous traction. Test rapide : soulever le sac à une main — un authentique donne une sensation de densité « rassurante », un fake semble « creux ».",
    steps: [
      {
        title: "Peser le sac vide (sans contenu)",
        description:
          "Sur balance de précision (±5 g). Classic Flap Medium authentique = 830-870 g. Jumbo = 1020-1080 g. Mini = 570-620 g. Boy Medium = 950-990 g. Une plage ±30 g est tolérée. Hors plage = signal.",
      },
      {
        title: "Examiner les maillons de la chaîne",
        description:
          "Chaque maillon doit être fermé par soudure invisible, aucune jointure ouverte. Tirez doucement sur la chaîne : aucun jeu, aucune déformation. Un maillon qui s'ouvre sous traction = fake.",
      },
      {
        title: "Test magnétique sur la chaîne",
        description:
          "Approchez un aimant néodyme : la chaîne Chanel authentique (laiton) N'EST PAS magnétique. Si la chaîne est attirée par l'aimant, c'est de l'acier plaqué = fake.",
      },
      {
        title: "Vérifier le cuir entrelacé",
        description:
          "Le lambskin entrelacé dans la chaîne doit être souple, tendu, assorti à la couleur du sac (noir le plus souvent, mais peut être rouge/beige selon colorway). Un cuir flottant, trop épais pour la chaîne, ou de couleur discordante = fake.",
      },
      {
        title: "Mesurer la longueur totale de la chaîne",
        description:
          "Chaîne Classic Flap Medium : 110 cm de long. Jumbo : 120 cm. Mini : 100 cm (simple épaule). Variations ±2 cm tolérées. Une chaîne significativement plus courte ou plus longue = modèle non standard ou fake.",
      },
    ],
    commonErrors: [
      {
        title: "Peser avec contenu",
        description:
          "Le poids de référence est SAC VIDE. Pesez sans contenu intérieur (retirez carte d'authenticité, sachet, tissu protection). Une pesée avec contenu fausse la comparaison.",
      },
      {
        title: "Tester l'aimant sur le cuir entrelacé",
        description:
          "Le test magnétique doit porter sur le MÉTAL uniquement (maillons chaîne, sans contact avec le cuir). Tester sur une zone cuir-métal mixte peut donner une réponse ambiguë. Isolez le métal.",
      },
      {
        title: "Accepter un cuir entrelacé abîmé",
        description:
          "Le lambskin entrelacé s'use plus rapidement que le cuir du sac (friction sur chaîne). Un cuir légèrement patiné est normal après usage. En revanche, un cuir complètement craquelé ou déchiré sur sac < 3 ans révèle un lambskin fake bas de gamme.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme 2023-2024 utilisent des chaînes en laiton réel (non magnétique, respectant le poids) — résolvant les critères simples. Le défaut résiduel : la géométrie des maillons. Chanel utilise un outillage de précision qui donne des maillons strictement identiques, avec un angle d'ovale de 35° par rapport à l'axe de traction. Les maillons fakes sont produits par stamping moins précis, avec une variation d'angle de 30° à 45° visible à l'œil comparatif : en tirant la chaîne bien tendue, les maillons authentiques s'alignent parfaitement tandis que les fakes présentent des « crans » (maillons non alignés). Autre tactique : la chaîne fake en laiton peut être trop épaisse (8 mm de diamètre au lieu des 6 mm Chanel) pour compenser la moindre qualité du métal. Mesurer précisément avec un pied à coulisse l'épaisseur d'un maillon tranche.",
    faqs: [
      {
        question: "Le poids peut-il varier selon le millésime du Chanel ?",
        answer:
          "Légèrement. Les Chanel 1986-2000 (première génération) sont parfois 30-50 g plus lourds (laiton plus épais, hardware plus massif). Les Chanel 2015+ sont dans les plages modernes citées. Cette variation historique est documentée sur les forums d'authentification. Un Chanel « vintage 1990 » dans la plage moderne (830-870 g) est cohérent avec la moyenne actuelle mais légèrement léger pour un vintage — vérifiez autres indicateurs (cuir patine, coutures).",
      },
      {
        question: "Une chaîne qui se ternit avec le temps est-elle fake ?",
        answer:
          "Non. Le laiton plaqué or s'oxyde naturellement avec la transpiration, l'air humide, les frictions. Après 5-10 ans, la chaîne peut perdre un peu de brillant et virer vers une teinte or plus chaude, plus « vieil or ». Cette patine est un signe d'authenticité (laiton réel). Une chaîne qui reste miroir brillant après 10 ans est suspecte (chrome imperméable à l'oxydation = fake). Un noircissement en plaques irrégulières est en revanche un signe de plaquage fake de mauvaise qualité.",
      },
    ],
  },
  {
    slug: "puce-nfc",
    name: "Puce NFC Chanel",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Détecter la puce NFC Chanel (post-2021) et ses spécifications",
    intro:
      "Chanel a intégré progressivement depuis 2021 une puce NFC (Near Field Communication) dans ses sacs de la collection haut de gamme (Classic Flap, Boy, 19, WOC) en complément du sticker hologramme et du numéro de série. Cette puce, de taille millimétrique, est cousue dans la doublure interne ou intégrée dans la patte de cuir portant le numéro embossé. Elle est invisible à l'œil nu mais détectable via smartphone NFC (app « NFC Tools »). Contrairement à Louis Vuitton qui a abandonné le date code physique, Chanel maintient les deux systèmes (numéro de série + puce NFC) pour une double vérification. La puce Chanel utilise un chip custom produit par STMicroelectronics (probablement ST25TV series) avec un ID unique lié au numéro de série du sac dans les bases internes Chanel. Pour le consommateur, la présence physique d'une puce détectable par un smartphone standard est déjà un indicateur fort. À terme, un service d'authentification via l'app Chanel permettra une vérification cryptographique complète (roadmap Chanel 2024-2025). Tous les sacs Chanel produits après 2021 doivent comporter une puce détectable — l'absence sur un sac neuf est une preuve de contrefaçon. Les sacs pré-2021 n'ont pas de puce (leur authentification repose sur sticker + numéro), ce qui est normal.",
    steps: [
      {
        title: "Vérifier la date de production via numéro de série",
        description:
          "Décodez le numéro de série pour déterminer le millésime. Numéro 29xxxxxx = 2021-2022 : puce attendue. Numéro 25xxxxxx = 2018-2019 : pas de puce attendue.",
      },
      {
        title: "Installer app NFC Tools sur smartphone",
        description:
          "iOS : App Store, « NFC Tools ». Android : Google Play, « NFC Tools » ou « TagInfo ». Activez le NFC dans paramètres téléphone.",
      },
      {
        title: "Scanner les zones stratégiques du sac",
        description:
          "Zones typiques : doublure intérieure près du numéro embossé, patte de cuir intérieure haute, poche zippée (doublure fond). Smartphone à 1-2 cm, balayage lent.",
      },
      {
        title: "Lire la réponse NFC",
        description:
          "La puce répond en 1-3 secondes avec un ID hexadécimal. L'app affiche le format (NFC Forum Type 4 ou 5 pour Chanel ST25TV). Notez l'ID.",
      },
      {
        title: "Vérifier la correspondance ID ↔ numéro de série",
        description:
          "Via l'app Chanel (service en déploiement 2024-2025) : scan du sac + vérification cryptographique. En attendant, la simple présence d'une puce répondant est un indicateur positif.",
      },
    ],
    commonErrors: [
      {
        title: "Chercher une puce sur sac pré-2021",
        description:
          "Les Chanel produits avant 2021 n'ont pas de puce NFC. L'absence est normale et ne prouve rien. Croisez avec numéro de série + sticker hologramme + carte d'authenticité pour les pré-2021.",
      },
      {
        title: "Confondre puce NFC et sticker hologramme",
        description:
          "Sticker hologramme = visible, collé, depuis 1986. Puce NFC = invisible, cousue dans doublure, depuis 2021. Les deux existent simultanément sur les sacs post-2021. Les deux doivent être présents sur un post-2021.",
      },
      {
        title: "Valider avec n'importe quelle réponse NFC",
        description:
          "Une puce NFC générique achetée 0,50 € sur Alibaba répond au scan avec un ID arbitraire. La simple réponse ne prouve pas l'authenticité — seul le cross-check cryptographique via l'app Chanel (à venir) le fera. En attendant, combinez avec autres indicateurs.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires intègrent depuis 2023 des puces NFC génériques (NTAG213 NXP) dans leurs fakes post-2021 Chanel. Ces puces répondent au scan mais renvoient un ID arbitraire sans correspondance dans les bases Chanel. Le défaut technique : les puces Chanel authentiques utilisent un chip ST25TV avec support cryptographique AES-128, alors que les NTAG213 fakes utilisent uniquement un lecture basique sans chiffrement. Un dump NFC complet avec TagInfo Advanced révèle cette différence de structure — absence du NDEF chiffré Chanel sur fake. Autre tactique : intégrer une puce réelle ST25TV (achetable par unité, 3 € l'unité) mais sans programmation Chanel — résultat : la puce répond avec format correct mais ID non enregistré. Le service d'app Chanel de vérification démasquera ces fakes à sa sortie.",
    faqs: [
      {
        question: "Mon Chanel post-2021 ne répond à aucun scan NFC, est-il fake ?",
        answer:
          "C'est un signal fort mais pas définitif. Vérifiez d'abord : 1) le NFC du smartphone est activé ; 2) vous scannez lentement toutes les zones ; 3) le smartphone est à 1-2 cm (pas 5 cm) du sac. Si malgré ces précautions aucune réponse sur aucun smartphone testé, c'est quasi certainement une contrefaçon. Allez dans une boutique Chanel pour double-check — ils disposent d'outils internes de vérification. Ne concluez pas « fake » uniquement sur un seul test smartphone.",
      },
      {
        question: "Chanel va-t-il officialiser une app d'authentification publique ?",
        answer:
          "Oui, probablement en 2025. Chanel a annoncé en 2023 un service d'authentification digitale intégré à son app officielle, permettant aux clients de scanner leurs sacs et recevoir une confirmation cryptographique. Calendrier officiel non communiqué. En attendant, l'authentification reste manuelle par experts humains (boutique, services type Entrupy) ou communautaire (forums d'authentification spécialisés).",
      },
    ],
  },
  {
    slug: "cuir-caviar-lambskin",
    name: "Cuir caviar ou lambskin",
    brandSlug: "chanel",
    category: "bags",
    tagline: "Différencier cuir caviar et lambskin authentiques Chanel",
    intro:
      "Chanel utilise deux cuirs signatures pour ses Classic Flap : le cuir caviar (veau grainé texturé) et le lambskin (agneau lisse). Chaque cuir a des propriétés physiques distinctes qui permettent de discriminer authentique et contrefaçon. Le caviar authentique est un cuir de veau tanné végétal avec un grain spécifique imitant des œufs de poisson — petites bosselures rondes régulières de 0,8-1,2 mm de diamètre, sans alignement strict mais avec une densité homogène. Il est ferme, tient la forme, résiste aux éraflures quotidiennes, et se patine en 10+ ans sans décoloration notable. Le lambskin authentique est un cuir d'agneau full-grain, ultra-souple, avec une surface lisse marbrée de micro-veines naturelles (reconnaissables à la loupe x10). Il est plus fragile que le caviar (marque aux chocs, craquelures possibles après 5-7 ans de port intensif) mais offre un toucher soie incomparable. Les contrefaçons caviar utilisent souvent un « faux grain » embossé artificiellement — bosselures trop régulières, parfois alignées en rangées strictes (impossible sur cuir naturel) ou de tailles identiques (le grain caviar authentique a une variation naturelle). Les contrefaçons lambskin utilisent du cuir split leather (face inférieure du cuir) trop lisse, sans veines naturelles, ou du synthétique PU qui brille uniformément. Quatre tests tranchent : 1) test bosselure caviar (régularité vs alignement), 2) test toucher lambskin (soie vs synthétique), 3) test d'odeur (cuir tanné authentique = odeur douce, fake = odeur chimique), 4) test patine (authentique vieillit noblement, fake se dégrade).",
    steps: [
      {
        title: "Identifier le cuir (caviar ou lambskin)",
        description:
          "Caviar = grain visible en bosselures régulières, surface rugueuse au toucher. Lambskin = surface lisse, reflets doux, extrêmement souple. Vérifiez d'abord quel cuir le modèle est censé avoir (info sur chanel.com pour le colorway).",
      },
      {
        title: "Test caviar : régularité mais non-alignement du grain",
        description:
          "À la loupe x5, les bosselures caviar ont une taille variable (0,8-1,2 mm), réparties densément mais sans alignement en rangées strictes. Un grain parfaitement aligné en quadrillage = embossage industriel fake.",
      },
      {
        title: "Test lambskin : veines naturelles et douceur",
        description:
          "À la loupe x10, le lambskin authentique révèle des micro-veines irrégulières (anciennes veines sanguines de l'animal). Un lambskin parfaitement uniforme sans veine = split leather fake. Au toucher : douceur soie, pas plastique.",
      },
      {
        title: "Test odeur",
        description:
          "Approchez le cuir du nez. Cuir tanné Chanel = odeur douce, légèrement sucrée, discrète. Fake PU ou cuir tanné chinois bas de gamme = odeur chimique forte, parfois piquante. Test immédiat et révélateur.",
      },
      {
        title: "Test patine (paires portées)",
        description:
          "Sur paires de 2-5 ans : le caviar authentique garde sa texture et reste ferme. Le lambskin authentique développe des micro-marques d'usage sans craquelures. Fakes : caviar qui s'aplatit (perte de relief), lambskin qui craquelle en plaques.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre caviar et pebble grain (autres marques)",
        description:
          "D'autres marques (Coach, Tory Burch) utilisent un « pebble grain » similaire au caviar Chanel. Sur une pièce non-Chanel, le grain peut être authentique sans être caviar. Assurez-vous d'abord que la pièce est marquée Chanel avant d'appliquer les critères caviar.",
      },
      {
        title: "Rejeter un lambskin marqué comme toujours fake",
        description:
          "Le lambskin marque facilement (micro-griffures, légères déformations). Une paire lambskin portée 2-3 ans AURA des marques — c'est normal et n'invalide pas l'authenticité. Rejeter un lambskin « trop marqué » est une erreur si par ailleurs les marques sont cohérentes avec l'usage.",
      },
      {
        title: "Tester l'odeur sur sac parfumé",
        description:
          "Si le sac a été stocké avec parfums ou lessive, l'odeur du cuir est masquée. Aérez 24-48h avant test olfactif. Un sac qui sent fortement la lavande ou le musc n'est pas testable olfactivement — attendez le retour à une odeur neutre.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires produisent des « caviar » fakes avec embossage chaud sur cuir split — le grain apparaît mais la base cuir est fibreuse et se dégrade rapidement. Défaut détectable : le grain fake s'aplatit sous pression prolongée (assis sur le sac par exemple) alors que le caviar authentique reste structuré. Pour le lambskin, les fakes haut de gamme utilisent du « nappa full-grain » acheté en Turquie (tannerie Güldenpfennig) qui visuellement ressemble au lambskin Chanel — différence : le nappa est plus épais (1,0-1,2 mm vs 0,6-0,8 mm Chanel lambskin) et moins souple. Un sac qui « sonne creux » quand on tapote légèrement est suspect (cuir trop fin) ; un sac « lourd » avec raideur excessive est aussi suspect (cuir trop épais).",
    faqs: [
      {
        question: "Le cuir caviar Chanel peut-il s'abîmer avec le temps ?",
        answer:
          "Très peu. Le caviar est l'un des cuirs les plus durables en maroquinerie — des sacs de 20+ ans restent en bon état avec entretien basique (nettoyage doux + cire incolore annuelle). Les marques d'usage sont minimes (léger brunissement aux coins). Un caviar qui montre des signes de dégradation majeurs (craquelures, décoloration) en moins de 10 ans est soit fake, soit a subi un dommage exceptionnel (produits chimiques, feu, long séjour en pièce humide).",
      },
      {
        question: "Comment savoir si mon Chanel est caviar ou lambskin avant vérification ?",
        answer:
          "Observez la surface : bosselures régulières = caviar, surface lisse brillante = lambskin. Le toucher : caviar ferme et rugueux, lambskin souple et soyeux. En cas de doute, chanel.com référence le cuir pour chaque colorway Classic Flap — recherchez le modèle exact (ex : Classic Flap Medium Black avec hardware gold, 2023 = lambskin). Les vendeurs sur plateformes revente (Vestiaire, TRR) indiquent aussi le cuir dans la fiche produit — vérifiez avant achat.",
      },
    ],
  },
];
