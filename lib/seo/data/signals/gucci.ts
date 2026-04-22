import type { GuideSignal } from "../../guide-types";

export const gucciSignals: GuideSignal[] = [
  {
    slug: "numero-serie",
    name: "Numéro de série à 2 lignes",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Lire le numéro de série Gucci sur patte cuir intérieure",
    intro:
      "Gucci marque chaque sac d'un numéro de série unique sur une patte de cuir intérieure, présenté sur 2 lignes embossées. La ligne 1 comporte 6 chiffres et correspond à la référence modèle (ex : 498156 = Dionysus Small, 443497 = Padlock Small, 550763 = GG Marmont Small). La ligne 2 comporte 4-6 chiffres et correspond au numéro unique de production du sac (numéro séquentiel dans le lot de fabrication, ex : 498156 / 113452). Ces codes sont répertoriés publiquement sur le site Gucci et chez les distributeurs (Farfetch, MyTheresa). La vérification prend 30 secondes : cherchez la référence modèle (ligne 1) sur gucci.com → la page produit doit correspondre exactement au sac en main (même forme, même colorway, même matériau). Un différentiel (la ligne 1 renvoie à un Dionysus mais le sac en main est un Marmont) = contrefaçon immédiate. Les faussaires commettent deux erreurs : 1) inventer un numéro qui n'existe pas sur gucci.com, 2) utiliser un numéro authentique d'un autre modèle (confusion entre références), détectable par cross-check visuel. L'embossage authentique Gucci est réalisé à chaud avec une profondeur de 0,3-0,5 mm, caractères Helvetica Medium parfaitement nets. Les fakes présentent souvent un embossage superficiel (< 0,2 mm), flou ou avec des bavures autour des chiffres.",
    steps: [
      {
        title: "Localiser la patte de cuir avec numéro",
        description:
          "Emplacement standard : patte cuir intérieure sur doublure, souvent vers la fermeture zippée ou la patte de selle. Sur Dionysus = doublure rabat. Sur Marmont = doublure intérieure. Patte mesurant 10-15 mm avec 2 lignes de chiffres.",
      },
      {
        title: "Noter les 2 lignes précisément",
        description:
          "Ligne 1 : 6 chiffres (référence modèle). Ligne 2 : 4-6 chiffres (production unique). Utilisez une loupe x5. Attention aux confusions 0/O (Gucci utilise exclusivement chiffres, pas de lettres dans le numéro).",
      },
      {
        title: "Cross-check ligne 1 sur gucci.com",
        description:
          "Tapez le numéro de ligne 1 (ex : « 498156 ») sur gucci.com. La page produit correspondante doit s'afficher. Comparez la photo officielle avec le sac en main : même modèle, même colorway, même cuir.",
      },
      {
        title: "Vérifier cohérence ligne 2 (numéro production)",
        description:
          "La ligne 2 ne peut pas être cross-checked publiquement (numéro interne Gucci). Mais : 4-6 chiffres attendus. Un nombre à 3 chiffres ou à 8 chiffres est hors standard = signal fake.",
      },
      {
        title: "Contrôler la profondeur d'embossage",
        description:
          "Embossage authentique = 0,3-0,5 mm de profondeur, relief tactile net. Passez l'ongle : vous sentez les chiffres. Un embossage plat (moins de 0,1 mm) ou une impression sans relief = fake.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter un numéro simple à une ligne",
        description:
          "Le numéro Gucci est TOUJOURS sur 2 lignes. Un numéro sur une seule ligne (même si plausible format) est une simplification fake. Rejet immédiat.",
      },
      {
        title: "Valider sans cross-check visuel gucci.com",
        description:
          "Un numéro authentique copié d'un listing StockX peut être apposé sur un fake. La preuve exige le cross-check visuel : photo officielle Gucci.com = photo du sac en main. Différentiel de colorway/matériau = fake.",
      },
      {
        title: "Ignorer l'orientation des lignes",
        description:
          "Les 2 lignes sont HORIZONTALES, parallèles. Un numéro en colonne (chiffres verticaux) ou en diagonale = fake avec outillage incorrect. L'orientation est standardisée chez Gucci.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires scrappent gucci.com pour récupérer les références modèles (ligne 1) et les collent sur fakes — respectant le format. Le défaut : ils ne génèrent pas de numéros de production uniques (ligne 2). Ils réutilisent le même numéro de ligne 2 sur plusieurs sacs fake (ex : « 113452 » sur des dizaines de fakes). Si vous voyez sur forums (Reddit r/Luxurymarkt, PurseForum) plusieurs sacs suspectés fakes avec la MÊME ligne 2, c'est la confirmation que ce numéro est « grillé » dans les circuits fake. Base de recherche simple : Google « gucci 498156 113452 fake » → les topics forum signalent les numéros circulant.",
    faqs: [
      {
        question: "Le numéro Gucci peut-il s'effacer avec le temps ?",
        answer:
          "Très peu. L'embossage à chaud sur cuir est durable 15-20 ans. Un numéro complètement effacé sur un sac de 5-10 ans est suspect — soit le cuir est de mauvaise qualité (fake), soit le numéro a été volontairement abrasé (raclé pour masquer une contrefaçon avec numéro grillé). Dans les deux cas, signal fort.",
      },
      {
        question: "Gucci utilise-t-il un autre système de traçabilité ?",
        answer:
          "Oui, depuis 2020 : un QR code intérieur permet de scanner avec l'app « Gucci Discovery » pour authentification digitale. Les deux systèmes coexistent (numéro 2 lignes + QR code). Un sac Gucci post-2020 sans QR code est suspect. Un sac pré-2020 n'a pas de QR code (normal).",
      },
    ],
  },
  {
    slug: "gg-pattern",
    name: "Pattern GG Supreme",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Analyser le pattern GG interlocking sur canvas Supreme",
    intro:
      "Le pattern GG Supreme est la signature canvas la plus iconique de Gucci depuis 1964 : un motif répétitif où le double G de Guccio Gucci s'entrelace en formation diamant sur un fond beige. Le canvas Supreme est une toile enduite PVC avec impression 4 couches (base beige + motif GG brun foncé + highlight doré + vernis protecteur), donnant une profondeur visuelle unique. Les spécifications de production : chaque motif GG mesure 22×22 mm (tolérance ±0,5 mm), espacement entre motifs = 8 mm, alignement en losanges 45° par rapport à la couture. Sur les sacs Gucci authentiques (Ophidia, Padlock, Dionysus en Supreme), le pattern est parfaitement aligné sur les coutures — les motifs GG aux 4 coins sont tronqués symétriquement. Les contrefaçons trahissent trois défauts : 1) taille de motif incorrecte (21×21 ou 23×23 mm, décalage cumulatif visible sur une rangée de 10 motifs), 2) alignement non-respecté aux coutures (un GG complet à un coin, tronqué à l'autre), 3) couleur trop sombre (brun noir foncé au lieu du brun moka authentique). Un test simple : compter les motifs GG sur la face avant horizontalement et verticalement, puis comparer avec la photo officielle gucci.com du modèle exact. Un décalage de 1-2 motifs révèle un canvas mal coupé ou mal imprimé = fake.",
    steps: [
      {
        title: "Photographier la face avant du sac",
        description:
          "Posez à plat ou sur support vertical, lumière diffuse, perpendiculaire. Évitez les reflets sur le vernis du canvas.",
      },
      {
        title: "Mesurer un motif GG isolé",
        description:
          "Avec un réglet : un GG complet mesure 22 mm × 22 mm (±0,5 mm). Un motif plus grand (24 mm) ou plus petit (20 mm) = canvas incorrect = fake.",
      },
      {
        title: "Compter les motifs en largeur et hauteur",
        description:
          "Sur la face avant d'un Dionysus Small : environ 14 motifs en largeur × 9 motifs en hauteur. Variations selon modèle. Comparez avec photo officielle gucci.com. Différentiel de 1+ motif = signal fake.",
      },
      {
        title: "Vérifier l'alignement aux coutures",
        description:
          "Aux 4 coins du sac, les GG doivent être tronqués SYMÉTRIQUEMENT (même portion de GG coupée aux 4 coins). Un coin avec GG complet + autre coin avec demi-GG = canvas décalé = fake.",
      },
      {
        title: "Contrôler la couleur",
        description:
          "GG Supreme authentique : fond beige moka #C9A876, motif brun moka #5D4037, highlight doré subtil. Fake : fond trop jaune ou trop gris, motif trop noir, absence de highlight doré. Comparez à la charte gucci.com.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre GG Supreme et GG Jacquard (textile)",
        description:
          "GG Supreme = canvas enduit PVC, légèrement rigide, mat. GG Jacquard = tissu textile (pas PVC), plus souple, toucher textile. Les deux existent sur différents modèles. Appliquer critères Supreme sur Jacquard = erreur.",
      },
      {
        title: "Rejeter un motif légèrement tronqué aux zones non-visibles",
        description:
          "Aux jonctions canvas / cuir (anses, poches), le motif peut être légèrement tronqué — normal car découpe fonctionnelle. La règle de symétrie concerne les 4 coins principaux du sac, pas chaque centimètre de jonction.",
      },
      {
        title: "Valider sur un seul motif",
        description:
          "Mesurer UN motif ne suffit pas. Le défaut fake est cumulatif : 5 motifs fakes à 22,3 mm vs 5 authentiques à 22 mm = 1,5 mm de décalage total, visible. Mesurez sur plusieurs motifs consécutifs.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires impriment des canvas Supreme avec des imprimantes industrielles chinoises utilisant 2-3 couches d'impression (au lieu des 4 Gucci authentique). Résultat : le highlight doré du motif authentique manque sur fake, rendant le pattern plus « plat » et moins vibrant. Sous lumière rasante (lampe torche orientée à 15°), le canvas authentique révèle des reflets dorés subtils sur les motifs GG ; le canvas fake reste uniforme. Ce test lumière rasante est visuel, rapide, discriminant. Autre tactique : fakes haut de gamme 2024 avec vernis brillant appliqué pour imiter l'effet — mais le vernis fake donne un aspect plastique que l'authentique n'a pas (les reflets authentiques sont dans la couleur, pas sur la surface).",
    faqs: [
      {
        question: "Le canvas GG Supreme se décolore-t-il avec le temps ?",
        answer:
          "Très peu. Le PVC avec vernis protecteur Gucci résiste 10-15 ans sans décoloration notable. Sur des sacs vintage (15+ ans), un léger brunissement des zones exposées est possible. Un sac < 5 ans avec décoloration visible révèle un PVC fake sans stabilisation UV. Les fakes perdent 20-30 % d'intensité couleur en 2-3 ans d'exposition normale.",
      },
      {
        question: "Gucci a-t-il plusieurs tailles de motif GG ?",
        answer:
          "Oui, selon modèle et collection. Le « GG Supreme classique » est à 22×22 mm. Le « GG Multicolor » (collection 2020+) peut avoir des motifs 18×18 mm ou 25×25 mm selon saison. Vérifiez la photo officielle du modèle exact avant d'appliquer les critères de taille. Un motif 18 mm sur un Dionysus en « GG Supreme classique » est fake, mais sur un sac « GG Multicolor » peut être authentique.",
      },
    ],
  },
  {
    slug: "hardware-gravure",
    name: "Gravure « GUCCI » hardware",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Vérifier la gravure des boucles et anneaux hardware Gucci",
    intro:
      "Chaque pièce de hardware métallique sur un sac Gucci (boucles, anneaux, fermoirs, rivets, piercings) porte une gravure précise, généralement « GUCCI » en majuscules serif avec police Garamond modifiée, ou « GUCCI MADE IN ITALY » sur les pièces plus grandes. Cette gravure est embossée à froid par pressage mécanique avec une profondeur de 0,2-0,4 mm, parfaitement nette, kerning régulier. Le matériau hardware est toujours du laiton massif plaqué or 24 carats (finition gold), palladium (finition silver) ou ruthénium (finition antique brass). Quatre tests discriminent authentique et fake : 1) test magnétique — laiton non magnétique, un hardware attiré par aimant = acier fake ; 2) lecture à la loupe x10 — gravure Gucci authentique a des lignes fines, nettes, sans bavure ; 3) test de poids — un fermoir Gucci standard pèse 8-15 g selon modèle, fake creux 4-7 g ; 4) comportement thermique — le laiton chauffe lentement à température ambiante (moins conductif que l'acier), l'acier fake se réchauffe rapidement au contact. La combinaison de ces 4 tests tranche définitivement. La gravure « GUCCI » peut également apparaître avec le logo GG entrelacé sur certaines pièces — même critères de netteté et kerning.",
    steps: [
      {
        title: "Identifier toutes les pièces hardware",
        description:
          "Boucles anses, anneau central (Marmont = anneau GG ajouré), rivets de fixation, fermoir zippé (tirette gravée), éventuellement piercings décoratifs. Notez le nombre et type de pièces.",
      },
      {
        title: "Test magnétique sur chaque pièce",
        description:
          "Aimant néodyme 20-30 mm, distance 1 cm. Laiton authentique = aucune attraction. Acier plaqué or fake = attraction nette. Testez chaque pièce — un fake mix parfois authentique + fake.",
      },
      {
        title: "Lire la gravure « GUCCI » à la loupe x10",
        description:
          "Lettres G-U-C-C-I en serif (Garamond modifié), kerning régulier. Gravure nette, profondeur 0,2-0,4 mm. Une gravure floue, avec bavures, ou une police différente (sans-serif) = fake.",
      },
      {
        title: "Peser une pièce isolée (si amovible)",
        description:
          "Balance précision 0,1 g. Fermoir Gucci standard = 8-15 g selon modèle. Anneau GG Marmont = 20-28 g. Fake acier creux = 40-50 % plus léger. Hors plage = signal.",
      },
      {
        title: "Vérifier la finition de surface",
        description:
          "Laiton plaqué or : finition satiné ou poli, avec chaleur visuelle. Acier chromé fake : miroir brillant, froid visuel. Sous lumière directe, laiton absorbe et renvoie une lueur chaude, chrome réfléchit comme un miroir.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter une gravure « Gucci » en minuscules",
        description:
          "Gucci grave EN MAJUSCULES (« GUCCI »). Une gravure en minuscules (« gucci ») n'existe pas sur hardware Gucci authentique — c'est une erreur fake fréquente. Rejet immédiat.",
      },
      {
        title: "Confondre laiton patiné et fake décoloré",
        description:
          "Le laiton authentique se patine avec l'âge (vieillissement noble, couleur vers cuivre-or). C'est un signe d'authenticité. Le fake se décolore en plaques (plaquage or écaillé révélant acier gris). Distinguez patine noble (uniforme) et décoloration fake (en plaques).",
      },
      {
        title: "Tester l'aimant trop près",
        description:
          "Un aimant très puissant (néodyme 50+ mm) peut faire bouger un laiton par induction. Utilisez un aimant standard 20-30 mm à 1 cm de distance. Pas au contact.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme utilisent du laiton réel (non magnétique) avec gravure quasi-parfaite — résolvant les critères simples. Le défaut résiduel : la finition de plaquage. Gucci utilise un plaquage galvanique or 24k sur laiton poli (procédé stable 10+ ans). Les fakes utilisent un plaquage plus fin (3-5 microns au lieu de 8-10 microns Gucci) qui s'use en 1-2 ans, révélant le laiton nu ou l'acier en-dessous. Sur un sac fake « neuf », le plaquage est parfait — mais un sac fake de 2-3 ans montre des zones d'usure précoce (angles, coins) que l'authentique ne montre pas. Acheter un fake « 2ème main de 2-3 ans » permet souvent de détecter ce défaut.",
    faqs: [
      {
        question: "Le hardware Gucci peut-il se ternir avec l'âge ?",
        answer:
          "Oui, naturellement. Le plaquage or 24k s'oxyde avec transpiration, humidité, frictions. Après 5-10 ans, le hardware peut perdre un peu de brillant et virer vers une teinte or plus chaude. Cette patine est un signe d'AUTHENTICITÉ. Un hardware qui reste miroir brillant après 10 ans d'usage est suspect (chrome imperméable = fake). Un noircissement en plaques irrégulières révèle un plaquage fake de mauvaise qualité.",
      },
      {
        question: "Toutes les pièces hardware d'un sac Gucci portent-elles la gravure ?",
        answer:
          "Non. Les grandes pièces visibles (fermoir principal, anneau GG Marmont) sont gravées. Les petites pièces fonctionnelles (rivets internes, clips non visibles) ne le sont pas systématiquement — c'est normal. La règle : toutes les pièces visibles et marquantes doivent être gravées. Une boucle d'anse sans gravure sur modèle récent (post-2010) est suspecte. Sur pièces vintage, les standards variaient davantage.",
      },
    ],
  },
  {
    slug: "qr-code",
    name: "QR code d'authentification",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Scanner et vérifier le QR code Gucci via l'app Discovery",
    intro:
      "Depuis 2020, Gucci intègre un QR code d'authentification à l'intérieur de ses sacs (patte de cuir spécifique ou étiquette dédiée). Ce QR code, scanné via l'app officielle « Gucci Discovery » (disponible iOS/Android), permet une authentification digitale en quelques secondes : le scan vérifie l'identifiant unique du sac dans les bases Gucci et renvoie une confirmation d'authenticité + informations produit (collection, année, matériau, référence). Ce système est l'évolution moderne du numéro de série physique. Pour le consommateur, le test est simple et décisif : installer l'app Gucci Discovery gratuite → onglet « Authenticate » → scanner le QR code du sac → attendre la réponse (1-5 secondes). Si le QR renvoie une page produit cohérente avec le sac (même modèle, même matériau), le sac est authentifié. Si le QR renvoie une page différente ou « non reconnu », le sac est une contrefaçon. Les faussaires impriment des QR codes génériques qui mènent à des sites tiers (pages fausses imitant Gucci) ou à des QR non-fonctionnels. Quelques faussaires haut de gamme ont tenté de reverse-engineer le système, mais Gucci a renforcé la cryptographie en 2023, rendant les fakes actuels détectables à 99 %. Le test QR + app officielle est devenu le numéro 1 des tests Gucci post-2020.",
    steps: [
      {
        title: "Vérifier la date de production (post-2020)",
        description:
          "Le QR code est présent uniquement sur sacs produits après 2020. Les sacs pré-2020 n'en ont pas (normal). Déterminez la date via le numéro de série ligne 1 croisé avec la date de drop du modèle sur gucci.com.",
      },
      {
        title: "Localiser le QR code",
        description:
          "Emplacement standard : petite étiquette cuir intérieure ou sur la doublure textile. Format : carré 15-20 mm, impression noire sur fond beige. Parfois dans une poche dédiée.",
      },
      {
        title: "Installer l'app Gucci Discovery",
        description:
          "App Store / Google Play : « Gucci Discovery » officielle (développeur Gucci, pas tierces). Téléchargement gratuit, pas de connexion compte requise pour scan authentification.",
      },
      {
        title: "Scanner le QR via l'onglet Authenticate",
        description:
          "Ouvrez l'app → onglet « Authenticate » (peut être « Scan » selon version). Cadrez le QR code dans le viseur de l'app. Attendez la reconnaissance (1-3 secondes).",
      },
      {
        title: "Analyser la réponse de l'app",
        description:
          "Réponse positive : page produit Gucci avec photos, référence, matériau cohérent avec le sac en main. Réponse négative : « QR not recognized » ou redirection vers page externe = contrefaçon.",
      },
    ],
    commonErrors: [
      {
        title: "Scanner avec un QR reader générique",
        description:
          "Les apps QR génériques (Barcode Scanner, smartphone natif) peuvent lire le QR mais ne se connectent pas aux bases Gucci — elles affichent juste un lien URL. Utilisez EXCLUSIVEMENT l'app officielle Gucci Discovery pour authentification véritable.",
      },
      {
        title: "Conclure « fake » sans l'app officielle",
        description:
          "Un QR qui ne fonctionne pas avec un reader générique ne prouve rien. Le test valable est via app Gucci Discovery. Essayez d'abord cette app avant de rejeter.",
      },
      {
        title: "Ignorer une redirection vers site non-Gucci",
        description:
          "Si le QR ouvre un site externe (pas gucci.com ou app.gucci) = fake évident. Certains fakes imitent visuellement Gucci avec des URL piégées (« gucci-authenticate.com ») — ce ne sont PAS des domaines Gucci officiels.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires génèrent des QR codes pointant vers des sites miroirs (pages HTML clonées de gucci.com) qui affichent « authenticated » sans vérification réelle. Ces sites sont facilement détectables : URL non-officielle, HTTPS avec certificat autosigné ou manquant, contenu incomplet. Autre tactique : fakes avec QR pointant vers gucci.com mais une page produit aléatoire (pas le produit en main) — l'app Gucci Discovery détecte ce différentiel. Certains fakes 2024 ultra-haut-de-gamme ont tenté de clonage cryptographique complet du système Gucci : Gucci a riposté avec un renforcement AES-256 rendant ces clones inopérants depuis juin 2023. Le système d'authentification digital Gucci est actuellement l'un des plus robustes du luxe.",
    faqs: [
      {
        question: "Mon sac Gucci post-2020 n'a pas de QR code, est-il forcément fake ?",
        answer:
          "C'est un signal fort. Gucci a généralisé les QR à partir de 2020 sur tous les sacs. Un sac post-2020 sans QR est suspect. Exceptions possibles : certaines éditions limitées ou collaborations peuvent avoir un système différent — vérifiez via gucci.com la fiche produit exact. En cas de doute, apportez le sac en boutique Gucci pour vérification gratuite.",
      },
      {
        question: "Le QR peut-il s'effacer avec le temps ?",
        answer:
          "Possible sur sacs très portés (3+ ans). L'impression peut s'abîmer si l'étiquette est frottée. Si le QR est partiellement illisible, essayez un scan en inclinant le smartphone ou avec meilleur éclairage. Si totalement illisible, apportez le sac en boutique Gucci : ils peuvent authentifier via leur base interne avec le numéro de série. Un QR effacé N'invalide PAS l'authentification si autres indicateurs cohérents.",
      },
    ],
  },
  {
    slug: "cuir-qualite",
    name: "Qualité du cuir vachetta",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Évaluer le cuir Italian vachetta Gucci : grain, patine, souplesse",
    intro:
      "Gucci utilise depuis 1921 un cuir de veau italien tanné végétal (« vachetta ») pour les pièces cuir de ses sacs (bordures, anses, pattes). Ce cuir vient principalement de Toscane (tanneries certifiées Slow Food Italy) et présente des caractéristiques spécifiques : 1) grain naturel non-pressé (micro-variations visibles à la loupe x10, cicatrices d'origine animale comme « preuve d'authenticité »), 2) couleur beige-clair non teinté qui patine avec le temps (brunit progressivement, développe une patine noble en 3-5 ans), 3) souplesse ferme (ni raide comme un cuir pressé, ni mou comme un cuir de mauvaise qualité), 4) absorption de la transpiration (tache et marque légèrement avec l'usage, normal et recherché pour la patine). Les contrefaçons utilisent soit du split leather (face inférieure du cuir vachette) qui imite grossièrement le grain, soit du cuir tanné chrome chinois qui a un grain artificiellement uniforme (embossage industriel) et ne patine pas (couleur stable qui n'évolue pas avec l'usage). Quatre tests : 1) rechercher les cicatrices naturelles d'origine animale (piqûres d'insectes, brûlures d'herbe — signes d'authenticité) ; 2) vérifier la patine initiale ou absence chez sac neuf (vachetta non teinté = beige clair très pâle) ; 3) test d'absorption d'eau (goutte d'eau : vachetta authentique absorbe en 5-10 secondes, fake chrome-tanné reste en surface) ; 4) odeur douce de cuir tanné végétal (rappelle le cuir de selle) vs odeur chimique fake.",
    steps: [
      {
        title: "Identifier les zones en cuir vachetta",
        description:
          "Typiquement : bordures anses, poignée rigide, pattes de sangle, doublure intérieure (certains modèles). Distinct du canvas GG Supreme qui est enduit PVC. Focalisez-vous sur les zones cuir pur.",
      },
      {
        title: "Chercher les cicatrices naturelles",
        description:
          "À la loupe x5, inspectez la surface du cuir. Cicatrices naturelles (marques d'origine animale) = preuve de cuir full-grain authentique. Absence totale de cicatrices = cuir pressé industriel (fake ou cuir corrigé).",
      },
      {
        title: "Tester la patine (ou absence sur sac neuf)",
        description:
          "Sac neuf : vachetta très pâle, presque blanc ivoire. Sac porté 2-3 ans : beige-moka patine uniforme. Sac 5+ ans : brun noble. Un sac neuf avec vachetta déjà brune = cuir fake pré-teint pour imiter la patine.",
      },
      {
        title: "Test d'absorption d'eau",
        description:
          "Déposez une GOUTTE (pas plus) d'eau sur une zone peu visible. Vachetta authentique : absorption en 5-10 secondes, laisse une marque sombre qui sèche en 30 min. Fake chrome-tanné : eau reste en surface 1+ min, aucune marque après séchage.",
      },
      {
        title: "Test d'odeur",
        description:
          "Approchez le nez du cuir. Vachetta authentique : odeur douce, légèrement sucrée, rappelle le cuir de selle. Fake : odeur chimique forte (chrome tannage), parfois piquante. Test immédiat.",
      },
    ],
    commonErrors: [
      {
        title: "Croire qu'une tache = dommage",
        description:
          "Les taches et marques sur vachetta sont RECHERCHÉES par les collectionneurs (preuve de cuir vivant + patine personnelle). Un sac vachetta « parfait » sans aucune marque après 2-3 ans d'usage est suspect (probable cuir synthétique).",
      },
      {
        title: "Tester l'eau sur zone visible",
        description:
          "Le test d'eau peut laisser une marque définitive sur vachetta authentique (absorption + marquage). Testez sur zone peu visible (sous la patte, intérieur du rabat). Sinon, compromis : goutte très petite + séchage immédiat avec coton.",
      },
      {
        title: "Rejeter la vachetta brune comme fake",
        description:
          "Un sac Gucci de 5+ ans a une vachetta patinée brune — c'est normal et signe d'authenticité. Rejeter « trop brun » est une erreur. Critiquer la patine revient à critiquer l'âge du sac, pas son authenticité.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme importent du cuir italien authentique (fournisseur DHG Italia ou similaires) et l'utilisent sur leurs fakes pour passer les tests tactiles. Le défaut : ils utilisent du cuir chrome-tanné italien (au lieu de végétal) car moins cher et traitement plus rapide. Le chrome-tannage donne un cuir visuellement similaire mais chimiquement différent : pas d'absorption d'eau, odeur plus chimique, patine qui ne se développe pas (couleur reste stable). Pour démasquer : test d'eau + test temporel (suivre le sac sur 6 mois, l'authentique patine, le fake reste identique). Évidemment ce test temporel n'est possible qu'après achat — mais utile pour authentifier un sac déjà possédé.",
    faqs: [
      {
        question: "Pourquoi mon sac Gucci a-t-il des taches irrégulières sur la vachetta ?",
        answer:
          "C'est normal et signe de cuir vivant. La vachetta absorbe tout ce qu'elle touche : transpiration, pluie, produits de maquillage, cuir d'autres sacs. Chaque tache raconte une histoire. Les collectionneurs recherchent ces marques qui rendent chaque sac unique. Pour ralentir la patine : appliquer un cuir-protecteur Collonil ou Apple Guard sur vachetta 2-3 fois par an. Pour accepter la patine : porter le sac normalement. Les deux approches sont valides — choix personnel.",
      },
      {
        question: "Tous les modèles Gucci ont-ils du cuir vachetta ?",
        answer:
          "Non. La vachetta est utilisée principalement comme finition (bordures, anses) sur les sacs canvas GG Supreme. Les sacs 100 % cuir (Padlock, Dionysus en cuir pleine peau) utilisent d'autres types de cuir : calfskin teint, python/crocodile sur éditions limitées, cuir embossé (GG Matelassé). Pour ces modèles, les critères vachetta ne s'appliquent pas — adaptez aux spécificités du cuir annoncé.",
      },
    ],
  },
];
