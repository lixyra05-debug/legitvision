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
          "Sur une partie de ses sacs récents, oui : selon les revendeurs spécialisés, une étiquette en tissu noir portant un QR code est cousue à l'intérieur, en plus de la patte qui porte le numéro de série, depuis le milieu des années 2010 (les dates avancées varient d'une source à l'autre). Son absence ne prouve pas une contrefaçon, et un scan, reconnu ou non, ne prouve rien à lui seul : voir le guide Gucci consacré au QR code.",
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
          "Très peu. Le PVC avec vernis protecteur Gucci résiste 10-15 ans sans décoloration notable. Sur des sacs vintage (15+ ans), un léger brunissement des zones exposées est possible. Un sac < 5 ans avec décoloration visible révèle un PVC fake sans stabilisation UV. Les fakes perdent de l'intensité couleur avec le temps.",
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
      "Chaque pièce de hardware métallique sur un sac Gucci (boucles, anneaux, fermoirs, rivets, piercings) porte une gravure précise, généralement « GUCCI » en majuscules serif avec police Garamond modifiée, ou « GUCCI MADE IN ITALY » sur les pièces plus grandes. Cette gravure est embossée à froid par pressage mécanique avec une profondeur de 0,2-0,4 mm, parfaitement nette, kerning régulier. Le hardware existe en plusieurs finitions (dorée, argentée, ruthénium) selon le modèle : sa couleur seule ne dit rien de l'authenticité. Quatre tests discriminent authentique et fake : 1) test magnétique — laiton non magnétique, un hardware attiré par aimant = acier fake ; 2) lecture à la loupe x10 — gravure Gucci authentique a des lignes fines, nettes, sans bavure ; 3) test de poids — un fermoir Gucci standard pèse 8-15 g selon modèle, fake creux 4-7 g ; 4) comportement thermique — le laiton chauffe lentement à température ambiante (moins conductif que l'acier), l'acier fake se réchauffe rapidement au contact. Aucun de ces tests ne suffit seul : leur combinaison donne un signal plus solide, à croiser avec les autres signaux du sac, sans constituer une preuve. La gravure « GUCCI » peut également apparaître avec le logo GG entrelacé sur certaines pièces — même critères de netteté et kerning.",
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
          "Quelle que soit la finition (dorée, argentée, ruthénium), la surface d'une pièce neuve est régulière, sans bulle, piqûre ni zone terne isolée. Sa couleur et son éclat seuls ne disent rien de l'authenticité. Un placage irrégulier ou qui s'écaille est un signal d'alerte à croiser avec la gravure.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter une gravure « Gucci » en minuscules",
        description:
          "Gucci grave EN MAJUSCULES (« GUCCI »). Une gravure en minuscules (« gucci ») n'existe pas sur hardware Gucci authentique — c'est une erreur fake fréquente. Rejet immédiat.",
      },
      {
        title: "Confondre usure régulière et écaillage en plaques",
        description:
          "Avec l'usage, le hardware perd de son brillant et prend une teinte plus chaude. Une usure régulière est normale et ne prouve rien, ni dans un sens ni dans l'autre. Un écaillage en plaques, qui laisse voir un métal gris, est un signal d'alerte à croiser avec la gravure et les autres signaux, pas une preuve.",
      },
      {
        title: "Tester l'aimant trop près",
        description:
          "Un aimant très puissant (néodyme 50+ mm) peut faire bouger un laiton par induction. Utilisez un aimant standard 20-30 mm à 1 cm de distance. Pas au contact.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme utilisent du laiton réel (non magnétique) avec gravure quasi-parfaite — résolvant les critères simples. Le défaut résiduel peut être la finition du plaquage : sur une contrefaçon, il s'use souvent vite et par plaques, aux angles et aux coins, révélant le métal en dessous. Un plaquage impeccable sur un sac « neuf » ne prouve rien. Sur une pièce portée, une usure en plaques est un signal d'alerte, pas une preuve : le plaquage d'un sac authentique finit aussi par s'user aux points de friction.",
    faqs: [
      {
        question: "Le hardware Gucci peut-il se ternir avec l'âge ?",
        answer:
          "Oui. Avec l'usage (transpiration, humidité, frottements), le hardware peut perdre de son brillant et prendre une teinte plus chaude. Cette usure, régulière, est normale et ne dit rien à elle seule de l'authenticité. Un écaillage ou un noircissement en plaques irrégulières est un signal d'alerte, à croiser avec la gravure et les autres signaux.",
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
    name: "QR code intérieur (sacs récents)",
    brandSlug: "gucci",
    category: "bags",
    tagline: "Ce que le QR code des sacs Gucci récents permet de vérifier, et ce qu'il ne permet pas",
    headline: "QR code des sacs Gucci : ce qu'il prouve, et ce qu'il ne prouve pas",
    intro:
      "Sur une partie de ses sacs récents, Gucci coud à l'intérieur une petite étiquette en tissu noir portant un QR code, distincte de la patte en cuir qui porte le numéro de série. Selon les revendeurs spécialisés, elle apparaît au milieu des années 2010, sans date nette (les sources ne s'accordent pas), et les petites pièces n'en ont souvent pas. L'application officielle Gucci annonce, dans sa description sur l'App Store, permettre de « scanner le certificat d'authenticité des articles sélectionnés » : tous les articles ne sont donc pas concernés. Un QR code se recopie à l'identique : un code reconnu ne prouve pas, à lui seul, que le sac en main est authentique, et un code que l'application ne reconnaît pas ne prouve pas la contrefaçon. Ce guide dit ce qu'on peut tirer de ce QR code, et surtout ce qu'on ne peut pas en tirer.",
    steps: [
      {
        title: "Ne pas exiger de QR code",
        description:
          "Tous les sacs Gucci n'ont pas d'étiquette à QR code : selon les revendeurs spécialisés, les sacs plus anciens n'en ont pas, et les petites pièces souvent pas. Un sac sans QR code n'est donc pas suspect pour cette seule raison.",
      },
      {
        title: "Savoir ce qu'un scan peut montrer",
        description:
          "L'application officielle Gucci annonce pouvoir scanner le certificat d'authenticité de certains articles seulement. Selon les revendeurs spécialisés, les lecteurs de QR code courants ne lisent pas ce code : leur échec ne dit rien du sac.",
      },
      {
        title: "Ne rien conclure du scan",
        description:
          "Un code reconnu ne prouve pas l'authenticité : un QR code se recopie à l'identique. Un code que l'application ne reconnaît pas ne prouve pas la contrefaçon : l'article peut ne pas faire partie des articles concernés, ou l'étiquette être abîmée.",
      },
      {
        title: "Demander la preuve d'achat",
        description:
          "Demandez la facture ou le ticket d'achat d'origine, cohérent avec le sac et avec le récit du vendeur.",
      },
      {
        title: "Vérifier les signaux visibles",
        description:
          "Numéro de série, gravure du hardware, motif GG, cuir : ces signaux se vérifient sur photo. Voir les autres guides Gucci.",
      },
    ],
    commonErrors: [
      {
        title: "Conclure à une contrefaçon faute de réponse au scan",
        description:
          "Un QR code que l'application ou un lecteur ne reconnaît pas ne prouve rien : l'article peut ne pas être concerné, l'étiquette peut être abîmée, et un lecteur courant peut ne pas savoir le lire.",
      },
      {
        title: "Prendre un scan reconnu pour une preuve",
        description:
          "Un QR code se recopie à l'identique : un code reconnu ne dit pas que le sac en main est celui auquel il a été attribué.",
      },
      {
        title: "Se fier à la page qu'ouvre un QR code",
        description:
          "N'importe qui peut créer un QR code qui mène à une page imitant Gucci et « confirmant » l'authenticité. Une telle page ne prouve rien, même si son adresse ressemble à celle de Gucci.",
      },
    ],
    counterfeiterTactics:
      "Certains vendeurs mettent en avant un QR code qui « fonctionne », ou une page qui « confirme » l'authenticité. Un QR code se recopie, et n'importe qui peut en créer un qui mène à une page imitant Gucci : cet argument ne prouve rien. L'étiquette elle-même se reproduit comme le reste du sac : sa présence ne prouve rien non plus. Jugez le sac sur ses signaux visibles et sur sa preuve d'achat.",
    faqs: [
      {
        question: "Mon sac Gucci n'a pas de QR code : est-il faux ?",
        answer:
          "Pas pour cette raison. Selon les revendeurs spécialisés, les sacs plus anciens n'ont pas d'étiquette à QR code, les petites pièces souvent pas, et les dates d'apparition avancées varient d'une source à l'autre. Jugez sur les signaux visibles et sur la preuve d'achat.",
      },
      {
        question: "Peut-on vérifier le QR code d'un sac Gucci avec une appli ?",
        answer:
          "L'application officielle Gucci annonce pouvoir scanner le certificat d'authenticité de certains articles. Un scan reconnu ne prouve pas, à lui seul, l'authenticité, puisqu'un QR code se recopie ; un scan qui échoue ne prouve pas la contrefaçon. Selon les revendeurs spécialisés, les lecteurs de QR code courants ne lisent pas ce code. Jugez sur les signaux visibles et sur la preuve d'achat.",
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
          "Une vachetta qui a bruni avec l'âge et l'usage est normale : sa couleur ne dit rien, à elle seule, de l'authenticité. Rejeter « trop brun » est une erreur. Critiquer la patine revient à critiquer l'âge du sac, pas son authenticité.",
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
