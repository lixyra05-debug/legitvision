import type { GuideSignal } from "../../guide-types";

export const newBalanceSignals: GuideSignal[] = [
  {
    slug: "etiquette-made-in",
    name: "Étiquette Made in USA / UK",
    brandSlug: "new-balance",
    category: "sneakers",
    tagline: "Reconnaître une étiquette Made in USA ou Made in UK authentique",
    intro:
      "New Balance est la seule grande marque de sneakers à maintenir une production significative aux États-Unis et au Royaume-Uni. Les mentions « Made in USA » (usines de Skowhegan, Norridgewock, Lawrence) et « Made in UK » (usine de Flimby) concernent une liste restreinte et documentée de modèles : 990v3/v4/v5/v6, 993, 998, 997.5, 992, 1300, M1400 côté USA ; 577, 670, 991v1/v2, 1500 côté UK. Tous les autres modèles (550, 327, 574, 9060, 2002R, 860) sont fabriqués en Asie (Vietnam, Indonésie, Chine) et n'ont jamais été Made in USA/UK. Une étiquette « Made in USA » sur une 550 ou sur une 9060 est donc une preuve quasi-définitive de contrefaçon. L'étiquette authentique est cousue à l'intérieur de la chaussure, généralement sur le quartier intérieur, en textile blanc avec impression noire, police Helvetica médium. Elle comporte la mention « MADE IN USA » ou « MADE IN UK » en majuscules, la pointure en US/UK/EU/CM, le style code (format « M990GL5 » ou « U9060GRY »), et un numéro de lot à 4-5 chiffres. Les contrefaçons les plus courantes — particulièrement sur 550 et 9060 — ajoutent frauduleusement une mention « Made in USA » pour augmenter la valeur perçue. Vérifier cette cohérence modèle ↔ origine prend dix secondes et élimine instantanément 40 % des fakes NB.",
    steps: [
      {
        title: "Identifier le modèle exact",
        description:
          "Lisez le style code sur la tongue ou sur la box label. Les 3 premiers chiffres indiquent la ligne : 990, 993, 998, 991 = Made in USA/UK autorisé. 550, 327, 574, 9060, 2002R = production Asie uniquement. Vérification immédiate sur la page newbalance.com/pages/made-in-us.",
      },
      {
        title: "Localiser l'étiquette dans la chaussure",
        description:
          "L'étiquette Made in USA/UK est cousue sur la languette intérieure (côté pied) ou sur le quartier intérieur. Tirer légèrement la languette vers l'avant pour l'exposer. Photographier perpendiculairement avec éclairage diffus.",
      },
      {
        title: "Vérifier la cohérence modèle ↔ mention",
        description:
          "Si le modèle autorise USA/UK : la mention doit être présente et lisible. Si le modèle n'autorise PAS USA/UK (ex : 550, 9060) : toute mention « Made in USA » est une contrefaçon. Pour les modèles Asie, la mention authentique est « Made in Vietnam », « Made in Indonesia » ou « Made in China ».",
      },
      {
        title: "Contrôler la police et le kerning",
        description:
          "Helvetica médium en majuscules, kerning régulier entre les lettres. Une police Arial Bold, Times New Roman ou une Helvetica condensée est suspecte. Les caractères doivent être nets, sans bavure d'impression.",
      },
      {
        title: "Lire le numéro de lot et la date",
        description:
          "Certaines étiquettes comportent un numéro de lot (4-5 chiffres) et une date de fabrication (semaine/année). Ces données doivent être cohérentes avec la date de drop du colorway. Une étiquette « 2019 » sur une 990v6 lancée en 2022 est une incohérence temporelle.",
      },
    ],
    commonErrors: [
      {
        title: "Croire que toutes les NB sont Made in USA",
        description:
          "Fausse idée très répandue. Seulement 4 % de la production NB est Made in USA. Les 96 % restants sont fabriqués en Asie, ce qui n'enlève rien à l'authenticité d'une paire de 550 Made in Vietnam. Une mention « Made in Vietnam » sur une 550 est parfaitement légitime.",
      },
      {
        title: "Confondre « Made in USA » et « Made with at least 70% US value »",
        description:
          "Depuis 2011, NB utilise la mention légale « Made in USA » pour les paires dont ≥70 % de la valeur est américaine. Certaines paires portent « Assembled in USA » ou mention similaire, ce qui est légal et authentique. Rejeter à tort une étiquette « Made in USA — domestic and imported materials » est une erreur.",
      },
      {
        title: "Valider sur l'étiquette seule",
        description:
          "Une étiquette authentique collée/cousue dans une paire fake reste faisable. Croisez toujours avec la qualité de broderie du N latéral, la semelle ENCAP, et la couture périphérique. Une étiquette parfaite avec une semelle fake reste une contrefaçon.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires produisent des 550 et 9060 fakes avec une étiquette « Made in USA » imprimée — sachant que cette mention gonfle la valeur perçue de 30-50 % sur les plateformes secondaires. Cette tactique est devenue dominante en 2023-2024, particulièrement sur les drops hypés (9060 Baby Shower Blue, 550 Aimé Leon Dore). Signal fort : la mention USA apparaît sur des étiquettes imprimées en encre bavante (jet d'encre fake) au lieu de l'impression sérigraphie authentique. Passer une goutte d'eau sur l'étiquette — l'authentique ne bavera pas, le fake oui. Autre tactique : impression « Made in USA » sur étiquette qui comporte aussi un code EAN-13 asiatique (commençant par 49 pour Japon ou 69 pour Chine), incohérence révélatrice.",
    faqs: [
      {
        question: "Les 550 peuvent-elles être Made in USA ?",
        answer:
          "Non. La New Balance 550, lancée en 1989 et relancée en 2020 via la collaboration Aimé Leon Dore, est exclusivement fabriquée en Asie (Vietnam et Indonésie principalement). Aucune 550 authentique ne porte la mention « Made in USA ». Si vous voyez cette mention, c'est à 99,9 % une contrefaçon — les 0,1 % restants correspondant à des prototypes internes non commercialisés.",
      },
      {
        question: "Comment vérifier qu'une 990v6 Made in USA est authentique ?",
        answer:
          "L'étiquette Made in USA doit être présente, la pointure cohérente avec la taille physique, et le style code (ex : « M990GL6 ») correspondant au colorway. Cross-check sur StockX/GOAT : la 990v6 grise porte le code M990GL6, la beige M990TA6. Un code introuvable est un signal. Ensuite, vérifiez la qualité ENCAP de la semelle et la broderie du N latéral qui, sur Made in USA, compte 1800-2100 points (contre 1400-1600 sur fake).",
      },
    ],
  },
  {
    slug: "n-lateral-broderie",
    name: "N latéral brodé",
    brandSlug: "new-balance",
    category: "sneakers",
    tagline: "Analyser la broderie du N latéral New Balance : densité, forme, matière",
    intro:
      "La grande lettre N — brodée, appliquée en suède ou en cuir selon modèle — sur les flancs latéraux des sneakers New Balance est le logo le plus visible de la marque. Sa qualité d'exécution est un indicateur fort d'authenticité. Sur une 990v5 Made in USA, le N est constitué de 1800-2100 points de broderie sur un fond textile maillé, fil mat 40 wt de couleur assortie ou contrastante selon colorway. Sur une 550, le N est en suède ou cuir découpé puis cousu au ras, avec 45-55 points de couture périphérique par N. Sur une 9060, le N est en suède épais découpé laser avec une finition des bords légèrement scellée. Les contrefaçons trahissent une densité de broderie inférieure (1200-1500 points sur 990v5 fake), un fil brillant polyester bas de gamme, des bords de suède non scellés qui s'effilochent après 2-3 semaines de port, ou une découpe laser imprécise avec des angles arrondis là où ils devraient être nets. La forme du N est également très codifiée : hauteur exacte en proportion de la pointure (85 mm sur pointure 42, 95 mm sur pointure 44), angle précis de la barre diagonale (68° par rapport à l'horizontale sur les N modernes, 72° sur les vintage pré-2005). Une déviation de 2-3° est perceptible à l'œil nu et est une alerte forte.",
    steps: [
      {
        title: "Mesurer la hauteur du N",
        description:
          "Avec un réglet souple : hauteur = 80-95 mm selon pointure (85 mm sur 42, 88 mm sur 43, 92 mm sur 44). Un N trop petit ou trop grand par rapport à la pointure est une erreur de mise à l'échelle fake.",
      },
      {
        title: "Vérifier la forme et l'angle de la diagonale",
        description:
          "La diagonale du N descend du haut droite vers le bas gauche à un angle de 68° par rapport à l'horizontale (modèles post-2005). Utilisez une app rapporteur (Measure iOS, Bubble Level Android). Un angle hors plage 66-70° est suspect.",
      },
      {
        title: "Compter approximativement les points de broderie",
        description:
          "Sur modèles brodés (990 series, 991, 993) : densité élevée (~1800-2100 points). Sur fake : densité moindre, fils plus espacés. Photographiez en macro (téléphone en mode macro ou loupe x10) et évaluez la densité par zone de 1 cm².",
      },
      {
        title: "Contrôler la matière (suède, cuir, textile)",
        description:
          "Selon modèle : 990 = textile maillé + broderie ; 550 = suède 1,2 mm ; 9060 = suède 1,5 mm. Passez l'ongle sur le N : un matériau rigide comme du plastique ou un suède trop lisse (absence de fibres naturelles) est suspect.",
      },
      {
        title: "Inspecter la couture périphérique (modèles suède/cuir)",
        description:
          "Sur 550 et 9060, le N est cousu au ras du suède avec 45-55 points par N. Couture régulière, sans nœud visible, sans dépassement de fil > 1 mm. Une couture grossière ou des points irréguliers trahissent un assemblage fake.",
      },
    ],
    commonErrors: [
      {
        title: "Comparer la densité de broderie entre modèles différents",
        description:
          "La densité de broderie varie selon la ligne : 990v5 brodée dense (~2000 points), 2002R à broderie plus légère (~1400 points). Comparer une 2002R avec une 990 et conclure à une contrefaçon sur la 2002R est une erreur de méthode.",
      },
      {
        title: "Ignorer la décoloration naturelle du suède",
        description:
          "Un suède porté 6 mois en extérieur se patine : nuances légèrement plus claires aux zones de friction. Cela ne signifie pas contrefaçon. En revanche, une décoloration uniforme sur toute la surface en 2 semaines trahit un suède teint de manière instable (fake).",
      },
      {
        title: "Valider sur un seul côté",
        description:
          "Les deux N (chaussure gauche et chaussure droite) doivent être symétriques en taille, position, densité, matière. Une asymétrie visible (un N plus clair, plus petit, ou positionné plus haut) révèle un assemblage à partir de pièces hétérogènes.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires investissent aujourd'hui dans des machines à broder 10-aiguilles similaires à celles des usines NB authentiques — résultat visuel proche. Le défaut signature : les fakes utilisent un fil polyester standard 30 wt (plus brillant, plus fin) au lieu du polyester mat NB 40 wt. Sous lumière directe, le N fake reflète comme du satin ; le N authentique absorbe la lumière avec un léger matité. Autre tactique : sur 550 et 9060, les fakes utilisent un suède split leather (fente interne de cuir) au lieu du full-grain suède utilisé par NB. Le split leather a une texture plus molle et pelucheuse. Frotter vigoureusement le N 20 fois : un split leather s'effiloche, un full-grain reste intact.",
    faqs: [
      {
        question: "Pourquoi mon N latéral semble plus brillant qu'en photo officielle ?",
        answer:
          "Plusieurs causes possibles. 1) Un éclairage direct fort accentue les reflets du fil polyester (normal sur authentique). 2) Un fil polyester 30 wt brillant est plus réfléchissant (signal fake). Test : photographiez en lumière diffuse (ombre ou fenêtre couverte). L'authentique conserve sa matité ; le fake reste satiné. Si doute, comparez avec la page produit newbalance.com du colorway exact.",
      },
      {
        question: "Les 550 avec N en cuir peuvent-elles être authentiques ?",
        answer:
          "Non. La 550 authentique utilise TOUJOURS du suède (nubuck à fibres courtes) sur le N latéral. Certaines collaborations limitées ont expérimenté du cuir lisse (ex : 550 Aimé Leon Dore « Rich Leather » 2023 en édition restreinte 500 paires), documentées sur la page ALD. En dehors de ces éditions connues, une 550 avec N en cuir lisse est une contrefaçon.",
      },
    ],
  },
  {
    slug: "encap-semelle",
    name: "Technologie ENCAP/ABZORB semelle",
    brandSlug: "new-balance",
    category: "sneakers",
    tagline: "Identifier la technologie ENCAP ou ABZORB authentique New Balance",
    intro:
      "ENCAP (polyuréthane entourant une mousse EVA) et ABZORB (gel absorbeur d'impact) sont les deux technologies historiques de la semelle intermédiaire New Balance. ENCAP est identifiable visuellement par une lunette (fenêtre) translucide sur le flanc latéral de la semelle midsole — on voit à travers le polyuréthane un bloc EVA coloré qui forme l'amorti. ABZORB est marqué par une pastille imprimée « ABZORB » ou « ABZORB SBS » sur le talon de la midsole. Ces éléments sont moulés en usine et leur contrefaçon est techniquement difficile : les fakes se contentent d'imprimer « ENCAP » ou « ABZORB » sans reproduire la structure physique. Sur une 990v5 authentique, la lunette ENCAP est parfaitement transparente et le bloc EVA interne est visible avec sa texture poreuse caractéristique. Sur un fake, la lunette est soit opaque (polyuréthane épais fake), soit remplie d'un bloc EVA uniforme sans pores. Sur une 993 authentique, la pastille ABZORB est embossée en relief de 0,5 mm dans le polyuréthane ; sur un fake, elle est sérigraphiée à plat. Test tactile : passer l'ongle sur la pastille authentique révèle un relief ; sur fake, aucune résistance tactile. Ce test est particulièrement efficace sur les 990 series et les 993 où ENCAP/ABZORB sont signatures.",
    steps: [
      {
        title: "Repérer la lunette ENCAP (990 series)",
        description:
          "Sur le flanc latéral de la midsole, une fenêtre translucide de 20-30 mm de long est intégrée. Regardez à travers : un bloc EVA coloré (blanc, gris, ou assorti au colorway) doit être visible avec sa texture naturelle. Une lunette opaque = fake.",
      },
      {
        title: "Vérifier la texture EVA interne",
        description:
          "Le bloc EVA authentique a une texture légèrement poreuse (petits trous d'air visibles à l'œil nu ou à la loupe x5). C'est lié au procédé d'expansion en usine. Un bloc parfaitement lisse, sans pores, trahit un EVA fake bas de gamme.",
      },
      {
        title: "Localiser la pastille ABZORB (993 et modèles concernés)",
        description:
          "Sur le talon de la midsole, une pastille circulaire de 25-30 mm de diamètre porte la mention « ABZORB » ou « ABZORB SBS ». Embossée dans le polyuréthane avec un relief tactile de 0,5 mm. Une pastille imprimée à plat = fake.",
      },
      {
        title: "Tester la compressibilité",
        description:
          "Pressez la midsole avec le pouce : l'authentique offre une résistance progressive (compression progressive du polyuréthane + EVA). Un fake en mousse uniforme s'enfonce immédiatement ou reste rigide. Test subjectif mais combiné avec visuel = signal fort.",
      },
      {
        title: "Observer le vieillissement (paires usagées)",
        description:
          "ENCAP authentique jaunit légèrement avec le temps (exposition UV) mais reste ferme. Fake ENCAP se craquelle, se fissure, ou devient collant après 1-2 ans. Une midsole collante sur paire 2-3 ans est un signal contrefaçon (matière plastifiante bas de gamme).",
      },
    ],
    commonErrors: [
      {
        title: "Chercher ENCAP sur un modèle non concerné",
        description:
          "ENCAP n'est utilisé que sur 990 series, 991, 993, 998, 1300, 1400 et quelques autres. Chercher une lunette ENCAP sur une 550 ou une 2002R est une erreur : ces modèles n'ont jamais eu ENCAP. Ne pas trouver ENCAP sur une 550 ne prouve rien.",
      },
      {
        title: "Valider sur le marquage imprimé seul",
        description:
          "Le texte « ENCAP » ou « ABZORB » imprimé ne prouve rien à lui seul — les faussaires l'impriment également. La preuve vient de la structure physique (lunette translucide, pastille embossée, bloc EVA poreux).",
      },
      {
        title: "Confondre ENCAP et FuelCell",
        description:
          "FuelCell (technologie plus récente, introduite en 2018) remplace ENCAP sur certains modèles modernes (1080, Fresh Foam). Chercher ENCAP sur une 1080v12 est une erreur — ce modèle utilise FuelCell, identifiable par sa midsole TPU blanche sans lunette.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires produisent des midsoles en EVA monocouche uniforme peinte pour imiter la lunette ENCAP translucide — résultat visuel imparfait (la peinture grise laisse deviner l'opacité totale au lieu de la translucidité). Pour ABZORB, ils utilisent un tampon sérigraphique qui imite le texte embossé mais à plat. Le défaut signature 2023-2024 des fakes haut de gamme : la lunette ENCAP est réellement creuse mais remplie avec une résine transparente au lieu du polyuréthane authentique. Sous lumière UV (lampe 365 nm), la résine fake fluoresce bleu-violet tandis que le polyuréthane authentique NB reste neutre. Ce test UV est imparable pour départager les fakes moyen/haut de gamme.",
    faqs: [
      {
        question: "Ma 990v5 ne semble pas avoir de lunette ENCAP visible, est-elle fake ?",
        answer:
          "Non, pas nécessairement. Sur 990v5 et 990v6, la lunette ENCAP est moins visible que sur 990v3 classique. Elle est plus petite, située plus discrètement sous la partie talon de la midsole. Photographiez en lumière rasante pour révéler la dépression. Si après inspection attentive vous ne trouvez vraiment aucune lunette, comparez avec la photo officielle newbalance.com du colorway : la position varie selon colorway et version.",
      },
      {
        question: "La pastille ABZORB peut-elle s'effacer avec le temps ?",
        answer:
          "Elle peut pâlir esthétiquement (décoloration superficielle) mais le relief embossé reste. Une pastille complètement lisse au toucher sur une paire de 2-3 ans révèle soit un polyuréthane fake qui s'est affaissé (perte de mémoire de forme), soit une pastille sérigraphiée à plat d'origine. Dans les deux cas, signal contrefaçon.",
      },
    ],
  },
  {
    slug: "numero-modele",
    name: "Numéro de modèle et SKU",
    brandSlug: "new-balance",
    category: "sneakers",
    tagline: "Déchiffrer le SKU New Balance : préfixe, suffixe, cohérence colorway",
    intro:
      "Le SKU (Stock Keeping Unit) de New Balance suit une structure logique qui permet un décodage rapide et une vérification de cohérence. Format type : 1 lettre de genre (M = men, W = women, U = unisexe, GC = grade school, PC = preschool) + 3-4 chiffres de modèle (990, 9060, 550, 2002) + 1-3 lettres/chiffres de version ou colorway (GL5, GRY, BA). Exemples : M990GL5 = men 990v5 grey, U9060GRY = unisexe 9060 grey, BB550WT1 = basketball 550 white. Chaque SKU est unique à un colorway précis et référencé sur newbalance.com, StockX et GOAT. Les contrefacteurs commettent deux erreurs typiques : 1) un SKU inventé qui n'existe nulle part (preuve immédiate de contrefaçon), 2) un SKU emprunté à un autre colorway du même modèle (par exemple un SKU de 550 white apposé sur une 550 gris). Le cross-check SKU ↔ colorway visuel est un des tests les plus rapides : recherche du SKU sur StockX → photo officielle → comparaison avec la paire en main. Un décalage de colorway (la paire est blanche mais le SKU correspond à la bleue) tranche définitivement. Ce test prend 30 secondes et élimine 35 % des contrefaçons vendues par des faussaires paresseux qui recopient des SKUs au hasard.",
    steps: [
      {
        title: "Lire le SKU sur la box label et la tongue",
        description:
          "Le SKU complet (ex : « M990GL5 ») est imprimé sur la box label (côté petit) et sur l'étiquette langue intérieure. Vérifiez que les deux SKUs sont identiques — un décalage révèle un remplacement d'étiquette.",
      },
      {
        title: "Rechercher le SKU sur newbalance.com",
        description:
          "Tapez le SKU exact dans la barre de recherche newbalance.com. Il doit apparaître (même si la page produit a été retirée du catalogue, Google cache garde une trace). Un SKU totalement introuvable partout est une preuve quasi-définitive de contrefaçon.",
      },
      {
        title: "Cross-check sur StockX / GOAT",
        description:
          "Recherche du SKU sur stockx.com et goat.com. La photo officielle doit correspondre exactement au colorway de la paire en main : même teintes, même matériaux, mêmes détails. Un colorway discordant = contrefaçon.",
      },
      {
        title: "Vérifier la lettre de genre",
        description:
          "M = men (pointures 40-49), W = women (pointures 35-41), U = unisexe. Un SKU « M » sur une paire pointure 37 est suspect (sauf versions rééditées unisex). Croisez avec la pointure physique pour détecter les incohérences.",
      },
      {
        title: "Contrôler le suffixe version (v5, v6)",
        description:
          "Le suffixe numérique final indique la version (GL5 = v5, GL6 = v6). Une 990v6 avec un SKU finissant par GL4 (= v4) est une contrefaçon ou un assemblage d'éléments hétérogènes. Les versions ne sont pas interchangeables.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter un SKU générique court (ex : « 990 »)",
        description:
          "Un SKU authentique NB a toujours 6-10 caractères (M990GL5). Un SKU court « 990 » ou « 550 » sans préfixe/suffixe sur l'étiquette est une simplification fake — les faussaires paresseux ne remplissent pas l'étiquette complète. Rejet immédiat.",
      },
      {
        title: "Valider un SKU sur site tiers douteux",
        description:
          "Certains sites type « NBAuthenticator » ou forums reddit référencent des SKUs au hasard. Seuls newbalance.com, StockX et GOAT sont des sources fiables. Un SKU validé uniquement sur site tiers douteux reste suspect.",
      },
      {
        title: "Ignorer les collaborations (ALD, Salehe Bembury)",
        description:
          "Les collaborations ont des SKUs spéciaux (ex : ML2002R4 pour Salehe Bembury Water The Plants). Ces SKUs n'apparaissent pas toujours sur newbalance.com mais sont référencés sur le site du collaborateur (aimeleondore.com, saleehebembury.com). Une collab sans référencement collaborateur officiel est suspecte.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires utilisent des scripts automatisés qui scrappent newbalance.com et génèrent des étiquettes avec SKUs réels — ce qui rend l'étape « SKU trouvable » peu discriminante à elle seule. La tactique plus sophistiquée consiste à emprunter le SKU d'un colorway rare (ex : 990v5 Kith Dusty Rose, SKU M990KR5) pour le coller sur une paire fake basique — pariant que l'acheteur ne fera pas la vérification photographique colorway. Signal de détection : le SKU renvoie à une paire bien plus chère ou plus rare que celle présentée. Si le vendeur propose une « 990v5 grise basique » à 180 € avec un SKU M990KR5 (collab Kith rose à 900 €), c'est une incohérence grossière de valorisation. Croiser SKU ↔ prix demandé révèle ces tentatives.",
    faqs: [
      {
        question: "Que faire si le SKU de mon étiquette tongue diffère du SKU de la boîte ?",
        answer:
          "C'est une alerte majeure. Dans 95 % des cas, cela signifie que la boîte et la paire ne sont pas assorties — soit la paire est fake dans une vraie boîte, soit inversement. Très rare cas légitime : une paire échangée en magasin avec erreur de remise en boîte, mais newbalance.com ne commet quasiment jamais cette erreur. Demandez au vendeur des explications et des photos complémentaires ; en cas de doute, renoncez à l'achat.",
      },
      {
        question: "Les SKUs NB utilisent-ils des lettres O et des chiffres 0 ?",
        answer:
          "Oui, les deux. Attention à la confusion : le O (lettre) apparaît rarement dans les SKUs NB (principalement dans « GC » pour grade school), tandis que le 0 (chiffre) est très fréquent (990, 9060, 2002). Lors de la lecture, utilisez une loupe pour différencier : le 0 authentique est ovale vertical, le O est rond. Une confusion O/0 mène à un SKU inventé et à un rejet erroné d'une paire authentique.",
      },
    ],
  },
];
