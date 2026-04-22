import type { GuideSignal } from "../../guide-types";

export const diorSignals: GuideSignal[] = [
  {
    slug: "code-date",
    name: "Code date Dior",
    brandSlug: "dior",
    category: "bags",
    tagline: "Décoder le code date Dior XX-MM-YY embossé",
    intro:
      "Christian Dior marque chaque sac d'un code date embossé discrètement sur une patte de cuir intérieure, généralement cachée sous une couture ou à l'intérieur d'un rabat. Le format post-2003 est XX-MM-YY : 2 lettres (code atelier) + 2 chiffres (mois) + 2 chiffres (année). Exemple : « MA-12-19 » = atelier MA, décembre 2019. Les lettres d'atelier les plus courantes : MA et BO (France, Italie principalement), 07/08 (ateliers italiens Milano). Les pré-2003 utilisaient un format différent (4-6 chiffres sans lettres). Tous les Dior Lady Dior, Book Tote, Saddle, 30 Montaigne modernes portent ce code. Les contrefaçons trahissent trois erreurs : 1) code inventé avec lettres d'atelier inconnues (« XZ-01-22 » — aucun atelier Dior ne commence par XZ), 2) incohérence modèle ↔ date (un 30 Montaigne marqué « 05-15 » = mai 2015, impossible car le 30 Montaigne a été lancé en 2019), 3) embossage superficiel (< 0,2 mm) ou imprimé à l'encre (pas embossé). Ce contrôle prend 2 minutes et élimine 40 % des fakes Dior bas et moyen de gamme. Pour les sacs Lady Dior vintage (pré-2010), le code peut être une séquence numérique simple — ne pas exiger le format XX-MM-YY sur ces pièces.",
    steps: [
      {
        title: "Localiser la patte de code",
        description:
          "Emplacement standard : patte cuir intérieure sur doublure, souvent sous une couture cachée. Lady Dior = intérieur du rabat haut. Book Tote = poche intérieure zippée. Saddle = dos de la patte de sangle.",
      },
      {
        title: "Lire le format XX-MM-YY",
        description:
          "2 lettres + tiret + 2 chiffres + tiret + 2 chiffres (8 caractères total avec tirets). Utilisez loupe x5. Attention confusion 0/O : O n'apparaît que dans les lettres d'atelier, pas dans les chiffres mois/année.",
      },
      {
        title: "Vérifier les lettres d'atelier",
        description:
          "Lettres communes : MA, BO, 07, 08, 11, 12. Listes complètes documentées sur Authentic4U et PurseForum. Une lettre d'atelier inconnue = alerte forte.",
      },
      {
        title: "Cross-check modèle ↔ date de lancement",
        description:
          "Chaque modèle a une date de lancement : Lady Dior = 1994, Saddle = 2000 (relancé 2018), Book Tote = 2018, 30 Montaigne = 2019. Code antérieur à date de lancement = fake immédiat.",
      },
      {
        title: "Contrôler la profondeur d'embossage",
        description:
          "Embossage à chaud 0,3-0,5 mm, caractères Helvetica Medium nets. Un embossage superficiel, flou, ou une impression à l'encre = fake.",
      },
    ],
    commonErrors: [
      {
        title: "Chercher le format XX-MM-YY sur pré-2003",
        description:
          "Avant 2003, Dior utilisait un format numérique plus simple (4-6 chiffres). Un sac vintage 1995 sans format XX-MM-YY est cohérent avec son époque. N'exigez pas le format moderne sur vintage.",
      },
      {
        title: "Accepter 3 lettres d'atelier",
        description:
          "Le format est STRICTEMENT 2 lettres + date. Un code à 3 lettres (« MAX-12-19 ») ou 1 seule lettre (« M-12-19 ») est une invention fake. Rejet immédiat.",
      },
      {
        title: "Ignorer l'alignement des tirets",
        description:
          "Les tirets séparateurs sont parfaitement alignés horizontalement avec le reste du code (même hauteur). Un tiret décalé verticalement (au-dessus ou en-dessous de la ligne de base) révèle un outillage fake imprécis.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires génèrent des codes cohérents (format correct + lettres valides + date plausible) mais butent sur l'embossage. Dior utilise un embossage à chaud à 160-180°C qui caramélise légèrement le cuir autour des caractères (halo brun-doré 0,2-0,3 mm). Les fakes utilisent un embossage à froid ou un embossage chaud mal calibré — pas de halo, ou un halo brûlé trop foncé (cuir noirci autour). À la loupe x10, le halo Dior authentique est doré-orangé ; le halo fake est noir carbonisé ou absent. Ce défaut est systématique sur fakes moyens et élimine efficacement les contrefaçons du marché secondaire.",
    faqs: [
      {
        question: "Le code date Dior peut-il s'effacer avec l'âge ?",
        answer:
          "Très peu. L'embossage à chaud sur cuir est durable 15-20 ans sans effacement notable. Un code effacé sur sac < 10 ans révèle soit un cuir fake bas de gamme qui se dégrade, soit un code volontairement abrasé pour masquer une contrefaçon. Signal fort dans les deux cas.",
      },
      {
        question: "Dior utilise-t-il un autre système de traçabilité ?",
        answer:
          "Oui, depuis 2023 : puce NFC intégrée sur certains modèles premium (Lady Dior, Book Tote). Scannable via l'app Dior (service en développement). Les codes embossés continuent d'exister en parallèle. Un sac Dior post-2023 modèle premium sans puce NFC est suspect. Vérifiez avec boutique Dior.",
      },
    ],
  },
  {
    slug: "cannage-matelasse",
    name: "Matelassage cannage",
    brandSlug: "dior",
    category: "bags",
    tagline: "Reconnaître le matelassage cannage Dior : losanges, coutures, rembourrage",
    intro:
      "Le cannage est le matelassage signature de Dior depuis 1994 avec le Lady Dior — un motif inspiré des chaises Napoléon III utilisées lors des défilés Dior. Il consiste en un quadrillage de losanges matelassés (différent du diamond quilting Chanel par son aspect plus géométrique et moins prononcé). Sur un Lady Dior Medium (24 cm), la face avant compte 4×4 losanges = 16 losanges visibles, chacun mesurant environ 50×50 mm (losanges plus grands que Chanel à 25×20 mm). Sur Lady Dior Mini (17 cm) : 3×3 = 9 losanges. Sur Lady Dior Large (32 cm) : 5×5 = 25 losanges. Ces comptages sont strictement respectés par Dior et vérifiables en 1 minute. La couture aux intersections forme un losange fin sans rembourrage creux (contrairement aux intersections Chanel en X). Le rembourrage interne des losanges Dior est en ouate synthétique dense. Les fakes trahissent : nombre de losanges incorrect (5×4 au lieu de 4×4 sur Medium), dimensions décalées (55×45 mm au lieu de 50×50 mm strictement carré), couture aux intersections fluctuante. Test rapide : compter 4×4 sur Lady Dior Medium avec dimensions 50×50 mm tranche en 90 secondes.",
    steps: [
      {
        title: "Compter les losanges face avant",
        description:
          "Sur Lady Dior Medium : 4×4 = 16 losanges. Lady Dior Mini : 3×3. Lady Dior Large : 5×5. Book Tote et autres modèles : différent. Vérifier grille selon modèle exact (dior.com).",
      },
      {
        title: "Mesurer un losange isolé",
        description:
          "Avec réglet : côtés ≈ 50 mm × 50 mm (carré parfait) sur Lady Dior Medium. Dimensions variables selon modèle mais TOUJOURS parfaitement carrées. Un losange rectangulaire (50×45) = fake.",
      },
      {
        title: "Vérifier la symétrie des 4 côtés",
        description:
          "Chaque losange est carré strict (tolérance ±1 mm). Pas de losange trapézoïdal. Pas de variation entre losanges (ex : 3 losanges à 50 mm et 1 à 48 mm = fake avec tension couture inégale).",
      },
      {
        title: "Inspecter les coutures d'intersection",
        description:
          "Aux intersections, la couture forme un petit losange fin (pas de rembourrage gonflé). Différent de Chanel qui a un X couture. Un X Chanel-style sur un cannage Dior = confusion fake.",
      },
      {
        title: "Tester la fermeté du rembourrage",
        description:
          "Pressez un losange : résistance ferme, retour à forme bombée. Un losange mou qui s'aplatit et reste plat = rembourrage insuffisant (fake).",
      },
    ],
    commonErrors: [
      {
        title: "Confondre cannage et quilting classique",
        description:
          "Le cannage Dior a des losanges plus grands et plus géométriques que le quilting Chanel. Appliquer les critères Chanel (losanges 25×20 mm) sur un Dior = erreur. Chaque marque a sa grille.",
      },
      {
        title: "Accepter un cannage détendu",
        description:
          "Le cannage Dior reste ferme 10+ ans avec usage normal. Un cannage aplati après 2-3 ans = rembourrage fake qui s'est tassé. Pas de « patine naturelle » qui détend le matelassage.",
      },
      {
        title: "Ignorer le comptage au profit du visuel",
        description:
          "Comptage strict par modèle. Un « Lady Dior Medium » avec 5×4 au lieu de 4×4 = fake structurel. Pas de variation tolérée dans le nombre de losanges.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent le cannage avec des machines à matelasser industrielles qui respectent le quadrillage et les dimensions globales. Le défaut : la tension des coutures. Dior utilise une machine à matelasser propriétaire qui applique une tension constante et parfaite. Les machines fakes ont des variations de tension : certains losanges plus tendus (presque plats), d'autres plus relâchés (très gonflés). À l'œil nu, le cannage authentique a une homogénéité parfaite, le fake présente des irrégularités visibles. Test : balayer du regard à 50 cm de distance — authentique = surface homogène, fake = alternance de zones plus/moins gonflées.",
    faqs: [
      {
        question: "Le cannage peut-il exister en motif autre que carré ?",
        answer:
          "Non, le cannage classique Dior est TOUJOURS en losanges carrés. Certaines éditions spéciales Dior proposent d'autres matelassages (cannage oblique, motif étoile) mais ne s'appellent pas « cannage » — ils ont un nom spécifique (ex : « Cannage Oblique »). Un sac annoncé « Lady Dior cannage » avec motif non-carré = incohérence = fake.",
      },
      {
        question: "Le cannage est-il présent sur tous les modèles Dior ?",
        answer:
          "Non. Signature du Lady Dior historiquement. Utilisé aussi sur Dior Book Tote (version cannage), Dior Caro, Dior My ABCDior. Pas sur 30 Montaigne (cuir lisse), Saddle (cuir lisse ou toile Oblique), Bobby (cuir texturé différent). Vérifiez si le modèle utilise le cannage avant d'appliquer les critères.",
      },
    ],
  },
  {
    slug: "breloques-lettres",
    name: "Breloques D-I-O-R",
    brandSlug: "dior",
    category: "bags",
    tagline: "Authentifier les 4 breloques lettres DIOR en laiton doré",
    intro:
      "Les 4 breloques en laiton formant le mot « DIOR » suspendues à l'anse du Lady Dior sont un détail signature emblématique. Chaque breloque est une plaque ovale verticale de 20×12 mm, en laiton plaqué or 24 carats (finition gold) ou palladium (finition silver), avec la lettre « D », « I », « O » ou « R » embossée sur la face visible et la mention « CHRISTIAN DIOR PARIS » gravée au verso. Les 4 breloques sont reliées par un anneau en laiton fin de 8 mm de diamètre, chacune positionnée à équidistance (lettres qui retombent naturellement en lisant « D-I-O-R » de gauche à droite quand on regarde le sac porté). Le poids total des 4 breloques + anneau = 18-22 g. Les contrefaçons trahissent plusieurs défauts : 1) breloques trop légères (10-12 g au total = acier creux), 2) gravure verso floue ou absente, 3) lettres D/I/O/R mal positionnées (ordre incorrect, lettres décalées d'équidistance), 4) plaquage or trop brillant qui s'écaille en 1-2 ans. Le test magnétique (laiton non magnétique) + le test de poids + la lecture de la gravure verso discriminent efficacement. Sur Lady Dior authentique, les breloques sonnent clair et métallique quand on les secoue — un son mat « plastique » révèle un acier creux fake.",
    steps: [
      {
        title: "Vérifier la présence des 4 breloques",
        description:
          "Lady Dior : 4 breloques obligatoires (D, I, O, R). Autres modèles Dior peuvent avoir des breloques similaires sur versions spéciales. Absence d'une breloque = signal (peut être perdue ou jamais présente sur fake).",
      },
      {
        title: "Test magnétique",
        description:
          "Aimant néodyme à 1 cm de chaque breloque. Laiton authentique = aucune attraction. Acier fake = attirance. Test décisif.",
      },
      {
        title: "Peser les 4 breloques + anneau",
        description:
          "Balance précision 0,1 g. Ensemble authentique = 18-22 g. Fake acier creux = 8-12 g. Fake laiton fin = 14-16 g. Hors plage = signal.",
      },
      {
        title: "Lire la gravure verso « CHRISTIAN DIOR PARIS »",
        description:
          "Retournez chaque breloque : verso gravé « CHRISTIAN DIOR PARIS » en majuscules serif, police Didot. Kerning régulier, profondeur 0,2-0,3 mm. Gravure floue ou absente = fake.",
      },
      {
        title: "Vérifier l'ordre des lettres et positionnement",
        description:
          "L'ordre est D-I-O-R de gauche à droite (vu de face par l'utilisateur). Équidistance entre chaque breloque. Un désordre (I-D-O-R, ou lettres groupées d'un côté) révèle un assemblage fake.",
      },
    ],
    commonErrors: [
      {
        title: "Rejeter une breloque légèrement usée",
        description:
          "Breloques portées 5+ ans peuvent présenter micro-rayures de friction contre chaîne/anneau. C'est normal. Une breloque « sans aucune marque » sur sac vintage 10 ans est plus suspecte (breloque remplacée).",
      },
      {
        title: "Accepter 3 breloques au lieu de 4",
        description:
          "Lady Dior = 4 breloques obligatoires. 3 breloques = lettre perdue. Si la breloque manquante n'est pas remplacée par Dior (service gratuit), le sac est incomplet et sa valeur diminue. Mais 3 au lieu de 4 ne signifie pas fake — c'est un sac authentique avec breloque perdue.",
      },
      {
        title: "Tester l'aimant trop fort",
        description:
          "Un aimant puissant peut faire bouger le laiton par induction. Aimant standard 20-30 mm, distance 1 cm. Pas au contact.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme utilisent des breloques en laiton réel (passant test magnétique + poids) avec gravure verso imitée. Le défaut résiduel : la police Didot utilisée par Dior est une police avec empattements très fins spécifiques. Les fakes utilisent une Didot approximative (Bodoni ou Times New Roman) qui paraît similaire mais les empattements (petits traits aux extrémités) sont différents. À la loupe x10, les empattements Dior authentiques sont parfaitement fins et nets ; les fakes présentent des empattements plus épais ou arrondis. Comparaison avec photo officielle dior.com du verso des breloques = test visuel direct.",
    faqs: [
      {
        question: "Dior peut-il remplacer une breloque perdue ?",
        answer:
          "Oui, via le service après-vente Dior. Apportez votre Lady Dior en boutique — ils commandent la breloque manquante (D, I, O ou R) pour ~150-200 €, avec délai 2-4 mois. La breloque de remplacement est authentique Dior et restaure la valeur du sac. Évitez les breloques « de remplacement » achetées sur eBay ou marché secondaire — ce sont des fakes.",
      },
      {
        question: "Les breloques sont-elles présentes sur tous les Lady Dior ?",
        answer:
          "Oui, sur les Lady Dior standards depuis 1994. Quelques éditions limitées ou collaborations contemporaines (Lady Dior art collection) peuvent avoir des breloques personnalisées avec le nom de l'artiste au lieu de D-I-O-R. Ces éditions sont documentées sur dior.com. Un Lady Dior « standard » sans breloques est fake.",
      },
    ],
  },
  {
    slug: "hardware-gravure",
    name: "Gravure « CHRISTIAN DIOR » hardware",
    brandSlug: "dior",
    category: "bags",
    tagline: "Inspecter la gravure des boucles et anneaux Dior",
    intro:
      "Les pièces hardware métalliques des sacs Dior (boucles, anneaux, fermoirs, breloques décoratives) portent systématiquement la gravure « CHRISTIAN DIOR PARIS MADE IN ITALY » ou variantes courtes selon taille de la pièce. La police utilisée est Didot (signature Dior depuis les années 50) avec empattements fins très spécifiques. La gravure est embossée à froid par pressage mécanique avec profondeur 0,2-0,4 mm. Le matériau : laiton massif plaqué or 24 carats (gold) ou palladium (silver), non magnétique. Tests : 1) magnétique (laiton authentique non attiré), 2) poids (pièces massives, pas creuses), 3) lecture gravure à loupe x10 (police Didot empattements fins, kerning régulier), 4) finition surface (laiton satiné ou poli, pas chrome miroir). Sur Book Tote, 30 Montaigne, Saddle modernes, l'inspection du fermoir principal avec gravure visible est un point d'authentification rapide. Les fakes commettent deux erreurs récurrentes : gravure avec police sans-serif (Arial, Helvetica) au lieu de Didot serif, et absence de mention « MADE IN ITALY » (Dior produit ses sacs en Italie pour la maroquinerie principale, pas en France).",
    steps: [
      {
        title: "Identifier les pièces hardware à inspecter",
        description:
          "Fermoir principal (Book Tote = fermoir CD, 30 Montaigne = fermoir CD, Saddle = fermoir diamant), anneaux, rivets visibles, breloques. Focalisez sur les pièces gravées.",
      },
      {
        title: "Test magnétique",
        description:
          "Aimant néodyme 20-30 mm, distance 1 cm. Laiton Dior authentique = aucune attraction. Acier fake = attraction. Test décisif.",
      },
      {
        title: "Lire la gravure à la loupe x10",
        description:
          "« CHRISTIAN DIOR PARIS MADE IN ITALY » en majuscules serif Didot, kerning régulier, empattements fins. Une police sans-serif (Arial-style) = fake. Absence de « MADE IN ITALY » = fake (Dior maroquinerie fabrique en Italie).",
      },
      {
        title: "Vérifier la profondeur d'embossage",
        description:
          "Gravure 0,2-0,4 mm de profondeur, relief tactile. Passez l'ongle : vous devez sentir les lettres. Une gravure plate (< 0,1 mm) ou imprimée à l'encre = fake.",
      },
      {
        title: "Contrôler la finition (laiton vs chrome)",
        description:
          "Laiton plaqué or : finition satiné ou poli avec chaleur visuelle (teinte or chaude). Acier chromé fake : miroir brillant froid (teinte argentée). Sous lumière directe, laiton absorbe la lueur, chrome réfléchit l'environnement.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter « MADE IN FRANCE » sur maroquinerie",
        description:
          "Dior maroquinerie (sacs, portefeuilles) est fabriquée en ITALIE, pas en France. Les ateliers maroquinerie sont à Gênes, Florence, Venise principalement. « Made in France » sur hardware Dior = fake ou confusion avec couture (défilés) qui eux sont France.",
      },
      {
        title: "Ignorer la police Didot spécifique",
        description:
          "Dior utilise exclusivement Didot sur hardware. Une police sans-serif moderne (Helvetica, Arial) sur gravure = fake immédiat. Comparez avec photo dior.com qui montre la gravure authentique.",
      },
      {
        title: "Tester uniquement la pièce principale",
        description:
          "Les faussaires soignent le fermoir principal mais bâclent les petites pièces (rivets internes, anneaux secondaires). Inspectez TOUTES les pièces gravées — un fake mix parfois pièces authentiques + fakes sur secondaires.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme utilisent du laiton réel (non magnétique) avec gravure Didot — résolvant tests basiques. Le défaut : l'épaisseur du plaquage or. Dior utilise un plaquage 8-10 microns qui résiste 10+ ans. Les fakes utilisent 3-5 microns qui s'usent en 1-2 ans, révélant le laiton nu par plaques (zones d'usure aux angles, frictions). Acheter un fake « 2ème main 2 ans » permet de voir ce défaut. Autre tactique : gravure Didot quasi-parfaite mais avec empattements légèrement trop épais (outil pressage moins précis). À la loupe x10, comparaison avec photo officielle révèle le différentiel.",
    faqs: [
      {
        question: "Le hardware Dior peut-il se décolorer naturellement ?",
        answer:
          "Oui, patine noble. Le laiton plaqué or s'oxyde avec le temps : teinte or plus chaude après 5-10 ans, légère patine sur zones de friction. Signe d'authenticité. Hardware qui reste miroir brillant après 10 ans = chrome imperméable = fake. Noircissement en plaques irrégulières = plaquage fake mal appliqué.",
      },
      {
        question: "Pourquoi certaines pièces hardware sont-elles en finition « ruthenium » ?",
        answer:
          "Ruthenium (gris foncé mat) est une finition spéciale utilisée par Dior sur certaines collections (Lady Dior avec hardware sombre, Saddle édition limitée). C'est authentique et documenté sur dior.com. Un hardware ruthenium sur un Lady Dior classique « gold hardware » = fake ou pièce d'une autre collection. Vérifiez la fiche produit du colorway exact.",
      },
    ],
  },
  {
    slug: "etiquette-made-in-italy",
    name: "Étiquette « Made in Italy »",
    brandSlug: "dior",
    category: "bags",
    tagline: "Analyser l'étiquette intérieure Made in Italy Dior",
    intro:
      "Chaque sac Dior (maroquinerie) porte une étiquette intérieure cousue avec la mention « CHRISTIAN DIOR / MADE IN ITALY » en broderie ou impression selon modèle. Cette étiquette est positionnée dans la doublure, généralement sous une couture intérieure, en textile ivoire ou noir selon colorway du sac. La mention est en Helvetica ou Didot (selon génération, Didot sur modèles post-2018) avec kerning régulier, lettres nettes. L'étiquette est cousue avec 7-9 points par cm, fil assorti à la couleur du textile. Les contrefaçons commettent trois erreurs : 1) « MADE IN FRANCE » au lieu de « MADE IN ITALY » (Dior maroquinerie = Italie, confusion fake avec haute couture France), 2) étiquette collée au lieu de cousue (se détache facilement), 3) police incorrecte (Arial bold moderne au lieu de Didot élégant). Le test rapide : localiser l'étiquette, vérifier « MADE IN ITALY » avec police Didot serif, et inspecter la couture de fixation. Ce test prend 30 secondes. Pour les modèles vintage pré-2000, les étiquettes pouvaient varier (ex : simplement « MADE IN FRANCE » pour certaines petites maroquineries produites en France, ou étiquettes en cuir embossé au lieu de textile). Croiser avec la date du sac pour éviter les erreurs d'interprétation sur vintage.",
    steps: [
      {
        title: "Localiser l'étiquette intérieure",
        description:
          "Doublure intérieure, généralement sous une couture ou à l'intérieur d'une poche. Lady Dior = fond intérieur. Book Tote = doublure intérieure haute. Petit rectangle 20×30 mm de textile avec inscription.",
      },
      {
        title: "Lire la mention « MADE IN ITALY »",
        description:
          "« CHRISTIAN DIOR » ligne 1 + « MADE IN ITALY » ligne 2, ou combiné selon taille. Majuscules, police Didot sur modèles modernes. Vérifiez ITALY (pas France sur maroquinerie moderne).",
      },
      {
        title: "Contrôler la police Didot",
        description:
          "Didot = serif avec empattements fins, contrastes de graisse marqués. Police Helvetica, Arial ou autre sans-serif = fake. Comparaison avec photos officielles dior.com confirme la police attendue.",
      },
      {
        title: "Vérifier le mode de fixation (cousu vs collé)",
        description:
          "L'étiquette Dior est COUSUE avec 7-9 points/cm, fil assorti. Une étiquette collée (se décolle si on tire doucement) = fake. Tirez doucement un coin pour tester la fixation.",
      },
      {
        title: "Examiner la matière textile",
        description:
          "Textile tissé serré (coton ou mélange). Couleur assortie à la doublure. Un textile feutré non-tissé (fibres pressées), ou un aspect plastique brillant, = fake.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre « Made in Italy » et « Made in France »",
        description:
          "Dior = maroquinerie Italie, haute couture France. Les deux existent dans l'univers Dior mais séparément. Un sac (maroquinerie) doit être Made in Italy. Une robe (couture) doit être Made in France. Sac avec « Made in France » = fake ou confusion marketing frauduleuse.",
      },
      {
        title: "Accepter une étiquette floue",
        description:
          "L'inscription authentique est NETTE, lisible sans effort à 30 cm. Une étiquette floue, mal imprimée, ou avec caractères qui bavent = impression fake sur textile bas de gamme.",
      },
      {
        title: "Ignorer les micro-détails de pliage",
        description:
          "L'étiquette Dior est pliée et cousue sur un bord (pas tous les 4 côtés cousus). Le pli est net et régulier. Une étiquette « flottante » cousue sur les 4 côtés, ou pliée de travers, révèle un montage fake.",
      },
    ],
    counterfeiterTactics:
      "Les fakes reproduisent l'étiquette avec textile similaire et impression Didot — passant tests visuels basiques. Le défaut : la TRAME du textile. Dior utilise un textile tissé serré avec fils fins (80-100 fils/cm²). Les fakes utilisent un textile plus grossier (50-70 fils/cm²). À la loupe x10, la différence de finesse de trame est visible : authentique = trame dense et régulière, fake = trame plus lâche avec fils irréguliers. Autre tactique : fakes haut de gamme avec textile importé italien correct — mais la couture de fixation reste à la machine avec 10-12 points/cm (trop serré) au lieu des 7-9 points Dior authentique. Comptage de points rapide tranche.",
    faqs: [
      {
        question: "Un sac Dior « Made in France » est-il obligatoirement fake ?",
        answer:
          "Sur maroquinerie moderne (post-2000) : oui à 99 %. Dior maroquinerie est fabriquée exclusivement en Italie depuis que la production a été consolidée dans les ateliers italiens (Gênes, Florence). Exceptions historiques : certaines petites maroquineries Dior pré-1995 ont pu être produites en France. Sur vintage ancien, « Made in France » peut être authentique. Sur moderne, c'est fake. Vérifiez la date du sac (code date) pour discriminer.",
      },
      {
        question: "L'étiquette peut-elle être décolorée avec l'âge ?",
        answer:
          "Légèrement. Le textile jaunit avec l'exposition UV après 5-10 ans (oxydation naturelle des fibres). Cette patine est un signe d'authenticité. En revanche, un textile qui devient grisâtre ou jaune foncé après 2-3 ans révèle un textile fake bas de gamme (teinte instable). Comparez la décoloration de l'étiquette avec la décoloration interne de la doublure — cohérence d'âge.",
      },
    ],
  },
];
