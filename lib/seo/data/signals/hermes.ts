import type { GuideSignal } from "../../guide-types";

export const hermesSignals: GuideSignal[] = [
  {
    slug: "lettre-artisan",
    name: "Code artisan et millésime",
    brandSlug: "hermes",
    category: "bags",
    tagline: "Décoder la lettre d'année et le code artisan Hermès",
    intro:
      "Chaque sac Hermès (Birkin, Kelly, Constance, Evelyne) porte un code artisan et un code millésime embossés discrètement sur le cuir intérieur. Ce système, unique à Hermès, permet de tracer chaque sac à son atelier de production et à l'artisan qui l'a assemblé. Le code millésime est une lettre dans une forme géométrique (carré, cercle, aucune forme selon période) qui correspond à une année précise : carré A = 1997, carré B = 1998 jusqu'à Z = 2022, puis cycle avec cercle (W circle = 2011, T circle = 2014, D square = 2019, Z = 2022, U = 2023, B = 2024 selon grille Hermès). Le code artisan, généralement 2-3 lettres/chiffres, est propre à chaque atelier (Pantin, Pierre-Bénite, Bogny, Seloncourt etc.) et à chaque artisan. Les collectionneurs confirmés connaissent les correspondances et peuvent vérifier en quelques secondes si une année est cohérente avec le design du sac (une lettre B carrée = 1998 sur un Birkin au hardware palladium apparu en 2005 est une contrefaçon immédiate). L'embossage authentique est réalisé à chaud avec un outil en bronze, laissant une empreinte nette, profonde (0,4-0,6 mm), avec une légère empreinte brune autour du caractère (caramélisation du cuir tanné végétal). Les fakes reproduisent la lettre mais butent sur la forme géométrique (carré imparfait, cercle ovalisé), sur la profondeur d'embossage (trop superficiel ou trop profond), ou sur la cohérence millésime ↔ design du sac.",
    steps: [
      {
        title: "Localiser le code dans le sac",
        description:
          "Emplacements typiques : Birkin = patte cuir intérieure sous la fermeture, Kelly = intérieur près de la patte, Constance = dos du rabat intérieur. Cherchez 2-3 caractères embossés + une lettre dans une forme géométrique.",
      },
      {
        title: "Noter précisément lettre + forme géométrique",
        description:
          "Utilisez une loupe x5 et lumière rasante. Notez : lettre (A-Z), forme (carré, cercle, aucune). Exemple : « D carré » = 2019. Attention aux confusions O/0 (0 n'est pas utilisé pour millésime, uniquement lettres).",
      },
      {
        title: "Décoder le millésime via grille officielle",
        description:
          "Grille Hermès publique (disponible sur PurseForum, Authentic4U) : carré A (1997) à Z (2022), cercle W (2011) à T (2014), puis nouveau cycle depuis 2023. Vérifiez correspondance.",
      },
      {
        title: "Cross-check avec design du sac",
        description:
          "Chaque design/hardware est daté. Un Birkin hardware palladium = depuis 2005. Un Kelly Touch (cuir + crocodile) = depuis 2016. Une lettre millésime avant ces dates sur ces designs = contrefaçon.",
      },
      {
        title: "Identifier l'atelier via code artisan",
        description:
          "Le code artisan (2-3 caractères avant/après la lettre millésime) est propre à chaque atelier. Communautés d'authentification maintiennent des listes. Code inconnu ou incohérent avec pays d'origine affiché = alerte.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre forme géométrique carrée et rectangulaire",
        description:
          "Le carré Hermès est strictement carré (côtés égaux). Un rectangle (côtés inégaux) n'existe PAS dans la grille Hermès — c'est un fake avec outillage imprécis. Mesurez les côtés à la loupe pour confirmer.",
      },
      {
        title: "Accepter une lettre sans forme sur post-2022 pur",
        description:
          "Depuis 2023, Hermès utilise un nouveau système sans forme géométrique (simplement une lettre dans un cartouche simplifié). Un sac « 2024 » avec lettre dans un carré traditionnel est suspect (ne suit pas la nouvelle nomenclature) — à vérifier avec Hermès direct.",
      },
      {
        title: "Ignorer la position exacte du code",
        description:
          "La position du code varie selon modèle mais reste cohérente par modèle. Un Birkin avec code dans une position non-standard (par exemple sur la couture extérieure au lieu de l'intérieur) révèle soit un sac reconstitué, soit un fake avec code mal positionné.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme (« Super Fake » industry de Shenzhen) embossent des codes avec des outils quasi-identiques, respectant la forme et la profondeur. Le défaut : la couleur du cuir autour du code. Hermès utilise un cuir tanné végétal qui caramélise légèrement à la chaleur (halo brun-doré de 0,2-0,3 mm autour de chaque caractère). Les cuirs fakes (tannage chimique chinois) ne caramélisent pas — pas de halo. À la loupe x10, le code fake est « propre » (pas de halo) alors que l'authentique présente cet halo caramélisé. Autre tactique : embossage avec outil CNC moderne qui produit des caractères ultra-nets mais trop parfaits. Le code Hermès authentique est réalisé à la main par l'artisan avec un outil chauffé — présente une légère irrégularité humaine (variation de 0,1-0,2 mm dans la profondeur). Trop de perfection est suspect.",
    faqs: [
      {
        question: "Pourquoi les codes Hermès changent-ils de système ?",
        answer:
          "Hermès a modifié sa nomenclature pour simplifier la traçabilité et passer à un système digital. De 1945 à 1970 : pas de code. 1971-1996 : lettre dans cercle. 1997-2014 : lettre dans carré. 2015-2022 : lettre dans carré (cycle A-Z rénové). Depuis 2023 : nouveau système avec cartouche simplifié lié à une base de données digitale. Chaque transition est documentée. Un sac ancien doit suivre le système de son époque — un système anachronique = fake.",
      },
      {
        question: "Un sac sans code artisan peut-il être authentique ?",
        answer:
          "Oui, pour les sacs pré-1945. Avant 1945, Hermès ne systématisait pas le codage. Les pièces vintage de la Belle Époque (1880-1914) ou Art Déco (1920-1940) peuvent être authentiques sans code — l'authentification repose alors sur la qualité des matériaux, la couture sellier main, et la provenance documentée. En revanche, un sac post-1945 sans code est très suspect — c'est un standard de production Hermès depuis cette date.",
      },
    ],
  },
  {
    slug: "coutures-sellier",
    name: "Point sellier",
    brandSlug: "hermes",
    category: "bags",
    tagline: "Reconnaître la couture sellier main (saddle stitch) Hermès",
    intro:
      "Le point sellier (saddle stitch en anglais) est la technique de couture main signature d'Hermès, utilisée depuis les origines de la maison en 1837. Contrairement à une couture machine qui utilise un seul fil verrouillé avec un fil inférieur, le point sellier emploie deux aiguilles qui se croisent dans chaque trou, chacune tirant un brin de fil en direction opposée. Le résultat est une couture d'une résistance et d'une esthétique incomparables : si un brin casse, l'autre tient — contrairement à une couture machine où un seul brin rompu « déroule » toute la ligne. Visuellement, le point sellier Hermès présente des caractéristiques très précises : 1) chaque point est légèrement oblique (angle de 45-60° par rapport à la ligne de couture), avec une alternance parfaite d'un point oblique vers la gauche puis vers la droite ; 2) espacement de 7-9 points par pouce (2,54 cm) sur les sacs de ville, 5-7 points par pouce sur les articles structurés ; 3) fil ciré de lin poli à la main, finition mate sans brillant ; 4) tension uniforme avec un léger serrage au point, donnant un effet « en relief » perceptible au toucher. Chaque artisan Hermès met 15-25 heures pour assembler un Birkin entièrement à la main. Un Birkin machine-cousu n'existe PAS chez Hermès authentique. Les fakes « Super Fake » imitent visuellement le point oblique avec des machines spécialisées mais butent sur l'irrégularité humaine : les points fakes sont TROP RÉGULIERS (exactement le même angle, exactement la même distance), alors que les points Hermès authentiques présentent une légère variation humaine (angle de 50° ±5°, distance 3,1 mm ±0,2 mm) révélatrice d'un travail main.",
    steps: [
      {
        title: "Photographier la couture en macro",
        description:
          "Mode macro smartphone ou loupe x10 posée sur le cuir. Lumière tangentielle pour révéler le relief des points. Zones à inspecter : anses, pattes de fermeture, contour du rabat.",
      },
      {
        title: "Vérifier l'obliquité alternée des points",
        description:
          "Point 1 = oblique vers la gauche (45-60°), point 2 = oblique vers la droite, point 3 = gauche, etc. L'alternance doit être parfaite et visible à l'œil nu. Une couture où tous les points pointent dans la même direction = couture machine = fake.",
      },
      {
        title: "Compter les points par pouce",
        description:
          "7-9 points/inch sur sac de ville Hermès. Fakes : souvent 10-12 points/inch (couture machine plus serrée) ou 5-6 points/inch (couture main bâclée). Plage authentique précise.",
      },
      {
        title: "Vérifier la tension et le relief",
        description:
          "Passez l'ongle sur la couture : relief tactile net, fil légèrement serré dans le cuir. Une couture à plat (fil noyé dans le cuir, pas de relief) trahit une couture machine à haute tension.",
      },
      {
        title: "Chercher les micro-irrégularités humaines",
        description:
          "Les points Hermès ont une variation de ±5° d'angle et ±0,2 mm de distance (artisan main). Les points fakes sont trop parfaits (variation < 1° et < 0,05 mm). Paradoxalement, trop de perfection = machine = fake.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre point sellier et point sellier imité",
        description:
          "Certaines marques (Bottega Veneta, Massimo Dutti) imitent visuellement le point sellier avec des machines spéciales. Sur une pièce non-Hermès, le point peut sembler « sellier » sans être main. Vérifiez d'abord que la pièce est marquée Hermès avant d'appliquer les critères.",
      },
      {
        title: "Rejeter un point parfaitement régulier comme toujours machine",
        description:
          "Certains artisans Hermès expérimentés (20+ ans d'ancienneté) produisent des coutures très régulières, presque parfaites. Cette perfection est toléree si d'autres indicateurs (cuir, odeur, hardware) sont cohérents. L'irrégularité humaine est un signal, mais son absence seule ne condamne pas — pondération nécessaire.",
      },
      {
        title: "Tester sur une zone non-exposée (doublure)",
        description:
          "La doublure intérieure Hermès est parfois cousue à la machine (fonctionnel, non-visible). Testez la couture EXTÉRIEURE principale (anses, contour) qui est systématiquement cousue main sur Birkin/Kelly authentique.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires « Super Fake » emploient des artisans formés au point sellier main — certains sont d'anciens employés d'ateliers asiatiques travaillant pour marques de luxe. Leur travail imite le saddle stitch avec un degré de ressemblance élevé. Le défaut résiduel : le fil utilisé. Hermès utilise un fil de lin ciré à la main dans sa propre filature, teint par bain végétal (pas synthétique). Les fakes utilisent du fil polyester ciré qui imite l'aspect mais : 1) plus brillant sous lumière UV, 2) plus résistant aux solvants (test alcool ménager), 3) plus fin (0,4-0,5 mm vs 0,6-0,7 mm Hermès). Le test d'alcool : passer légèrement un coton imbibé d'alcool sur la couture. Fil Hermès lin ciré = aucun changement. Fil polyester fake = légère dissolution de la cire, aspect qui change subtilement.",
    faqs: [
      {
        question: "Tous les sacs Hermès sont-ils entièrement cousus main ?",
        answer:
          "Non. Birkin, Kelly, Constance, Bolide, Halzan sont entièrement cousus main (point sellier) — ce sont les pièces signatures qui justifient le prix et le délai de livraison. En revanche, certaines pièces moins structurées (Evelyne, Garden Party, Picotin) utilisent une couture main partielle + couture machine pour les zones non-visibles, ce qui est normal et authentique. Vérifiez sur hermes.com les spécifications de votre modèle avant d'appliquer les critères.",
      },
      {
        question: "Une couture sellier peut-elle casser sur un Birkin authentique ?",
        answer:
          "Extrêmement rare. Le point sellier est conçu pour durer 50+ ans. Une couture cassée sur un Birkin < 20 ans révèle soit un dommage exceptionnel (accroc violent), soit une contrefaçon. Hermès propose un service de réparation gratuit à vie pour ses pièces authentiques — si la couture casse, faites réparer en boutique Hermès, ce qui confirmera l'authenticité par la même occasion.",
      },
    ],
  },
  {
    slug: "clochette-cadenas",
    name: "Clochette et cadenas",
    brandSlug: "hermes",
    category: "bags",
    tagline: "Authentifier le cadenas numéroté et la clochette cuir Hermès",
    intro:
      "Le cadenas en laiton doré numéroté et la clochette en cuir qui le contient (ou le tient en pendentif) sont deux accessoires signatures du Birkin et du Kelly. Le cadenas est massif (30-35 g), en laiton plaqué or 24 carats ou palladium, avec un numéro à 5 chiffres gravé sur la base qui correspond exactement au numéro gravé sur les 2 clés livrées (petite pochette de flanelle fermée par cordon). La clochette est en cuir de même type et même couleur que le sac (Togo, Epsom, Clémence, Swift), épaisseur 2,5-3 mm, forme triangulaire évasée, contenant les deux clés attachées par un ruban cuir. Ces éléments, vendus séparément sur marché noir à 200-500 € l'unité, sont une cible des faussaires qui les produisent pour compléter des sacs fakes reconstitués. Tests physiques : 1) poids du cadenas = 30-35 g sur balance de précision ; 2) gravure « HERMÈS » sur la face verticale du cadenas, embossée à froid avec une profondeur constante ; 3) numéro à 5 chiffres sur la base, identique aux clés ; 4) clochette en cuir avec couture sellier main (4-5 points par cm) et arête vive (pas arrondie) ; 5) les 2 clés s'insèrent et tournent sans accrochage, avec un mécanisme ferme. Un cadenas qui ne tourne pas, deux clés qui ne s'insèrent qu'à moitié, ou une clochette en cuir plastique-synthétique = fake.",
    steps: [
      {
        title: "Peser le cadenas isolé",
        description:
          "Sur balance précision 0,1 g. Cadenas Hermès authentique = 30-35 g (variations selon modèle). Fake acier creux = 18-25 g. Fake laiton léger = 26-28 g. Hors plage = signal.",
      },
      {
        title: "Lire la gravure « HERMÈS »",
        description:
          "Face verticale du cadenas : « HERMÈS » en majuscules serif, gravure embossée à froid. Vérifiez accent aigu sur le E (« É »). Un « HERMES » sans accent = fake US-marketing fake.",
      },
      {
        title: "Vérifier le numéro sur base + clés",
        description:
          "Base du cadenas : 5 chiffres embossés. Chaque clé porte le MÊME numéro embossé. Le différentiel d'un seul chiffre = fake ou assemblage reconstitué.",
      },
      {
        title: "Tester le mécanisme",
        description:
          "Insérez une clé : doit entrer complètement sans forcer. Tournez : résistance ferme mais fluide, ouverture nette. Refermez : clic sonore net. Un mécanisme qui grippe, qui tourne mollement ou qui ne clique pas = fake.",
      },
      {
        title: "Examiner la clochette cuir",
        description:
          "Forme triangulaire évasée, hauteur ~7-8 cm, épaisseur cuir 2,5-3 mm. Couture sellier main avec 4-5 points par cm. Arête vive (pas arrondie). Cuir de même référence que le sac (vérifier couleur + texture).",
      },
    ],
    commonErrors: [
      {
        title: "Croire qu'un cadenas qui ne ferme plus = toujours fake",
        description:
          "Un mécanisme qui bloque après 20+ ans d'usage peut être dû à la poussière, l'oxydation ou un défaut de maintenance. Nettoyez avec brosse souple + huile fine (3-en-1) avant de conclure. Un cadenas propre récemment et qui bloque = suspect. Un cadenas vieilli visiblement et qui bloque = maintenance.",
      },
      {
        title: "Accepter des clés qui « tournent à moitié »",
        description:
          "Les clés Hermès doivent tourner à 180° nets. Une clé qui tourne à 90° seulement, ou qui se coince à mi-course, révèle soit un mécanisme usé (acceptable sur vintage), soit une clé non-assortie au cadenas (fake ou assemblage).",
      },
      {
        title: "Valider sur un seul élément",
        description:
          "Cadenas + clochette + clés = trio inséparable. Un cadenas authentique vendu seul (sans clochette ni clés) sur marché secondaire est suspect — souvent volé en atelier ou récupéré sur sac fake cassé. Pour authentifier le sac complet, l'ensemble doit être cohérent.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires produisent des cadenas fake en laiton réel avec gravure quasi-parfaite — le défaut est dans le mécanisme interne. Hermès utilise un pêne à pistons de précision horlogère (fabrication atelier spécifique). Les fakes utilisent un mécanisme standard acheté en Chine avec 4-5 pistons au lieu de 6 chez Hermès — résultat : le mécanisme fake est plus « sec », moins fluide, et peut être ouvert avec un crochet de serrurier en 30 secondes alors qu'un cadenas Hermès authentique résiste 5-10 minutes à un professionnel. Test pratique : demander à un serrurier local d'ouvrir le cadenas sans clé. Authentique = très difficile. Fake = facile. Cette méthode est destructrice néanmoins — à utiliser seulement comme confirmation finale.",
    faqs: [
      {
        question: "Puis-je remplacer un cadenas Hermès perdu ?",
        answer:
          "Oui, via le service Hermès. Apportez votre Birkin/Kelly en boutique — ils commandent un cadenas de remplacement pour ~200-300 €, avec numéro correspondant au sac (vérification internet Hermès des cahiers de production). Un cadenas de remplacement officiel Hermès est authentique et complète votre sac. Évitez absolument les cadenas « de remplacement » achetés sur eBay ou Vestiaire — ce sont des fakes.",
      },
      {
        question: "La clochette cuir peut-elle être d'une couleur différente du sac ?",
        answer:
          "Non. Hermès assortit systématiquement la clochette au cuir et à la couleur du sac. Un Birkin Togo Noir = clochette Togo Noir. Un Kelly Epsom Rouge H = clochette Epsom Rouge H. Une clochette dépareillée (cuir ou couleur différente) = clochette remplacée (perdue + remplacée par non-Hermès) ou sac reconstitué fake. Demandez au vendeur l'origine de la clochette si discordante.",
      },
    ],
  },
  {
    slug: "sangles-cuir",
    name: "Cuirs Togo / Epsom / Clémence / Swift",
    brandSlug: "hermes",
    category: "bags",
    tagline: "Identifier les cuirs signatures Hermès et leurs propriétés",
    intro:
      "Hermès utilise une quinzaine de cuirs différents sur ses sacs, chacun avec des propriétés physiques distinctes qui permettent une identification rapide. Les 4 cuirs les plus courants sur Birkin et Kelly modernes sont : Togo (cuir de veau à gros grain, texture en « peau d'orange » prononcée, résistant aux rayures, souple mais tenu), Epsom (cuir de veau pressé à grain fin uniforme, très rigide, tenue structurée, résistant à l'eau), Clémence (cuir de vachette grainé doux, légèrement plus mou que Togo, grain un peu plus étalé), Swift (cuir de veau lisse à grain fin, extrêmement lisse, absorbe la lumière). Chaque cuir se reconnaît en 10 secondes visuellement et tactilement. Les contrefaçons utilisent soit du split leather (face inférieure du cuir vachette) qui imite grossièrement le grain, soit du cuir tanné chimiquement en Chine avec un grain embossé artificiellement. Les défauts signatures : grain Togo fake aligné en rangées (authentique = grain aléatoire), grain Epsom fake trop régulier (authentique = micro-irrégularités visibles à loupe x10), Clémence fake trop mou (s'affaisse quand on pose le sac), Swift fake trop brillant (authentique = mat avec reflets doux). Tests tactiles et visuels croisés tranchent en 2 minutes.",
    steps: [
      {
        title: "Identifier le cuir annoncé (facture, listing)",
        description:
          "Le vendeur doit indiquer le cuir (Togo, Epsom, Clémence, Swift, ou autre). Si non-indiqué, exigez cette info avant achat. Hermès référence systématiquement le cuir pour chaque commande — son absence = signal de désinformation.",
      },
      {
        title: "Observer le grain visuellement",
        description:
          "Togo = peau d'orange visible, grain 1-2 mm. Epsom = grain serré régulier, 0,3-0,5 mm. Clémence = grain plus grand et plus étalé que Togo, 1,5-2,5 mm. Swift = grain quasi-invisible, surface très lisse. Photographiez en macro pour confirmer.",
      },
      {
        title: "Tester la rigidité / souplesse",
        description:
          "Togo = souple et tenu. Epsom = rigide, presque cartonné. Clémence = plus mou que Togo. Swift = souple et lisse. Posez le sac vide et observez la tenue : un Birkin Epsom doit se tenir droit sans s'affaisser, un Birkin Clémence s'affaisse légèrement, un Birkin Togo tient entre les deux.",
      },
      {
        title: "Vérifier l'absence d'alignement artificiel du grain",
        description:
          "Le cuir authentique a un grain aléatoire (produit par la peau naturelle). À la loupe x10, aucun alignement strict. Un grain aligné en rangées régulières (comme un damier ou des lignes parallèles) trahit un embossage industriel = fake.",
      },
      {
        title: "Test d'odeur et patine",
        description:
          "Cuirs Hermès = odeur douce, légèrement cireuse (finition main), discrète. Les cuirs tannés chimiquement = odeur piquante. Sur paires portées, la patine Hermès est noble (légère brillance des zones de friction, couleur stable). Les fakes développent des zones décolorées ou craquelures prématurées.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre Togo et Clémence au toucher",
        description:
          "Togo et Clémence ont un grain similaire mais des tailles différentes (Togo plus serré). Confusion fréquente. Clémence est aussi légèrement plus mou et a un grain plus « rond ». Mesurez à la loupe : grain Togo = 1-2 mm, Clémence = 1,5-2,5 mm. Tactilement, Togo a plus de résistance à la pression du doigt.",
      },
      {
        title: "Croire qu'un cuir lisse = toujours Swift",
        description:
          "D'autres cuirs Hermès sont lisses (Box calf, Chèvre Mysore). Swift est spécifique : lisse avec un effet velouté subtil. Box calf est lisse avec un effet brillant. Chèvre Mysore est lisse mat. Vérifiez la référence cuir annoncée avant de conclure.",
      },
      {
        title: "Rejeter des micro-variations comme fake",
        description:
          "Le cuir naturel a des micro-variations (légères nuances de couleur entre zones, micro-imperfections de grain). C'est un signe d'authenticité. Un cuir PARFAITEMENT uniforme, sans aucune variation, est suspect (probable cuir synthétique ou cuir pressé industriellement).",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme (« Super Fake » Hermès de Guangzhou) importent du cuir italien ou français de haute qualité et le traitent avec des procédés d'embossage qui imitent le grain Togo ou Epsom. Le résultat visuel est proche — le défaut est dans la souplesse et la réaction thermique. Les cuirs Hermès sont tannés végétalement avec des extraits de Quebracho et Mimosa — ils développent une micro-élasticité unique, où la pression du doigt laisse une empreinte qui disparaît en 2-3 secondes (mémoire de forme). Les cuirs fakes (tannage chrome rapide chinois) gardent l'empreinte 5-10 secondes, ou ne réagissent pas du tout (trop rigide). Ce test de mémoire de forme (presser fermement avec le pouce, chronométrer le retour à forme normale) est imparable et prend 10 secondes.",
    faqs: [
      {
        question: "Comment demander le cuir de mon Birkin sans l'avoir en main ?",
        answer:
          "Si vous achetez sur plateforme revente (Vestiaire, TRR, Sotheby's), le listing doit indiquer le cuir précis (Togo, Epsom, etc.). Si absent, demandez via la messagerie intégrée. Pour un sac déjà possédé mais dont vous ne connaissez pas le cuir : photographiez-le et soumettez à un expert d'authentification (LegitVision, Bababebi, Reetzy) — ils identifient le cuir avec 99 % de fiabilité. Hermès boutique peut aussi identifier gratuitement en présentant le sac.",
      },
      {
        question: "Un même modèle peut-il exister en plusieurs cuirs ?",
        answer:
          "Oui, fréquemment. Un Birkin 30 existe en Togo, Epsom, Clémence, Swift, Box calf, Chèvre, Ostrich, Crocodile, Alligator selon demande et disponibilité. Le prix varie de 12 000 € (Togo) à 150 000 € (Crocodile Himalaya). Un vendeur qui dit « Birkin 30 » sans préciser le cuir cache probablement un cuir de moins bonne réputation (Clémence moins demandé que Togo) ou tente de passer un fake. Exigez la précision avant achat.",
      },
    ],
  },
  {
    slug: "code-date",
    name: "Code date Hermès",
    brandSlug: "hermes",
    category: "bags",
    tagline: "Interpréter les codes date Hermès carré, cercle et post-2022",
    intro:
      "Le système de datation Hermès a évolué en 4 périodes distinctes depuis 1945, chacune avec sa nomenclature spécifique. Période 1 (1945-1970) : aucun code systématique, datation par contexte (design, signature artisan). Période 2 (1971-1996) : une lettre A-Z dans un CERCLE, cycle de 26 ans (A cercle = 1971, Z cercle = 1996). Période 3 (1997-2014) : une lettre A-Z dans un CARRÉ, cycle de 18 ans incomplet (A carré = 1997, R carré = 2014). Période 4 (2015-2022) : lettre A-Z dans un CARRÉ reprise d'un nouveau cycle (A carré 2015 = attention, distinct du A carré 1997 par contexte design). Période 5 (depuis 2023) : nouveau système avec cartouche simplifié sans forme géométrique, lié à une base de données numérique Hermès. Ces transitions sont documentées sur PurseForum, Hermès Addict, Bababebi. La confusion typique : un A carré peut être 1997 OU 2015 — discriminer nécessite de croiser avec le design du sac (un Birkin Swift = après 2006, donc A carré sur Swift = 2015, pas 1997). Les contrefacteurs commettent deux erreurs majeures : 1) utiliser une lettre avec forme incohérente au design (A cercle = 1971, sur un Birkin 30 apparu en 1984 = fake), 2) reproduire approximativement la forme (carré pas parfaitement carré, cercle ovalisé). Ces erreurs tranchent 50 % des fakes.",
    steps: [
      {
        title: "Localiser le code date",
        description:
          "Emplacement standard : patte cuir intérieure discrète, sous une couture ou rabat. Sur Birkin = patte courte intérieure droite. Sur Kelly = patte intérieure gauche. Sur Constance = dos du rabat intérieur.",
      },
      {
        title: "Noter lettre + forme géométrique",
        description:
          "Exemple : « D carré ». Attention : la forme doit être parfaitement géométrique. Un « carré » imparfait (côtés de longueurs différentes) = fake avec outillage imprécis.",
      },
      {
        title: "Décoder via grille publique",
        description:
          "Grille disponible sur PurseForum et Bababebi. Exemple de correspondances : M carré = 2009 ou 2022 (selon cycle), T cercle = 2014, B cercle = 1998, K carré = 2020. Cross-check avec design.",
      },
      {
        title: "Vérifier cohérence code ↔ design",
        description:
          "Chaque design a une date de lancement. Un A cercle = 1971 sur Birkin (lancé 1984) = impossible = fake. Un Swift = post-2006, donc codes pré-2006 sur Swift = fake.",
      },
      {
        title: "Confirmer avec code artisan et pays",
        description:
          "Le code artisan (2-3 caractères) identifie l'atelier. Pantin, Pierre-Bénite, Bogny sont en France. Un « Made in France » avec code artisan inconnu des bases Hermès France = suspect.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre A carré 1997 et A carré 2015",
        description:
          "Les deux existent (cycles rénovés). Discriminer par design : Epsom commercial = après 2003, donc A carré sur Epsom = 2015, pas 1997. Birkin Touch = après 2016, donc A carré sur Birkin Touch = impossible (2015 < 2016) = fake.",
      },
      {
        title: "Ignorer le nouveau système post-2023",
        description:
          "Depuis 2023, Hermès utilise un cartouche simplifié SANS forme géométrique. Un sac « neuf 2024 » avec une lettre dans carré traditionnel est suspect — ne suit pas la nouvelle nomenclature. Confirmer avec boutique Hermès.",
      },
      {
        title: "Accepter une forme imparfaite comme tolérance",
        description:
          "Hermès produit ses codes avec outillage de précision horlogère. Un carré strictement carré, un cercle strictement rond. Une forme imparfaite (carré trapézoïdal, cercle ovale) trahit un outillage fake — pas de « tolérance artisanale » sur cet aspect précis.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires consultent les grilles publiques de correspondance lettre ↔ année et choisissent un code cohérent avec le modèle qu'ils contrefaçonnent. Le défaut : ils utilisent des outils d'embossage imprécis. La forme géométrique (carré ou cercle) est presque toujours imparfaite à la loupe x10. Un carré Hermès authentique a des angles parfaitement à 90° et des côtés strictement égaux (±0,05 mm). Un carré fake présente des angles légèrement arrondis (outil non chauffé assez) ou des côtés inégaux (outil mal aligné). Autre tactique 2024 : reproduire le nouveau système post-2023 (cartouche simplifié). Mais les faussaires ne connaissent pas la base de données Hermès liée à ces nouveaux codes — un scan en boutique Hermès révélera immédiatement le fake. Pour les pré-2023, le test visuel de forme géométrique reste le plus rapide.",
    faqs: [
      {
        question: "Un code sans forme géométrique est-il toujours fake ?",
        answer:
          "Pas nécessairement. Les Hermès pré-1971 n'avaient pas de forme géométrique. Les Hermès post-2023 utilisent un cartouche simplifié (pas de forme carré/cercle). Entre 1971 et 2022, la forme est obligatoire. Un sac Birkin « 2024 » sans forme = cohérent nouveau système. Un sac Birkin « 2018 » sans forme = fake. Datez d'abord le sac par design avant de juger l'absence/présence de forme.",
      },
      {
        question: "Hermès remplace-t-il un code effacé par usure ?",
        answer:
          "Non. Hermès ne remplace JAMAIS les codes date. Un sac ancien avec code effacé reste authentique si les autres indicateurs (cuir, coutures, hardware) le confirment — mais sa valeur revente diminue légèrement sans cohérence temporelle prouvable. Des vendeurs peu scrupuleux peuvent « rafraîchir » un code en le ré-embossant — détectable à la loupe x10 par la présence d'une DOUBLE empreinte (ancien code effacé + nouveau code par-dessus). Rejet immédiat.",
      },
    ],
  },
];
