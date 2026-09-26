import type { GuideSignal } from "../../guide-types";

export const louisVuittonSignals: GuideSignal[] = [
  {
    slug: "code-date",
    name: "Date code Louis Vuitton",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Déchiffrer le date code LV : atelier, semaine, année",
    intro:
      "Jusqu'au passage à la puce (2021 selon les revendeurs spécialisés), Louis Vuitton marquait ses sacs d'un date code — une séquence de 2 lettres + 4 chiffres embossée discrètement dans une patte de cuir intérieure, souvent cachée sous une poche ou à l'intérieur d'un rabat. Ce code identifie l'atelier de fabrication (les 2 lettres) et la date de production (les 4 chiffres). Une même paire de lettres a pu désigner des ateliers différents selon les périodes : ne concluez pas à un pays sur les seules lettres. Selon les revendeurs spécialisés, les 4 chiffres se décodent différemment selon la période : de 1990 à 2006, 1er et 3e chiffres = mois, 2e et 4e = année (ex : 1003 = octobre 2003) ; depuis 2007, 1er et 3e chiffres = semaine, 2e et 4e = année (ex : 1179 = semaine 17 de 2019). Les codes des années 1980 ont un autre format. Ce décodage croisé avec le design du sac aide à repérer des incohérences : un modèle Neverfull (lancé en 2007) avec un date code antérieur à 2007 est un signal d'alerte fort. Sur les sacs récents, une puce invisible remplace le date code : un sac récent sans date code n'est pas suspect, et un code qui indiquerait une année postérieure à ce changement l'est.",
    steps: [
      {
        title: "Localiser le date code dans le sac",
        description:
          "Emplacements typiques : Neverfull = poche intérieure zippée, patte intérieure cachée sous la couture. Speedy = patte cuir courte sur la doublure interne. Alma = intérieur près de la fermeture zippée. Cherchez une patte discrète de 10-15 mm avec 6 caractères embossés.",
      },
      {
        title: "Noter précisément les 2 lettres + 4 chiffres",
        description:
          "Attention : confusion fréquente entre O et 0, entre I et 1. Utilisez une loupe x5 et une lumière rasante. Le code doit être net et lisible — un embossage flou ou inégal est un premier signal.",
      },
      {
        title: "Décoder l'atelier (2 lettres)",
        description:
          "Les 2 lettres désignent l'atelier. Des listes communautaires existent (Authentic4U, LVlovers) ; une même paire de lettres a pu servir à plusieurs ateliers selon les périodes. Un code d'atelier absent de ces listes est une alerte, pas une preuve.",
      },
      {
        title: "Décoder la semaine/année (4 chiffres post-2007)",
        description:
          "Format depuis 2007 : chiffre1 + chiffre3 = semaine (2 chiffres), chiffre2 + chiffre4 = année (2 chiffres). Exemple « 1179 » = semaine 17, année 19 (semaine du 22 avril 2019). Une semaine au-delà de 53 est impossible. Une année antérieure à 07 signale l'ancien format (mois + année, de 1990 à 2006) : décodez-la comme tel.",
      },
      {
        title: "Croiser date ↔ modèle",
        description:
          "Chaque modèle LV a une date de lancement : Neverfull = 2007, Capucines = 2013, Pochette Métis = 2012 selon les revendeurs spécialisés. Un date code antérieur à la date de lancement du modèle est un signal fort de contrefaçon : vérifiez cette date sur une source fiable avant de conclure.",
      },
    ],
    commonErrors: [
      {
        title: "Chercher un date code sur un sac LV récent",
        description:
          "Sur les sacs récents, une puce invisible remplace le date code : leur absence de code est normale. Un date code se juge sur l'année qu'il indique, pas sur la date d'achat du sac.",
      },
      {
        title: "Accepter un code 3 lettres ou 5 chiffres",
        description:
          "Depuis 1990, le format est 2 lettres + 4 chiffres. Un code à 3 lettres (« SPX1234 »), à 5 chiffres (« SP12345 ») ou avec des tirets (« SP-1234 ») ne correspond pas à ce format : c'est un signal d'alerte.",
      },
      {
        title: "Ignorer la profondeur d'embossage",
        description:
          "L'embossage authentique est régulier sur les 6 caractères. Un embossage irrégulier, ou un code imprimé à l'encre (pas embossé), est un signal fort. Passez l'ongle : sur un code bien conservé, vous devez sentir un relief.",
      },
    ],
    counterfeiterTactics:
      "Le format du date code est public : un faussaire peut produire un code cohérent (atelier, semaine, année), qui passe les vérifications de format. Le défaut reste l'embossage : les fakes utilisent une presse thermique trop chaude qui brûle légèrement le cuir autour de chaque caractère, laissant une auréole brunâtre visible à la loupe x10. Le date code authentique est embossé à froid, sans altération de couleur du cuir périphérique.",
    faqs: [
      {
        question: "Tous les LV antérieurs à la puce ont-ils un date code ?",
        answer:
          "Du début des années 1980 au passage à la puce (2021 selon les revendeurs spécialisés), les sacs LV portent un date code. Avant les années 1980, ils n'en avaient pas de façon systématique : une pièce vintage plus ancienne sans date code peut être authentique (vérifier plutôt la qualité des matériaux et des coutures). Un sac LV supposé « 1990 » sans date code est très suspect, sauf si le code s'est effacé avec l'usure.",
      },
      {
        question: "Un date code effacé (cuir frotté) invalide-t-il l'authentification ?",
        answer:
          "Il rend l'authentification plus difficile mais ne tranche pas. Sur les sacs très portés (>15 ans), le date code peut s'effacer par friction. Dans ce cas, focalisez-vous sur autres indicateurs : qualité du cuir vachetta, coutures moutarde, alignement monogramme, rivets laiton. Un sac vintage avec date code effacé mais tous autres signaux authentiques peut rester légitime. Inspecter à la loupe x10 sur plusieurs angles : parfois le code est simplement très peu visible, pas complètement effacé.",
      },
    ],
  },
  {
    slug: "monogramme-alignement",
    name: "Alignement du monogramme canvas",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Vérifier la symétrie et l'alignement du monogramme LV sur le canvas",
    intro:
      "Le canvas monogram — ce motif répétitif combinant fleur quadrilobée, fleur à 4 pétales, cercle avec 4 pétales et logo LV entrelacé — est la signature visuelle la plus iconique de Louis Vuitton. Son alignement sur les faces du sac est un indicateur d'authenticité d'une précision remarquable. LV impose sur ses manufactures un principe de symétrie parfaite : le monogramme doit être centré verticalement et horizontalement sur chaque face du sac, avec une symétrie miroir gauche/droite (les fleurs à gauche reflètent les fleurs à droite). Sur un Speedy 30 authentique, la fleur quadrilobée centrale de la face avant est à équidistance exacte des coutures gauche et droite, avec une tolérance de ±2 mm. Sur un Neverfull MM authentique, le motif est systématiquement coupé de la même manière aux 4 coins (les fleurs sont « tranchées » symétriquement par les coutures). Les contrefaçons butent quasi systématiquement sur ce point : le monogramme est décalé de 5-15 mm, les fleurs coupées aux coutures ne sont pas symétriques entre les 4 coins, ou le motif change de phase entre la face avant et la face arrière (impossibilité LV stricte). Cette asymétrie révèle que le faussaire a coupé son canvas sans aligner les coutures sur la grille du motif — erreur structurelle de production à bas coût. Vérifier cet alignement prend deux minutes avec un mètre souple et un œil critique.",
    steps: [
      {
        title: "Photographier les 4 faces du sac en plan perpendiculaire",
        description:
          "Posez le sac à plat (ou sur son cul selon modèle). Photographiez chaque face (avant, arrière, côté gauche, côté droit) perpendiculairement, avec une lumière diffuse pour éviter les ombres qui fausseraient la lecture du motif.",
      },
      {
        title: "Mesurer la distance fleur centrale ↔ couture gauche vs droite",
        description:
          "Sur la face avant : mesurez la distance entre le centre de la fleur quadrilobée centrale et la couture gauche, puis entre cette fleur et la couture droite. Les deux distances doivent être égales à ±2 mm. Un écart > 3 mm est un signal.",
      },
      {
        title: "Vérifier la symétrie aux 4 coins",
        description:
          "Aux 4 coins du sac, une fleur ou un LV est « coupé » par la couture. Cette coupe doit être symétrique : coin haut-gauche et coin haut-droit montrent la même portion de fleur coupée ; idem pour coins bas.",
      },
      {
        title: "Comparer face avant et face arrière",
        description:
          "Le monogramme des 2 faces principales doit être dans la même phase (mêmes motifs aux mêmes positions). LV utilise un canvas imprimé en continu et découpé en respectant la grille. Un décalage entre avant et arrière révèle un canvas mal coupé — signal fake.",
      },
      {
        title: "Contrôler les jonctions avec cuir vachetta",
        description:
          "Aux zones où le canvas rencontre le cuir vachetta (anses, base), la couture doit couper le motif proprement sans décalage. Une fleur dont la moitié est sur le canvas et l'autre moitié absente (tronquée sans raison visuelle) est suspecte.",
      },
    ],
    commonErrors: [
      {
        title: "Croire que LV tolère des petits décalages",
        description:
          "LV revendique publiquement sur son site et dans ses ateliers une symétrie parfaite. Des décalages de 1-2 mm sont la tolérance de fabrication ; au-delà, c'est un défaut qui n'aurait pas passé le contrôle qualité LV. Les « petits décalages » sur fakes se cumulent et sont visibles à l'œil.",
      },
      {
        title: "Confondre monogram canvas et monogram vernis",
        description:
          "Le monogram vernis (Alma BB, Vernis collection) a un rendu brillant et les couleurs des motifs varient. Appliquer les critères canvas (matité) sur vernis mène à un rejet erroné. Vérifiez le matériau avant d'appliquer les critères.",
      },
      {
        title: "Ignorer les décalages intentionnels sur collaborations",
        description:
          "Certaines collaborations LV × Virgil Abloh ou LV × Supreme ont des alignements volontairement décalés pour effet artistique. Ces décalages sont documentés sur louisvuitton.com. Rejeter ces modèles pour « mauvais alignement » est une erreur — croisez avec la liste des collaborations.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme (Mirror 1:1 de Guangzhou) impriment leur canvas avec une phase alignée sur les coutures — respect de la règle LV. Ils butent néanmoins sur un point : la grille du motif imprimé est légèrement plus serrée (4-5 %) que la grille LV authentique, car leurs imprimantes industrielles utilisent des rouleaux différents. Résultat : un Speedy 30 fake présente 15-16 fleurs en largeur là où l'authentique en présente 14-15. Compter les motifs sur une face (horizontalement et verticalement) et comparer avec une photo officielle LV.com permet de détecter ce micro-défaut systématique.",
    faqs: [
      {
        question: "Mon Neverfull semble avoir un monogramme décalé au milieu, est-il fake ?",
        answer:
          "Le Neverfull a une couture centrale verticale sur chaque face — le motif est « coupé » à cette couture et reprend de l'autre côté. Cette coupe doit rester symétrique (fleur coupée en deux parfaitement miroir). Si vous voyez une asymétrie à la couture centrale, c'est un signal fake. Si la couture coupe proprement et symétriquement, c'est normal et authentique. Photo de comparaison : page produit Neverfull sur louisvuitton.com.",
      },
      {
        question: "Le monogramme peut-il varier selon pays de fabrication ?",
        answer:
          "Non. Le canvas monogram LV est imprimé en France (usine de Asnières) et envoyé aux ateliers France/Espagne/Italie/USA pour découpe et assemblage. Le canvas est identique partout. Une différence d'alignement entre un sac « Made in France » et « Made in Spain » n'existe pas — les deux sont identiques ou les deux sont fakes.",
      },
    ],
  },
  {
    slug: "coutures-moutarde",
    name: "Coutures jaune moutarde",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Analyser le fil jaune moutarde LV : nuance, tension, régularité",
    intro:
      "La couture jaune moutarde est l'une des signatures les plus identifiables de Louis Vuitton sur ses produits canvas monogram. La teinte exacte — code approximatif Pantone 7562C — se distingue d'un jaune pur ou d'un ocre : c'est un jaune légèrement brunâtre, mat, jamais fluorescent. Cette teinte est stable depuis les années 1980 et respectée sur toutes les productions France, Espagne, Italie et USA. La couture authentique utilise un fil polyester 30 wt ciré, avec une tension ferme et régulière, 7 à 9 points par pouce (environ 2,8 à 3,5 mm entre chaque point), et un angle de 45° par rapport au plan de couture. Les contrefaçons trahissent trois erreurs récurrentes : 1) teinte incorrecte (jaune trop vif, orangé, ou jaune pâle), 2) tension irrégulière avec des points serrés alternant avec des points relâchés, 3) nombre de points par pouce inférieur (5-6 points/inch, couture visible grossière). Un détail plus subtil : la couture authentique présente une micro-ondulation en spirale due au cirage du fil — visible à la loupe x10 sur chaque point. Cette ondulation est le résultat du procédé d'industriel de cirage utilisé par LV depuis 1978 et jamais reproduit par les contrefacteurs. Ce test à la loupe x10 sur 5 cm de couture prend moins d'une minute ; il donne un signal, pas une preuve à lui seul.",
    steps: [
      {
        title: "Photographier la couture en macro",
        description:
          "Utilisez le mode macro de votre smartphone ou une loupe x10. Photographiez 5-10 cm de couture sur différentes zones (anses, base, poches) sous éclairage direct.",
      },
      {
        title: "Comparer la teinte avec la référence Pantone 7562C",
        description:
          "Le jaune moutarde LV est proche de Pantone 7562C (disponible en swatch gratuit sur pantone.com). Comparez sur écran calibré. Une teinte trop vive (jaune canari), trop orangée (ocre) ou trop pâle (beige-jaune) est suspecte.",
      },
      {
        title: "Compter les points par pouce",
        description:
          "Avec un réglet : comptez les points sur 1 pouce (2,54 cm). Authentique = 7 à 9 points/inch. Fake = souvent 5-6 points/inch (couture plus espacée, moins travaillée).",
      },
      {
        title: "Vérifier la tension des points",
        description:
          "Chaque point doit avoir la même tension. Un point relâché (boucle visible) ou un point trop serré (cuir pincé localement) trahit une couture à la machine mal calibrée. La tension LV est uniforme sur des mètres de couture.",
      },
      {
        title: "Observer l'ondulation du fil à la loupe",
        description:
          "À la loupe x10, chaque point présente une micro-ondulation en spirale (fil ciré LV). Les fakes utilisent du fil polyester standard non ciré — aucune ondulation, aspect lisse monotone.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter un jaune « proche » comme authentique",
        description:
          "La teinte LV est très spécifique. Un jaune « presque bon » qui tire vers l'orange ou vers le vert révèle un fil polyester fake teint approximativement. LV utilise le même bain de teinture depuis 40 ans — aucune variation tolérée.",
      },
      {
        title: "Valider uniquement sur la longueur de couture la plus visible",
        description:
          "Les faussaires soignent les coutures visibles (anses, face avant) et bâclent les zones cachées (doublure, poches intérieures). Inspectez systématiquement les zones peu visibles — un contraste de qualité entre zones est un signal.",
      },
      {
        title: "Ignorer la couleur aux points de jonction cuir/canvas",
        description:
          "Aux jonctions entre cuir vachetta et canvas, la couture moutarde traverse les deux matières. Sur authentique, la teinte reste identique. Sur fake, le fil peut changer subtilement de couleur à la transition (différent lot de fil utilisé) — signal de production non contrôlée.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires importent des fils polyester teints en Chine (fournisseurs type Coats Thread Guangzhou) avec des références qui imitent Pantone 7562C. Le problème : ces teintures chinoises utilisent des pigments différents de LV et se dégradent plus vite aux UV. Sur un sac authentique, la couture garde sa teinte 10-15 ans avant décoloration sensible. Sur fake, la couture pâlit visiblement en 2-3 ans d'exposition normale. Pour les sacs revendus « vintage » (5+ ans de port), comparer la couleur de couture entre zones exposées (dessus) et zones cachées (intérieur) : un différentiel important de teinte (dessus plus pâle que intérieur) est normal sur authentique ; une couture uniformément décolorée partout est suspecte (fake décoloré uniformément).",
    faqs: [
      {
        question: "Mon LV vintage a une couture plus claire que la photo officielle, fake ?",
        answer:
          "Pas nécessairement. Avec le temps (5-10 ans et plus), la couture jaune moutarde pâlit légèrement par oxydation naturelle du fil ciré. Cette patine est uniforme si le sac a été porté normalement, avec parfois des zones plus pâles aux points de friction (anses). Une couture « uniformément pâle » partout y compris dans la doublure cachée de la lumière, est plus suspecte — cela trahit une couleur de fabrication incorrecte (fake) plutôt qu'une patine naturelle.",
      },
      {
        question: "LV utilise-t-il d'autres couleurs de couture sur le canvas monogram ?",
        answer:
          "Très rarement. Le monogram canvas classique utilise exclusivement le jaune moutarde. Quelques éditions limitées ou collaborations (Damier Azur avec cuir blanc, certains vernis) utilisent des fils assortis à la couleur cuir (blanc, rose). Mais sur un Speedy monogram, Neverfull monogram, Alma monogram, la couture doit être jaune moutarde. Une couture marron, noire ou blanche sur un canvas monogram est un signal fake immédiat.",
      },
    ],
  },
  {
    slug: "rivets-laiton",
    name: "Rivets en laiton doré",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Authentifier les rivets LV : matière, gravure, poids, magnétisme",
    intro:
      "Les rivets métalliques qui fixent les anses, les pattes de selle et les pastilles de signature sur les sacs Louis Vuitton sont un élément d'authentification solide pour les contrôleurs expérimentés. Les rivets LV sont en laiton, avec une finition qui varie selon les modèles. Chaque rivet porte une gravure fine : « LOUIS VUITTON PARIS » en demi-cercle sur la face visible, réalisée par pressage à froid avec un outillage de précision. Quatre tests permettent de départager authentique et contrefaçon : 1) test magnétique — le laiton n'est pas magnétique, un rivet attiré par un aimant est en acier fake ; 2) test de poids — un rivet LV de taille standard pèse 4-6 grammes selon modèle, les rivets fakes en acier creux pèsent 2-3 grammes ; 3) lecture de la gravure — la police « LOUIS VUITTON PARIS » doit être parfaitement centrée, lettres fines, kerning régulier ; 4) finition — la surface du laiton authentique a un léger brossage satiné, pas un miroir brillant comme les rivets fake plaqués chrome. Ces quatre tests combinés forment un contrôle solide : les contrefaçons peinent à reproduire simultanément les quatre critères. Le test de l'aimant est le plus rapide et coûte zéro : un aimant néodyme de frigo suffit.",
    steps: [
      {
        title: "Identifier les rivets du sac",
        description:
          "Emplacements typiques : base des anses (2-4 rivets par anse), patte de selle (1-2 rivets), pastille de signature intérieure (1 rivet sur certains modèles). Repérez tous les rivets visibles avant tests.",
      },
      {
        title: "Test magnétique avec aimant néodyme",
        description:
          "Approchez un petit aimant néodyme (20-30 mm) de chaque rivet à 1 cm de distance. Le laiton authentique LV n'est PAS magnétique — aucune attraction. Un rivet attiré par l'aimant est en acier fake. Test décisif.",
      },
      {
        title: "Peser un rivet (si amovible)",
        description:
          "Si un rivet se détache (anciens sacs portés), pesez-le sur balance de précision (0,1 g). Rivet LV standard anses = 4,8-5,5 g. Rivet fake acier creux = 2,2-3,0 g. Différence immédiatement perceptible.",
      },
      {
        title: "Lire la gravure « LOUIS VUITTON PARIS »",
        description:
          "À la loupe x10 : police fine serif, kerning régulier, lettres lisibles. « LOUIS VUITTON » en haut, « PARIS » en bas, centré. Une gravure floue, décalée, ou une police différente (sans-serif) = fake.",
      },
      {
        title: "Examiner la finition de surface",
        description:
          "Le laiton LV authentique a un léger satiné mat (brossage fin). Les rivets fakes souvent chromés brillent comme un miroir. Sous lumière directe, le laiton mat renvoie une lueur douce, le chrome réfléchit l'environnement nettement.",
      },
    ],
    commonErrors: [
      {
        title: "Croire que la patine = contrefaçon",
        description:
          "Le laiton se patine avec le temps et l'usage : sa couleur peut foncer légèrement. Cette patine, régulière, est normale : elle ne signale pas une contrefaçon, et ne prouve pas non plus l'authenticité à elle seule. Un écaillage en plaques est un signal d'alerte, à croiser avec la gravure et les autres signaux.",
      },
      {
        title: "Tester avec un aimant trop fort",
        description:
          "Un aimant surpuissant (néodyme > 50 mm) peut faire bouger un rivet laiton authentique par effet inductif, faussant le test. Utilisez un aimant standard 20-30 mm. Distance 1 cm, pas au contact direct.",
      },
      {
        title: "Valider sur un seul rivet",
        description:
          "Les faussaires utilisent parfois des rivets d'origines mixtes (quelques rivets authentiques achetés à l'unité + majorité fakes). Testez TOUS les rivets du sac — l'authentification exige cohérence totale, pas un seul rivet authentique.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme utilisent des rivets en laiton réel (pas acier) importés de Guangzhou, pour passer le test magnétique. Ils butent néanmoins sur la gravure : la pression de leurs machines est insuffisante pour reproduire le relief « LOUIS VUITTON PARIS » avec la finesse LV. À la loupe x10, la gravure fake apparaît creuse de manière inégale (certaines lettres plus profondes que d'autres) et les bords des caractères sont légèrement flous (outil moins précis). LV utilise un outillage de précision horlogère qui laisse des bords parfaitement nets. Autre tactique : rivets authentiques volés dans les ateliers et revendus sur marché noir — mais en nombre très limité, ne permettant pas de monter une production fake complète, seulement quelques pièces « premium fakes » à 400-600 €.",
    faqs: [
      {
        question: "Tous les sacs LV ont-ils des rivets en laiton doré ?",
        answer:
          "Non. La majorité du canvas monogram utilise laiton doré. Mais certaines collections (Epi cuir silver hardware, Mahina, Nomade) utilisent du palladium (argenté), du ruthénium (gris foncé) ou du noir mat. Vérifiez la fiche produit LV.com du modèle exact pour connaître la finition hardware attendue. Un rivet argenté sur un Speedy monogram (attendu doré) est une alerte.",
      },
      {
        question: "Un rivet déformé par usure invalide-t-il l'authentification ?",
        answer:
          "Non. Un rivet peut se déformer légèrement après 10-20 ans d'usage intensif (pression répétée, chocs). La déformation est graduelle et uniforme. En revanche, un rivet qui bouge librement (jeu dans son logement), qui s'arrache en tirant doucement, ou qui a perdu sa dorure par plaques (pas uniformément), signale un rivet fake de mauvaise qualité.",
      },
    ],
  },
  {
    slug: "toile-canvas",
    name: "Toile canvas enduite",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Identifier la toile enduite LV : texture, rigidité, odeur, comportement",
    intro:
      "Le canvas monogram LV n'est pas un tissu imprimé mais une toile coton enduite (coated canvas) : une toile de coton densément tissée, puis recouverte d'une couche de PVC (polychlorure de vinyle) imprimée avec le motif monogram. Cette construction donne au canvas LV ses propriétés uniques : rigidité ferme mais flexible, résistance élevée à l'abrasion et aux liquides, surface légèrement texturée en grain de cuir simulé, et longévité exceptionnelle (un Speedy 30 porté quotidiennement 15 ans reste en bon état). Quatre caractéristiques physiques aident à distinguer authentique et contrefaçon : 1) rigidité contrôlée — le canvas LV se plie à 90° sans craqueler, mais ne « flotte » pas comme un tissu souple ; 2) texture grain de cuir — surface non lisse, micro-relief tactile perceptible au toucher ; 3) odeur neutre du PVC LV, sans chimie plastique agressive (les fakes dégagent souvent une odeur forte de PVC chinois mal stabilisé) ; 4) son à la friction — frotter le canvas avec le pouce produit un son sec, mat, pas un son « plastique » claquant. Les contrefaçons utilisent des PVC plus épais et plus rigides (canvas trop raide qui craquelle quand on plie) ou au contraire des PVC plus fins (canvas qui flotte comme un tissu). Ces quatre tests physiques ne demandent aucun outil et prennent une minute.",
    steps: [
      {
        title: "Tester la rigidité par pliage",
        description:
          "Pliez un coin du canvas à 90° sans forcer. Le canvas authentique revient à sa forme après pliage, sans marque. Un canvas qui craquelle visiblement à 90°, ou qui garde un pli marqué, est fake.",
      },
      {
        title: "Palper la texture grain de cuir",
        description:
          "Passez le pouce lentement sur le canvas : vous devez sentir un micro-relief régulier (grain de cuir simulé, environ 200 micromètres). Une surface parfaitement lisse (comme un plastique vernis) ou au contraire très rugueuse est suspecte.",
      },
      {
        title: "Sentir l'odeur du canvas",
        description:
          "Approchez le canvas du nez. LV authentique = odeur neutre, très légère odeur de cuir et de PVC stabilisé. Fake = odeur forte de plastique chimique, parfois piquante. Cette odeur peut persister des années sur fakes bas de gamme.",
      },
      {
        title: "Écouter le son de friction",
        description:
          "Frottez rapidement le canvas avec l'ongle. Authentique = son mat et sec. Fake = son plastique claquant, plus aigu.",
      },
      {
        title: "Examiner la trame textile interne",
        description:
          "Retournez le canvas si possible (zone cachée). La doublure interne LV est en coton tissé serré, visible au dos du PVC. Un canvas fake peut avoir un dos en non-tissé (fibres collées pressées) au lieu du coton tissé.",
      },
    ],
    commonErrors: [
      {
        title: "Juger la rigidité d'un sac neuf vs porté",
        description:
          "Un sac LV neuf (deadstock) est plus rigide qu'un sac porté 5 ans. La rigidité diminue progressivement avec l'usage — c'est normal. Comparez avec un Speedy neuf en boutique pour référencer la rigidité d'origine, puis jugez le sac en main par rapport à son âge déclaré.",
      },
      {
        title: "Croire qu'une odeur forte = toujours fake",
        description:
          "Un sac LV neuf, stocké longtemps dans un carton fermé, peut dégager une odeur PVC plus marquée (accumulation dans l'emballage). Après aération 24h, l'odeur doit disparaître ou devenir très discrète. Si elle persiste après plusieurs jours d'aération, c'est fake.",
      },
      {
        title: "Valider sur un seul critère (rigidité OU texture)",
        description:
          "Certains fakes haut de gamme réussissent la rigidité (bon PVC) mais ratent la texture (grain trop lisse), ou inversement. L'authentification exige la réussite des 4 critères combinés, pas d'un seul.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires importent des PVC de meilleure qualité depuis 2020 (fournisseurs coréens type Samsung Plastics) pour se rapprocher de la rigidité LV authentique. Le défaut résiduel est dans la couche d'impression : LV utilise une impression 5 couches (base blanche + 3 couches pigments + vernis protecteur) qui donne une profondeur de couleur unique. Les fakes impriment en 2-3 couches, résultat : sous lumière rasante (lampe torche orientée à 15° sur le canvas), les couleurs fake apparaissent plus « plates », plus 2D, tandis que le canvas LV authentique révèle une profondeur, un léger jeu de reflets sur les motifs dorés. Ce test lumière rasante est visuel et rapide.",
    faqs: [
      {
        question: "Le canvas monogram peut-il se décolorer avec le temps ?",
        answer:
          "Très peu. Le PVC LV utilise des pigments stabilisés aux UV qui résistent 15-20 ans sans décoloration visible. Une légère patine sur les zones très exposées (dessus, anses) peut apparaître après 10+ ans. Une décoloration visible sur un sac < 5 ans, ou une décoloration en plaques irrégulières, révèle un PVC fake sans stabilisation UV. Les fakes perdent de l'intensité couleur avec le temps.",
      },
      {
        question: "Pourquoi mon canvas neuf semble brillant et non mat ?",
        answer:
          "Le canvas LV est semi-mat : légèrement brillant, pas mat total ni brillant miroir. Un aspect brillant miroir est suspect (PVC fake vernis). Attention cependant : les sacs neufs sortis d'usine peuvent avoir une fine couche de cire de protection qui donne un aspect très brillant temporaire, disparaissant après 1-2 semaines d'usage normal. Observez plusieurs jours avant de conclure.",
      },
    ],
  },
  {
    slug: "puce-rfid",
    name: "Puce intégrée (sacs récents)",
    brandSlug: "louis-vuitton",
    category: "bags",
    tagline: "Ce que la puce des sacs LV récents permet de vérifier, et ce qu'elle ne permet pas",
    headline: "Puce des sacs Louis Vuitton récents : ce qu'elle prouve, et ce qu'elle ne prouve pas",
    intro:
      "Sur ses sacs récents, Louis Vuitton a remplacé le date code embossé par une puce intégrée, invisible. Selon les revendeurs spécialisés, le changement a commencé en 2021 et s'est fait progressivement ; la puce est le plus souvent placée sous la doublure ou dans une couture. Son contenu n'est lisible que par la maison : aucune appli publique n'authentifie un sac par sa puce. Un téléphone peut signaler une puce, ou ne rien détecter ; ni l'un ni l'autre ne prouve quoi que ce soit. Ce guide dit ce qu'on peut tirer de la puce, et surtout ce qu'on ne peut pas en tirer.",
    steps: [
      {
        title: "Ne pas exiger de date code sur un sac récent",
        description:
          "Une puce invisible remplace le date code sur les sacs récents. Un sac récent sans date code n'est donc pas suspect pour cette seule raison.",
      },
      {
        title: "Savoir ce qu'un téléphone peut montrer",
        description:
          "Une appli NFC peut signaler la présence d'une puce, sans en afficher le contenu. Elle peut aussi ne rien détecter : la réception dépend du téléphone, de sa coque et de l'emplacement de la puce.",
      },
      {
        title: "Ne rien conclure du scan",
        description:
          "Une puce qui répond ne prouve pas l'authenticité : une puce du commerce répond aussi. Une puce que le téléphone ne détecte pas ne prouve pas la contrefaçon.",
      },
      {
        title: "Demander la preuve d'achat",
        description:
          "Louis Vuitton indique ne vendre ses produits que dans ses boutiques, sur son site officiel et sur 24s.com. Demandez la facture ou le ticket de l'un de ces canaux, cohérent avec le sac et avec le récit du vendeur.",
      },
      {
        title: "Vérifier les signaux visibles",
        description:
          "Alignement du monogramme, toile, coutures, rivets : ces signaux se vérifient sur photo. Voir les autres guides Louis Vuitton.",
      },
    ],
    commonErrors: [
      {
        title: "Conclure à une contrefaçon faute de réponse NFC",
        description:
          "Un téléphone qui ne détecte pas de puce ne prouve rien : le modèle du téléphone, la coque ou l'emplacement de la puce peuvent l'expliquer.",
      },
      {
        title: "Prendre une réponse NFC pour une preuve",
        description:
          "N'importe quelle puce du commerce répond à un scan. Seul Louis Vuitton lit le contenu de ses puces.",
      },
      {
        title: "Juger un date code sur la date d'achat",
        description:
          "Un date code se juge sur l'année qu'il indique, pas sur la date à laquelle le sac a été acheté.",
      },
    ],
    counterfeiterTactics:
      "Certains vendeurs mettent en avant une puce qui « répond » au téléphone, ou une appli qui « confirme » l'authenticité. Aucune appli publique ne lit le contenu des puces Louis Vuitton : cet argument ne prouve rien. Jugez le sac sur ses signaux visibles et sur sa preuve d'achat.",
    faqs: [
      {
        question: "Mon sac récent ne répond à aucun scan NFC : est-il faux ?",
        answer:
          "Pas pour cette raison. La détection dépend du téléphone, de sa coque et de l'emplacement de la puce, et le contenu de la puce n'est lisible que par Louis Vuitton. Jugez sur les signaux visibles et sur la preuve d'achat.",
      },
      {
        question: "Peut-on vérifier la puce d'un sac Louis Vuitton avec une appli ?",
        answer:
          "Non. Une appli NFC comme NFC Tools peut au mieux signaler qu'une puce est présente. Selon les revendeurs spécialisés, aucune appli publique ne lit le contenu des puces Louis Vuitton ni n'authentifie un sac par ce moyen.",
      },
    ],
  },
];
