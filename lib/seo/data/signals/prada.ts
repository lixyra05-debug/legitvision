import type { GuideSignal } from "../../guide-types";

export const pradaSignals: GuideSignal[] = [
  {
    slug: "triangle-logo",
    name: "Plaque triangulaire métallique",
    brandSlug: "prada",
    category: "bags",
    tagline: "Authentifier la plaque triangle Prada : gravure, fixation, matériau",
    intro:
      "La plaque triangulaire métallique Prada est l'élément visuel le plus immédiatement identifiable de la marque. C'est une plaque en forme de triangle inversé (pointe vers le bas), mesurant typiquement 35-45 mm de large selon modèle, fixée par 2 vis métalliques au dos du sac. La face visible est gravée « PRADA » en haut, « MILANO » au milieu, « DAL 1913 » (ou « TESSUTO » / « SAFFIANO » selon version) en bas, en majuscules serif avec empattements nets, police propriétaire Prada. Le matériau authentique est soit l'acier inoxydable poli miroir (finition classique), soit le laiton plaqué or 24 carats (finition gold). Contrairement à de nombreuses marques, Prada utilise parfois de l'acier (finition chrome) sur ses modèles classiques — le test magnétique ne s'applique donc pas de la même manière que LV ou Chanel. Les contrefaçons trahissent : 1) gravure floue avec police approximative, 2) fixation par clips ou colle au lieu de 2 vis authentiques, 3) matériau léger plastique chromé au lieu de métal massif, 4) dimensions hors standard (triangle trop petit ou trop grand). Test de poids : plaque authentique 8-15 g selon modèle. Plaque plastique chromé fake 3-5 g. Le test visuel à la loupe x10 de la gravure + inspection des vis de fixation tranchent efficacement.",
    steps: [
      {
        title: "Localiser la plaque triangulaire",
        description:
          "Positionnée au centre de la face avant (Galleria, Re-Edition) ou sous la patte avant (Cleo). Triangle inversé (pointe bas), 35-45 mm de large.",
      },
      {
        title: "Examiner la face visible gravée",
        description:
          "Lignes typiques : « PRADA » haut + « MILANO » milieu + « DAL 1913 » bas (ou autre mention selon version). Majuscules serif, empattements nets, police propriétaire. À la loupe x10 : kerning régulier, profondeur 0,3-0,5 mm.",
      },
      {
        title: "Vérifier la fixation par 2 vis",
        description:
          "Regardez le DOS de la plaque (intérieur du sac) : 2 vis métalliques parfaitement visibles. Une plaque fixée par colle (pas de vis) ou par clips plastiques = fake. Les vis authentiques sont gravées « PRADA » au centre.",
      },
      {
        title: "Peser la plaque (si accessible)",
        description:
          "Si la plaque est amovible (vis accessibles, démontage possible sans dommage) : pesez. 8-15 g = authentique. 3-5 g = plastique chromé fake. Ne démontez pas sur sac à conserver intact.",
      },
      {
        title: "Tester le matériau par contact",
        description:
          "Plaque métal authentique = température ambiante, fraîcheur tactile au premier contact. Plaque plastique fake = chaleur rapide au contact (conductivité plus faible). Test simple prenant 10 secondes.",
      },
    ],
    commonErrors: [
      {
        title: "Tester magnétiquement un acier authentique",
        description:
          "Prada utilise parfois de l'acier (magnétique) sur ses plaques — contrairement à Gucci/Chanel qui utilisent toujours laiton. Une attraction à l'aimant NE signifie PAS fake chez Prada. Vérifiez avec autres critères (gravure, vis, poids).",
      },
      {
        title: "Accepter une plaque gravée « PRADA » uniquement",
        description:
          "La plaque authentique a TOUJOURS 3 lignes minimum : PRADA + MILANO + DAL 1913 (ou variante). Une plaque gravée « PRADA » seul, sans Milano ni Dal 1913 = fake simplifié. Rejet immédiat.",
      },
      {
        title: "Ignorer les vis de fixation",
        description:
          "Les 2 vis sont signatures Prada. Elles doivent être gravées « PRADA » au centre (gravure minuscule visible à la loupe x10). Vis non-gravées, ou plaque collée sans vis, = fake.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme utilisent des plaques métal réelles avec gravure quasi-parfaite. Le défaut résiduel : les VIS de fixation. Prada grave « PRADA » sur la tête de chaque vis avec des empattements fins spécifiques. Les fakes utilisent des vis standard industrielles avec gravure absente ou approximative. À la loupe x10, inspection des 2 vis au dos de la plaque révèle immédiatement : authentique = gravure PRADA nette sur tête de vis, fake = vis lisse ou gravure floutée. Ce détail est systématique et rapidement discriminant.",
    faqs: [
      {
        question: "Prada utilise-t-il toujours de l'acier ou parfois du laiton ?",
        answer:
          "Les deux, selon modèle et finition. Acier inoxydable poli (finition chrome/silver) sur modèles classiques Galleria, Re-Edition 2005, Cleo. Laiton plaqué or 24k (finition gold) sur certaines éditions limitées et versions « gold hardware ». Le test magnétique n'est PAS discriminant chez Prada — focalisez sur gravure, vis, et poids absolu.",
      },
      {
        question: "Un sac Prada « vintage 1995 » a-t-il la même plaque ?",
        answer:
          "Oui, la plaque triangle Prada est un design stable depuis les années 80. Les variations sont subtiles (taille légèrement différente selon génération, mention « DAL 1913 » introduite dans les années 90). Un vintage 1995 doit avoir une plaque avec gravure PRADA + MILANO, potentiellement sans « DAL 1913 » (qui apparaît plus tard). Vérifiez avec référence photographique vintage Prada.",
      },
    ],
  },
  {
    slug: "numero-serie",
    name: "Numéro de série et carte d'authenticité",
    brandSlug: "prada",
    category: "bags",
    tagline: "Vérifier la carte d'authenticité Prada et son numéro",
    intro:
      "Chaque sac Prada est livré avec une carte d'authenticité en plastique blanc rigide, format 85×55 mm (taille carte de crédit), portant un numéro de série à 7 chiffres identifiant uniquement le sac. Ce même numéro est embossé discrètement sur un morceau de cuir intérieur (patte de cuir sous la doublure). La carte porte également le logo Prada (triangle ou lettres), la mention « AUTENTICA » et parfois un QR code (versions post-2021). Le numéro à 7 chiffres suit une structure interne Prada (les 2-3 premiers chiffres identifient la collection/année approximative). Les contrefaçons proposent souvent des cartes quasi-identiques visuellement mais avec trois défauts : 1) plastique trop fin ou trop épais (carte authentique Prada = 0,76 mm, norme carte bancaire, ±0,05 mm tolérance), 2) numéro sur carte différent du numéro embossé sur cuir intérieur, 3) impression de mauvaise qualité (jet d'encre bave sur les caractères vs impression offset nette Prada authentique). Le test croisé numéro carte ↔ numéro cuir est le plus rapide et décisif. Les cartes manquantes (perdues avec le temps) n'invalident pas automatiquement l'authentification si le numéro cuir est cohérent — mais réduisent la valeur revente de 15-25 %.",
    steps: [
      {
        title: "Vérifier la présence de la carte d'authenticité",
        description:
          "Carte plastique blanc rigide, 85×55 mm, avec logo Prada, numéro, mention « AUTENTICA ». Normalement livrée dans un dustbag ou poche spécifique du sac.",
      },
      {
        title: "Noter le numéro à 7 chiffres",
        description:
          "7 chiffres consécutifs (ex : « 1234567 »). Police authentique = Helvetica Medium. Impression offset nette, sans bavure.",
      },
      {
        title: "Localiser le numéro embossé sur cuir intérieur",
        description:
          "Patte de cuir interne, souvent sous la doublure près de la fermeture. Numéro identique à celui de la carte, embossé à chaud avec profondeur 0,3-0,5 mm.",
      },
      {
        title: "Cross-check numéros carte ↔ cuir",
        description:
          "Les deux numéros doivent être STRICTEMENT identiques, chiffre par chiffre. Différentiel = fake ou sac reconstitué (carte d'un autre sac).",
      },
      {
        title: "Vérifier l'épaisseur de la carte",
        description:
          "Mesurez avec pied à coulisse si disponible : 0,76 mm = norme carte bancaire ISO 7810. Une carte significativement plus fine (0,5 mm) ou plus épaisse (1 mm) = fake imprimé sur plastique non-standard.",
      },
    ],
    commonErrors: [
      {
        title: "Valider uniquement sur la carte sans cross-check cuir",
        description:
          "Carte authentique copiée + collée sur fake : fréquent. Le cross-check numéro carte ↔ cuir intérieur est essentiel. Un numéro cohérent sur carte SEULE ne prouve pas l'authenticité.",
      },
      {
        title: "Rejeter un sac sans carte",
        description:
          "Les cartes sont souvent perdues avec le temps (jetées par ignorance, extraites du dustbag et non-retrouvées). Un sac Prada authentique peut ne plus avoir sa carte, ce qui n'invalide pas l'authentification — si le numéro cuir est cohérent et les autres indicateurs positifs.",
      },
      {
        title: "Accepter une carte blanche mate",
        description:
          "La carte Prada authentique est en plastique blanc satiné (pas mat, pas brillant miroir). Une finition mat ou brillant excessif révèle un plastique fake standard industriel.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires génèrent des cartes d'authenticité avec imprimantes plastiques (similaires à cartes fidélité commerçants) en utilisant des numéros aléatoires à 7 chiffres. Le défaut principal : ils ne synchronisent PAS la carte avec le numéro embossé sur cuir. Un fake produit en série peut avoir la même carte (numéro identique) dupliquée sur des dizaines de sacs — alors que les authentiques ont chacun leur numéro unique. Si vous voyez plusieurs sacs Prada suspects sur plateformes secondaires avec le même numéro carte, c'est la confirmation fake. Autre tactique post-2021 : fakes avec QR code pointant vers page HTML clonée Prada — URL non-officielle, détectable.",
    faqs: [
      {
        question: "Prada utilise-t-il un QR code pour authentifier ?",
        answer:
          "Depuis 2021 pour certains modèles premium, oui. QR code sur la carte d'authenticité ou à l'intérieur du sac, scannable via l'app Prada officielle pour vérification digitale. Un sac Prada post-2021 premium sans QR code peut être suspect. Pour modèles classiques et pré-2021, pas de QR — normal. Vérifiez avec la fiche produit Prada.com pour savoir si QR attendu sur votre modèle.",
      },
      {
        question: "La carte d'authenticité peut-elle être jaunie avec le temps ?",
        answer:
          "Oui, légèrement. Le plastique de la carte jaunit avec exposition UV et chaleur après 5-10 ans. Une légère teinte crème est normale sur cartes vintage. Une décoloration en plaques ou jaunissement très rapide (< 2 ans) révèle un plastique fake de mauvaise qualité (PVC non-stabilisé UV).",
      },
    ],
  },
  {
    slug: "zip-lampo",
    name: "Zip Lampo (fournisseur italien)",
    brandSlug: "prada",
    category: "bags",
    tagline: "Identifier les zips Lampo utilisés par Prada",
    intro:
      "Prada utilise presque exclusivement des zips fabriqués par le fournisseur italien Lampo (Bergamo, Italie) — l'un des deux principaux fabricants de zips haut de gamme avec le japonais YKK. Lampo produit des zips de haute qualité depuis 1887, exclusivement en Italie. Chaque zip Lampo porte la gravure « LAMPO » sur la tirette (face intérieure ou extérieure selon modèle), en lettres capitales simples. Le curseur (le mécanisme mobile) est gravé « PRADA » sur la face visible pour la plupart des sacs. Les caractéristiques techniques : tirette en laiton massif plaqué or ou palladium (non magnétique), rails en laiton peint assorti à la couleur du sac, glissement fluide sans accrochage, son caractéristique lors du zip-up/zip-down (son mat et régulier, pas aigu). Les contrefaçons utilisent soit des zips YKK chinois contrefaits (Prada utilise très rarement YKK sur ses pièces premium), soit des zips génériques sans marque. Le test rapide : lire la gravure « LAMPO » sur la tirette + tester le glissement. Un zip sans « LAMPO » gravé sur tirette = très suspect. Un zip qui accroche, qui sonne « plastique » ou qui ne revient pas à sa position fermée = fake mécanique bas de gamme.",
    steps: [
      {
        title: "Localiser les zips du sac",
        description:
          "Fermeture principale, poches intérieures, éventuellement poche extérieure. Chaque zip à inspecter.",
      },
      {
        title: "Lire la gravure « LAMPO » sur tirette",
        description:
          "Retournez la tirette et inspectez la face intérieure (ou extérieure selon modèle). Gravure « LAMPO » en majuscules simples, kerning régulier. Absence = suspect. Gravure « YKK » = attention, Prada utilise rarement YKK.",
      },
      {
        title: "Vérifier la gravure « PRADA » sur curseur",
        description:
          "Le curseur (mécanisme mobile) porte la gravure « PRADA » sur face visible. Police Helvetica Medium. Gravure profonde, nette. Absence ou police différente = fake.",
      },
      {
        title: "Tester le glissement",
        description:
          "Fermez/ouvrez le zip plusieurs fois. Authentique = glissement fluide, sans accrochage, son mat régulier. Fake = accrochages aux dents, son aigu métallique, parfois coincement.",
      },
      {
        title: "Test magnétique sur tirette et curseur",
        description:
          "Aimant néodyme : laiton Lampo = non magnétique. Un zip attiré par aimant = acier plaqué fake (typique des zips chinois bas de gamme).",
      },
    ],
    commonErrors: [
      {
        title: "Accepter des zips YKK comme toujours authentiques",
        description:
          "YKK est un fournisseur premium mais Prada utilise principalement Lampo. Un zip YKK sur Prada moderne (post-2000) est suspect — Prada a des partenariats exclusifs avec Lampo pour ses collections signatures. Exception : quelques collaborations Prada × streetwear peuvent utiliser YKK ponctuellement.",
      },
      {
        title: "Tester le zip une seule fois",
        description:
          "Le glissement peut sembler fluide une fois puis accrocher. Testez 5-10 fois minimum, en fermant et ouvrant complètement. Un zip fake finit par montrer son défaut (accrochage, coincement) en usage répété.",
      },
      {
        title: "Ignorer la couleur des rails",
        description:
          "Les rails (bordures du zip) sont peints assortis à la couleur du sac (noir, beige, rouge). Une couleur discordante révèle un zip d'occasion reutilisé ou un fake mal assorti.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme importent des zips Lampo authentiques achetés au détail (revendeurs italiens, 15-30 € le zip complet). Ils les intègrent sur leurs fakes pour passer le test « zip Lampo ». Le défaut : la qualité du mécanisme curseur. Les zips Lampo authentiques utilisent un mécanisme à ressorts avec 6-8 pistons. Les curseurs fakes achetés en lot ont 3-4 pistons, moins fluides. Test pratique : tirer vigoureusement sur la tirette avec le zip fermé — authentique Prada ne s'ouvre pas, curseur fake peut s'ouvrir par glissement (mécanisme insuffisant). Autre tactique : gravure « LAMPO » copiée sur zips chinois — police approximative détectable à la loupe x10.",
    faqs: [
      {
        question: "Tous les sacs Prada ont-ils des zips Lampo ?",
        answer:
          "Quasi tous, pour maroquinerie premium. Les modèles classiques (Galleria, Cleo, Re-Edition) utilisent Lampo systématiquement. Quelques modèles entry-level (accessoires, petite maroquinerie) peuvent utiliser d'autres fournisseurs italiens (Riri, Opti) — restant haute qualité. YKK est très rare sur Prada sauf éditions streetwear. Vérifiez avec photo officielle Prada.com de votre modèle.",
      },
      {
        question: "Un zip Lampo peut-il lâcher avec le temps ?",
        answer:
          "Très rarement. Les zips Lampo sont conçus pour durer 15-20 ans avec usage intensif. Un zip qui casse sur un Prada de 3-5 ans révèle soit un zip fake (curseur faible), soit un dommage exceptionnel. Prada propose un service de réparation (remplacement zip) — utilisez-le pour authentiques. Évitez les réparations non-officielles qui remplaceraient par un zip non-Lampo et invalideraient partiellement l'authenticité.",
      },
    ],
  },
  {
    slug: "doublure-jacquard",
    name: "Doublure jacquard logo",
    brandSlug: "prada",
    category: "bags",
    tagline: "Inspecter la doublure jacquard « PRADA » intérieure",
    intro:
      "La doublure intérieure des sacs Prada (Galleria, Cleo, Re-Edition) est un jacquard tissé noir (ou crème selon modèle) avec le mot « PRADA » répété en motif. Ce n'est pas un simple textile imprimé — c'est un véritable jacquard tissé où le motif est intégré dans la trame du tissu, donnant un relief tactile subtil et une durabilité supérieure. Les caractéristiques techniques : fils de viscose ou polyester-soie haute qualité, trame serrée 120-140 fils/cm², motif « PRADA » en majuscules avec kerning régulier, espacement vertical 4 cm entre les lignes de texte, espacement horizontal variable. Le textile est souple mais tenu, avec un toucher soyeux et un reflet discret. Les contrefaçons utilisent souvent un textile imprimé (impression sur polyester standard) qui imite visuellement le motif mais n'a pas la structure jacquard. Test de distinction : retourner le textile côté intérieur. Sur jacquard authentique, vous voyez le motif inversé (fil visible au dos, textile réversible par nature tissée). Sur textile imprimé fake, le dos est uniforme (impression unilatérale). Ce test prend 5 secondes. Autre test : passage d'ongle sur le motif — jacquard authentique a un relief tactile (léger), imprimé fake est parfaitement plat.",
    steps: [
      {
        title: "Accéder à la doublure intérieure",
        description:
          "Ouvrez le sac complètement. La doublure textile noire (ou crème) est visible. Focalisez sur les zones sans coutures pour inspection.",
      },
      {
        title: "Inspecter le motif « PRADA » en face visible",
        description:
          "Motif en majuscules, répété verticalement et horizontalement. Kerning régulier, police sans-serif épurée. Couleur : gris moyen sur fond noir (pas blanc pur sur noir, ce qui serait fake).",
      },
      {
        title: "Retourner la doublure (côté caché)",
        description:
          "Tirez doucement sur un bord de la doublure pour exposer l'envers (sans déchirer). Sur jacquard authentique : motif « PRADA » visible inversé (fil). Sur imprimé fake : dos uniforme noir sans motif.",
      },
      {
        title: "Test tactile du relief",
        description:
          "Passez l'ongle sur le motif « PRADA ». Authentique jacquard = léger relief tactile perceptible (tissage en relief). Fake imprimé = parfaitement plat.",
      },
      {
        title: "Contrôler la densité de trame",
        description:
          "À la loupe x10 : fils fins tissés densément (120-140 fils/cm²). Fake : fils plus épais et trame plus lâche (80-100 fils/cm²), aspect moins luxueux.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre jacquard et toile imprimée",
        description:
          "L'œil nu peut confondre les deux à distance de 1 m. À 30 cm ou avec loupe, la différence est nette : jacquard = motif en relief, toile imprimée = motif plat. Ne jugez pas à distance.",
      },
      {
        title: "Rejeter une doublure usée comme fake",
        description:
          "Les doublures vieillissent avec usage : légères peluches, décoloration possible. C'est normal après 5-10 ans. Une doublure « neuve » sur sac vintage 10 ans est plus suspecte (doublure remplacée ou fake sur prétendu vintage).",
      },
      {
        title: "Accepter un motif « PRADA » mal kerné",
        description:
          "Le kerning est régulier sur jacquard authentique (tissage industriel précis). Un kerning irrégulier (lettres trop rapprochées ou espacées de manière aléatoire) révèle un imprimé fake avec outil calibré approximativement.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme produisent parfois des doublures en véritable jacquard — nécessitant du matériel industriel disponible en Asie. Le défaut résiduel : la fibre utilisée. Prada utilise viscose ou polyester-soie avec un toucher soyeux caractéristique. Les fakes utilisent polyester standard plus rêche. Test sensoriel : frotter légèrement la doublure contre le dos de la main. Authentique = glissement soyeux. Fake = sensation plus rugueuse, moins luxueuse. Autre tactique : doublures fake avec motif « PRADA » imprimé sur polyester bas de gamme (très commun sur fakes bas-moyen). Test de retournement détecte immédiatement.",
    faqs: [
      {
        question: "Toutes les doublures Prada sont-elles jacquard PRADA ?",
        answer:
          "Non. Les Galleria, Cleo, Re-Edition utilisent jacquard PRADA. D'autres modèles peuvent avoir des doublures différentes : cuir (modèles tout-cuir premium), textile uni (collections spéciales), Re-Nylon intérieur (même matière que extérieur sur certaines versions). Vérifiez la fiche produit Prada.com pour connaître la doublure attendue de votre modèle.",
      },
      {
        question: "La doublure peut-elle se déchirer facilement ?",
        answer:
          "Non. Le jacquard Prada est conçu pour résister 10-15 ans avec usage normal. Une doublure déchirée sur sac < 5 ans d'usage normal révèle soit un fake (textile faible), soit un dommage accidentel (clé, objet tranchant). Prada propose une réparation (remplacement doublure) pour sacs authentiques — coût 150-300 € selon complexité.",
      },
    ],
  },
];
