import type { GuideSignal } from "../../guide-types";

export const stoneIslandSignals: GuideSignal[] = [
  {
    slug: "badge-compass",
    name: "Badge compass (boussole bras gauche)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Analyser le badge boussole Stone Island : couleurs, broderie, fixation bouton-velcro",
    intro:
      "Le badge boussole — rose des vents jaune et noire brodée sur fond cousu au bras gauche — est l'élément iconique de Stone Island depuis la création de la marque par Massimo Osti en 1982. C'est aussi un signal d'authentification : sa réalisation technique est exigeante et trahit immédiatement les contrefaçons. Sur une pièce issue de la production officielle, le badge mesure 7,5 cm de diamètre (tolérance ± 2 mm), est brodé avec 2 200 à 2 500 points sur un support en coton ou nylon selon la saison, et utilise deux fils de couleurs précises : jaune Pantone 116C pour les rayons de la boussole et le texte « STONE ISLAND », noir Pantone Black 6C pour le contour et les détails intérieurs. Le nom « STONE ISLAND » en capitales forme un demi-cercle supérieur, « DOWN » ou la catégorie apparaît en bas selon la saison. Le badge est fixé au bras par un système à deux boutons (un en haut, un en bas) + velcro périphérique — jamais cousu directement sur le vêtement (sauf exceptions sur pièces spéciales). Les contrefaçons trahissent plusieurs défauts : diamètre de 7 cm ou 8 cm (erreur de gabarit), jaune tirant vers l'orange ou le citron au lieu du jaune chaud 116C, densité de broderie insuffisante laissant apparaître le support textile, fixation cousue fixe au lieu du système bouton-velcro, ou — détail fréquent — orientation de la rose des vents (l'aiguille principale doit pointer nord, pas est ou ouest).",
    steps: [
      {
        title: "Mesurer le diamètre du badge (7,5 cm)",
        description:
          "Avec un mètre souple, mesurez le diamètre externe du badge. 7,5 cm ± 2 mm sur vestes et sweats adultes. Sur pièces junior, 6,5 cm. Sur pièces XXL et manteaux down, 8 cm. Un diamètre hors de cette grille est un signal fort.",
      },
      {
        title: "Vérifier les teintes Pantone 116C et Black 6C",
        description:
          "Jaune 116C (jaune chaud légèrement ocré, distinguable de 109C plus clair et 124C plus foncé). Noir Black 6C (noir mat). Un jaune citron ou orangé, ou un noir tirant vers le gris anthracite, sont des signaux.",
      },
      {
        title: "Compter la densité de broderie (2 200-2 500 points)",
        description:
          "Au zoom ×10, les points de broderie doivent couvrir 100 % du support, sans zone textile apparente. Une broderie clairsemée laissant voir le coton sous les fils est un défaut industriel typique des fakes à moulin bas de gamme.",
      },
      {
        title: "Tester le système de fixation bouton + velcro",
        description:
          "Le badge est fixé au bras par 2 boutons pression et un velcro périphérique. Retirez délicatement le badge pour vérifier. Un badge cousu fixe (sans bouton-velcro), sur une pièce Stone Island standard, est un signal fort.",
      },
      {
        title: "Contrôler l'orientation de la rose des vents",
        description:
          "L'aiguille principale de la boussole (la plus longue, souvent rouge ou noire selon modèle) doit pointer vers le haut (nord). Une orientation est/ouest/sud est un défaut d'assemblage impossible chez Stone Island.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre les badges « STONE ISLAND » et les éditions spéciales",
        description:
          "Les lignes Shadow Project, Ghost Piece, Stone Island Marina ont des badges légèrement différents (couleurs, ajout de mentions). Vérifiez sur stoneisland.com la référence exacte de votre modèle avant de signaler une divergence.",
      },
      {
        title: "Ignorer le système de fixation bouton-velcro",
        description:
          "C'est le test le plus discriminant sur les pièces classiques : Stone Island ne coud pas ses badges fixe (sauf sur pièces junior et quelques modèles SS). Un badge fixe sur une veste ou un sweat adulte est un signal d'alerte fort, à croiser avec les autres signaux.",
      },
      {
        title:
          "Accepter une broderie clairsemée comme « variation de lot »",
        description:
          "Stone Island n'a pas de variation de densité de broderie : le standard industriel est 2 200-2 500 points. Une broderie qui laisse voir le support textile est toujours un défaut de contrefaçon, jamais une « tolérance ».",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs reproduisent la forme générale du badge et les deux couleurs, mais butent sur trois points. Premier : la densité de broderie — ils utilisent 1 500-1 800 points au lieu de 2 200-2 500, économie d'un tiers de fil et de temps machine. Résultat : support textile visible au zoom. Deuxième : le système de fixation — ils cousent le badge fixe par économie d'assemblage, ignorant le velcro périphérique. Troisième : la teinte jaune — ils confondent 116C (référence Stone Island) et 109C (jaune citron plus clair), ou 124C (jaune orangé). Les super-fakes récents (2024+) reproduisent la densité et la teinte, mais oublient souvent le velcro et l'orientation correcte de l'aiguille.",
    faqs: [
      {
        question:
          "Le badge Stone Island peut-il être retiré et perdu sur une pièce d'origine ?",
        answer:
          "Oui — c'est même une pratique connue des porteurs qui enlèvent le badge pour éviter les vols ou pour un look plus discret. Le système bouton-velcro est conçu pour cela. Sur une pièce de seconde main sans badge mais avec les boutons et velcro intacts, l'authentification bascule sur les autres signaux (certilogo, étiquette composition, boutons gravés). Demandez au vendeur de vérifier les 2 boutons pression et le velcro — s'ils sont absents, la pièce n'a probablement jamais eu de badge et est une contrefaçon ancienne.",
      },
      {
        question:
          "Les badges des éditions Shadow Project ou Ghost Piece sont-ils différents ?",
        answer:
          "Oui, significativement. Shadow Project : badge ton sur ton noir/noir ou gris/gris, plus discret. Ghost Piece : badge complètement teint en noir (technique de teinture pièce entière après assemblage, créant un effet vieilli). Stone Island Marina : badge avec mention « MARINA » ajoutée en bas. Prototype Research Series : badge varié selon le projet. Consultez toujours la page stoneisland.com ou une archive du drop avant d'authentifier un badge non standard. Un badge « Shadow Project » jaune/noir classique est un signal de contrefaçon (les Shadow Project sont toujours monochromes).",
      },
    ],
  },
  {
    slug: "certilogo",
    name: "Certilogo (code d'authentification officiel)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Ce que le code Certilogo des pièces Stone Island permet de vérifier, et ce qu'il ne prouve pas",
    headline: "Certilogo Stone Island : ce que le code vérifie, et ce qu'il ne prouve pas",
    intro:
      "Depuis la collection printemps-été 2014, Stone Island propose de vérifier l'authenticité de ses pièces avec le service Certilogo. Selon la marque, un code Certilogo à 12 chiffres et un QR code figurent sur une étiquette de sécurité cousue à l'intérieur des vêtements ; les pièces Stone Island Junior en portent depuis la collection automne-hiver 2020-2021, et certaines familles de produits n'en ont pas (les chaussures et certains accessoires). Le code se saisit sur le site de Stone Island, qui renvoie vers le service Certilogo, ou le QR code se scanne avec un téléphone. Certilogo affirme que des copies de son code ne trompent pas son service ; selon des revendeurs spécialisés, des contrefaçons réutilisent pourtant des codes authentiques. Un résultat positif ne prouve donc pas, à lui seul, que la pièce en main est authentique, et une pièce sans code n'est pas une contrefaçon pour cette seule raison. Ce guide dit ce qu'on peut tirer du Certilogo, et ce qu'on ne peut pas en tirer.",
    steps: [
      {
        title: "Savoir quelles pièces portent un code",
        description:
          "Selon Stone Island, le service couvre les collections à partir du printemps-été 2014 (de l'automne-hiver 2020-2021 pour Stone Island Junior), et les chaussures et certains accessoires n'ont pas de code. Une pièce plus ancienne sans code n'est pas suspecte pour cette raison.",
      },
      {
        title: "Localiser l'étiquette de sécurité",
        description:
          "Stone Island indique que le code à 12 chiffres et le QR code figurent sur une étiquette de sécurité cousue à l'intérieur du vêtement. Une étiquette recousue ou mal fixée justifie d'examiner le reste de la pièce.",
      },
      {
        title: "Faire la vérification soi-même, pièce en main",
        description:
          "Saisissez le code sur le site de Stone Island, qui renvoie vers le service Certilogo, ou scannez le QR code, puis répondez aux questions posées. Selon Certilogo, la vérification se fait avec le produit en main, et sa réponse dépend aussi de qui la fait : une capture d'écran envoyée par le vendeur ne prouve rien.",
      },
      {
        title: "Ne pas conclure du seul résultat",
        description:
          "Un résultat positif ne prouve pas, à lui seul, que la pièce en main est authentique : selon des revendeurs spécialisés, des contrefaçons réutilisent des codes authentiques. Un résultat négatif est un signal d'alerte fort, pas une preuve à lui seul : vérifiez d'abord la saisie du code.",
      },
      {
        title: "Vérifier les signaux de la pièce",
        description:
          "Badge boussole, boutons, étiquette de composition : ces signaux portent sur le vêtement lui-même. Voir les autres guides Stone Island. Demandez aussi la preuve d'achat, cohérente avec la pièce et avec le récit du vendeur.",
      },
    ],
    commonErrors: [
      {
        title: "Se contenter d'une capture d'écran du vendeur",
        description:
          "Une capture d'écran de résultat, ou la photo d'un code valide, ne dit pas que la pièce proposée est celle qui porte ce code. Faites la vérification vous-même, pièce en main.",
      },
      {
        title: "Prendre un résultat positif pour une preuve",
        description:
          "Selon des revendeurs spécialisés, des contrefaçons réutilisent des codes authentiques. Un résultat positif se croise avec le badge, les boutons et l'étiquette de composition.",
      },
      {
        title: "Conclure à une contrefaçon faute de code",
        description:
          "Les pièces antérieures à la collection printemps-été 2014, les chaussures et certains accessoires n'ont pas de code Certilogo. Sur une pièce plus récente, une étiquette absente justifie d'examiner le reste de la pièce, sans prouver la contrefaçon : elle a pu être coupée.",
      },
    ],
    counterfeiterTactics:
      "Certains vendeurs envoient une capture d'écran de résultat « authentique », ou le code d'une pièce authentique. Selon Certilogo, la vérification se fait avec le produit en main et sa réponse dépend aussi de qui la fait : une capture ne prouve rien. Selon des revendeurs spécialisés, des contrefaçons réutilisent aussi des codes authentiques. Jugez la pièce sur ses signaux visibles et sur sa preuve d'achat.",
    faqs: [
      {
        question:
          "Certilogo répond négativement pour une pièce que je crois authentique : est-elle fausse ?",
        answer:
          "C'est un signal d'alerte fort, pas une preuve à lui seul. Vérifiez d'abord la saisie du code. Certilogo indique que sa réponse dépend aussi de qui fait la vérification. Croisez avec le badge, les boutons et l'étiquette de composition, et, en cas de doute, renoncez à l'achat ou contactez le service client de Stone Island.",
      },
      {
        question:
          "Le QR code de l'étiquette ne se scanne plus : que faire ?",
        answer:
          "Saisissez le code à 12 chiffres sur le site de Stone Island : la marque indique que la vérification se fait par le code ou par le QR code. Un QR code usé qui ne se lit plus ne prouve rien. Si le code lui-même est illisible, jugez la pièce sur ses autres signaux.",
      },
    ],
  },
  {
    slug: "boutons-badge",
    name: "Boutons gravés (metal buttons STONE ISLAND)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Lire les boutons métalliques Stone Island : gravure, laiton doré, finition",
    intro:
      "Les boutons métalliques qui fixent le badge boussole au bras — deux boutons pression en laiton doré — sont un signal d'authentification secondaire mais très discriminant quand le badge a été retiré. Sur une pièce d'origine, les boutons mesurent 14 mm de diamètre (tolérance ± 0,5 mm), sont gravés en creux de la mention « STONE ISLAND » en capitales Helvetica autour du cercle, avec un creux de gravure de 0,4 mm perceptible à l'ongle. Le laiton a une finition dorée satinée, pas chromée. La rondelle de pression intérieure est également gravée « STONE ISLAND » en petites capitales. Les contrefaçons trahissent plusieurs défauts : gravure imprimée au lieu de gravée (test à l'ongle immédiat), laiton trop rouge (cuivré) ou trop pâle (alliage bas de gamme), chromage brillant au lieu du satiné doré, diamètre 12 ou 16 mm au lieu de 14, mécanisme de pression bas de gamme qui prend vite du jeu. La rondelle intérieure non gravée est également un signal — les fakes économisent sur cette pièce invisible au porter. Ce signal est particulièrement utile quand le badge compass est manquant.",
    steps: [
      {
        title: "Retirer délicatement le badge pour exposer les boutons",
        description:
          "Déboutonnez les deux pressions, décollez le velcro, retirez le badge. Les deux boutons mâles (sur le vêtement) et les deux femelles (sous le badge) sont visibles.",
      },
      {
        title: "Mesurer le diamètre 14 mm",
        description:
          "Au pied à coulisse ou à la règle, le diamètre externe du bouton mâle doit faire 14 mm ± 0,5 mm. Un diamètre 12 ou 16 mm est un signal fort de contrefaçon.",
      },
      {
        title: "Tester la gravure « STONE ISLAND » à l'ongle",
        description:
          "Passez l'ongle sur les lettres « S-T-O-N-E-I-S-L-A-N-D » autour du cercle. Vous devez sentir un creux de 0,4 mm. Une surface lisse (impression) est un signal d'alerte fort, à croiser avec les autres signaux.",
      },
      {
        title: "Vérifier la finition dorée satinée (pas chromée)",
        description:
          "Le laiton doré a un aspect chaud, satiné, légèrement jaune. Un chromage brillant froid (argenté) est un défaut typique des fakes bas de gamme qui utilisent du laiton chromé au lieu du doré à l'or.",
      },
      {
        title: "Contrôler la rondelle intérieure gravée",
        description:
          "Sous le badge, la rondelle de pression femelle doit aussi porter la gravure « STONE ISLAND » en petites capitales. Son absence ou le remplacement par une rondelle lisse est un signal fort.",
      },
    ],
    commonErrors: [
      {
        title: "Ne pas retirer le badge pour inspecter les boutons",
        description:
          "Prenez 30 secondes pour déboutonner et inspecter les 4 boutons.",
      },
      {
        title: "Confondre chromage et dorure",
        description:
          "Un chromage brillant froid (type argenterie) est très différent du doré satiné chaud. Mettez les boutons sous lumière naturelle, la teinte doit être jaune-doré, pas argenté-bleu.",
      },
      {
        title: "Ignorer la rondelle intérieure",
        description:
          "Les faussaires supposent que personne ne regarde sous le badge. Une rondelle non gravée est un signal fort même si les boutons externes sont parfaits.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent la forme générale du bouton et la gravure extérieure. Ils butent sur : la profondeur de gravure (souvent 0,2 mm au lieu de 0,4, test à l'ongle immédiat), la teinte dorée (chromage bas coût au lieu du laiton doré), et surtout la rondelle intérieure. Les super-fakes 2024 gravent aussi la rondelle, mais avec une profondeur moindre et une typographie Arial au lieu d'Helvetica. La qualité du mécanisme de pression est également un indicateur : sur les fakes, il prend souvent du jeu plus vite.",
    faqs: [
      {
        question:
          "Les boutons peuvent-ils s'oxyder ou se ternir avec le temps sur une pièce d'origine ?",
        answer:
          "Oui, légèrement. Avec le temps et l'usage, surtout si la pièce a été stockée dans un environnement humide, le laiton doré peut se patiner (teinte qui fonce), de façon uniforme et graduelle. Une tache d'oxydation verdâtre ou noirâtre localisée est un signal d'alerte, à croiser avec la gravure et les autres signaux. La gravure, elle, reste lisible même avec patine.",
      },
      {
        question:
          "Est-il possible de remplacer les boutons Stone Island en SAV ?",
        answer:
          "Oui, Stone Island remplace les boutons défectueux en SAV dans ses boutiques italiennes et partenaires agréés. Un bouton remplacé après 2015 porte la même gravure et les mêmes spécifications que l'original. Si vous achetez en seconde main une pièce avec un bouton « neuf » au milieu de boutons légèrement patinés, c'est normalement le résultat d'un SAV officiel. Demandez au vendeur s'il a la facture SAV. Attention cependant : certains contrefacteurs remplacent un vrai bouton par un faux sur une vraie pièce, ou inversement — d'où l'importance de vérifier les 4 boutons (2 externes + 2 rondelles internes), pas seulement 1 ou 2.",
      },
    ],
  },
  {
    slug: "etiquette-composition",
    name: "Étiquette composition (interne latérale)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Décoder l'étiquette composition Stone Island : pays, fibres, code saison",
    intro:
      "L'étiquette de composition cousue à l'intérieur du vêtement sur la couture latérale gauche est un signal d'authentification moins iconique que le badge ou le Certilogo, mais très complet — elle concentre les informations réglementaires obligatoires et révèle l'histoire de production de la pièce. Sur une pièce d'origine, l'étiquette mesure 6×9 cm, est imprimée sur tissé mat blanc, et comporte cinq blocs d'information en Helvetica Neue 7pt : composition textile détaillée (pourcentages exacts, nommage par fibre — « 100% COTTON », « 80% COTTON / 20% POLYAMIDE », « 100% WOOL » pour les maille, « SHELL: 100% NYLON / LINING: 100% POLYESTER » pour les vestes), pays de fabrication (l'Italie, mais aussi, selon les revendeurs et la presse spécialisés, la Roumanie ou la Tunisie, par exemple), symboles de lavage ISO 3758 (5 pictogrammes), code saison (format 7 caractères, ex. « 10 0001 » où 10 = FW10, 0001 = référence modèle), et copyright « © Sportswear Company 20XX » (Sportswear Company étant la société mère italienne de Stone Island). Les contrefaçons trahissent plusieurs défauts : composition en pourcentages arrondis (« 80% COTTON » au lieu de « 80% COTTON / 20% POLYAMIDE »), copyright « © Stone Island » au lieu de « © Sportswear Company » (erreur fréquente), code saison incohérent avec le modèle (un sweat FW23 avec code « 05 XXXX » de 2005 est impossible).",
    steps: [
      {
        title: "Localiser l'étiquette sur la couture latérale gauche",
        description:
          "L'étiquette composition est cousue à l'intérieur du vêtement sur la couture latérale gauche, à hauteur de hanche. Sur les vestes doublées, elle peut être dans la poche intérieure ou au bas du dos.",
      },
      {
        title: "Vérifier la composition détaillée (pas arrondie)",
        description:
          "Une étiquette d'origine précise toujours chaque fibre avec son pourcentage exact. « 100% COTTON » seul, ou « 80% COTTON / 20% POLYAMIDE » avec les deux fibres. Une mention « 80% COTTON » sans le complément à 100 % est un signal fort.",
      },
      {
        title: "Lire le pays de fabrication sans conclure sur lui seul",
        description:
          "Le pays varie selon les pièces : l'Italie, mais aussi, selon les revendeurs et la presse spécialisés, la Roumanie ou la Tunisie, par exemple ; les sources divergent sur d'autres pays. Un pays inattendu est une question à poser au vendeur, pas une preuve : vérifiez le Certilogo si la pièce en porte un.",
      },
      {
        title: "Vérifier le copyright « © Sportswear Company »",
        description:
          "Stone Island est une marque détenue par Sportswear Company S.p.A. (rachetée par Moncler en 2021). Le copyright doit porter « © Sportswear Company 20XX » ou « © Sportswear Company Spa ». Un copyright « © Stone Island » est une erreur fréquente des faussaires.",
      },
      {
        title: "Lire le code saison (7 caractères)",
        description:
          "Format : 2 chiffres année + 4 chiffres référence + 1 lettre colorway. Ex. « 10 0001 W » = FW10, modèle 0001, colorway W. L'année doit correspondre à la saison du drop réel — incohérence = contrefaçon.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter « © Stone Island » au lieu de « © Sportswear Company »",
        description:
          "Les faussaires mettent logiquement « © Stone Island » en pensant bien faire. Mais la société mère légale est Sportswear Company — c'est cette mention qui figure. Un contrôle de 5 secondes, qui donne un signal d'alerte, pas une preuve à lui seul.",
      },
      {
        title: "Ignorer la cohérence code saison ↔ année de drop",
        description:
          "Un sweat FW23 acheté neuf ne peut pas avoir un code « 05 XXXX » (FW05) — ce serait une pièce vintage 2005 déstockée, ce qui est improbable. Vérifiez toujours la cohérence 2 chiffres année du code ↔ saison réelle.",
      },
      {
        title: "Oublier de vérifier la composition complète",
        description:
          "Une composition incomplète (« 80% COTTON » sans le complément à 100 %) est une erreur d'impression de contrefaçon. La réglementation textile européenne impose 100 % de la composition explicite.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires utilisent plusieurs raccourcis sur l'étiquette composition. Premier : ils omettent le copyright ou écrivent « © Stone Island » au lieu de « © Sportswear Company ». Deuxième : ils simplifient la composition en arrondissant (« 80% COTTON » au lieu de « 80% COTTON / 20% POLYAMIDE »). Troisième : ils utilisent un code saison générique recopié sur un produit officiel qu'ils fakent, sans vérifier la cohérence avec leur propre lot (résultat : des fakes du même modèle partagent le même code). Chacun de ces défauts est un signal d'alerte, à croiser avec les autres signaux de la pièce.",
    faqs: [
      {
        question: "Pourquoi le copyright indique-t-il « Sportswear Company » et pas « Stone Island » ?",
        answer:
          "Stone Island est une marque commerciale détenue par Sportswear Company S.p.A., société italienne fondée par Carlo Rivetti en 1982 (en même temps que la marque). Depuis décembre 2020, Sportswear Company est une filiale à 100 % du groupe Moncler. Le copyright d'une pièce Stone Island est toujours « © Sportswear Company 20XX » — c'est la société mère légale, propriétaire de la marque et des droits. Les contrefacteurs écrivent souvent « © Stone Island » par méconnaissance, pensant que c'est le nom légal. C'est un piège classique.",
      },
      {
        question:
          "Les pièces Stone Island vintage (avant 2010) ont-elles le même format d'étiquette ?",
        answer:
          "Non. Le format actuel (6×9 cm, Helvetica Neue, copyright Sportswear Company, code saison 7 caractères) est stabilisé depuis environ 2010-2012. Les pièces antérieures (1982-2009) ont des formats variables, souvent plus petits, avec des informations moins normées — certaines ne portent même pas de code saison explicite. Pour authentifier une pièce vintage, le Certilogo est absent (implanté en 2014) et les signaux principaux deviennent : badge compass (design légèrement différent selon décennie), boutons gravés (toujours présents), coutures d'assemblage, et compilation avec des archives photo (grailed.com, fishtail-parka.com archives, stoneislandarchives.com). Un vintage 1990 authentique est plus difficile à valider qu'une pièce moderne — privilégiez les vendeurs spécialisés archive.",
      },
    ],
  },
];
