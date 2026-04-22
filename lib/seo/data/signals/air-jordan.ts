import type { GuideSignal } from "../../guide-types";

export const airJordanSignals: GuideSignal[] = [
  {
    slug: "wings-logo",
    name: "Wings Logo",
    brandSlug: "air-jordan",
    category: "sneakers",
    tagline: "Décoder le Wings Logo Air Jordan 1 : gravure, symétrie, finition",
    intro:
      "Le Wings Logo — ce basket-ball ailé estampé ou embossé sur le quartier intérieur des Air Jordan 1 — est l'un des tests les plus parlants pour différencier une vraie paire d'une contrefaçon. Introduit en 1985 avec la Jordan 1 originale, il a conservé le même dessin de référence malgré quelques retravaux mineurs sur les rééditions Retro. Sur une paire authentique, chaque plume de l'aile est nettement séparée, gravée ou embossée avec un relief d'environ 0,6 à 0,8 mm, les bords des plumes restent fins et le mot « AIR » sous le basket-ball est centré avec un kerning stable. Les contrefaçons modernes, y compris les super-fakes LJR ou PK God, trahissent presque toujours un défaut précis : plumes fusionnées par un relief trop mou, basket-ball écrasé horizontalement, ou, très fréquent, un « AIR » décalé de 0,5 à 1 mm vers la gauche ou la droite. Ce logo est gravé en usine avec un outil de pressage à chaud, et l'outillage des fakes est imparfait — il laisse des micro-bavures sur le bord extérieur de l'aile supérieure. Identifier ces bavures prend dix secondes et élimine 80 % des fakes médiocres. Pour les super-fakes, il faut combiner ce test avec la couture intérieure et la forme du toe box.",
    steps: [
      {
        title: "Repérer et photographier le Wings Logo",
        description:
          "Le Wings Logo est positionné sur le quartier intérieur (côté voûte plantaire) de chaque chaussure, environ à mi-hauteur entre la semelle et le collet. Photographiez perpendiculairement, lumière tangentielle douce (fenêtre en lumière indirecte ou LED chaude), pour révéler le relief.",
      },
      {
        title: "Compter et séparer les plumes",
        description:
          "L'aile gauche comporte 7 plumes distinctes, l'aile droite également 7 plumes — chacune avec une séparation nette gravée. Les contrefaçons ont souvent 6 plumes (outillage simplifié) ou des plumes fusionnées deux par deux.",
      },
      {
        title: "Vérifier la centralité du basket-ball",
        description:
          "Le ballon de basket est au centre exact du logo, entouré par les ailes. Tracez mentalement une ligne verticale : elle doit passer par le centre du ballon et par l'espace vide au-dessus de « AIR ». Un ballon décalé de 1-2 mm à gauche ou à droite révèle un pochoir mal aligné.",
      },
      {
        title: "Contrôler la police du mot « AIR »",
        description:
          "« AIR » en lettres capitales fines, Helvetica-like, espacement régulier entre les trois lettres. Un « AIR » trop gras, avec une barre horizontale du A trop haute ou trop basse, ou un espacement irrégulier A-I-R, est une alerte.",
      },
      {
        title: "Tester la profondeur du relief au toucher",
        description:
          "Passez l'ongle perpendiculairement sur les plumes : le relief doit être net, régulier. Un relief mou ou inégal (certaines plumes plus profondes que d'autres) trahit un outillage fake.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre Wings Logo AJ1 High et AJ1 Low",
        description:
          "Le Wings Logo existe uniquement sur les Jordan 1 High (positionné en haut du quartier). Sur les Jordan 1 Low, il n'y a PAS de Wings Logo — il est remplacé par un Jumpman. Chercher un Wings sur une Low révèle une mauvaise connaissance modèle, pas une contrefaçon.",
      },
      {
        title: "Croire qu'un logo doré = paire rare authentique",
        description:
          "Quelques collaborations (Jordan 1 « Shattered Backboard » Origin Story) utilisent un Wings Logo doré. La majorité des drops a un logo noir ou assorti à la couleur du quartier. Un Wings doré sur une Jordan 1 Chicago classique est une alerte contrefaçon.",
      },
      {
        title: "Valider sur un seul côté",
        description:
          "Les deux Wings Logos (gauche et droit) doivent être identiques en relief, alignement et profondeur. Une asymétrie entre la chaussure gauche et la chaussure droite révèle un assemblage à partir de stocks de contrefaçon hétérogènes.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires haut de gamme (Batch 5.0, LJR) utilisent des moules de pressage quasi-identiques mais avec un défaut systématique : la plume numéro 3 de l'aile gauche (comptée depuis le ballon) est légèrement plus courte de 0,3-0,5 mm que sur l'authentique. Ce défaut est invariant sur toute la production fake depuis 2022, car les moules ont été copiés les uns sur les autres et ce biais s'est accumulé. Pour les fakes bas de gamme, le Wings Logo est simplement imprimé (sérigraphie) au lieu d'être embossé : passer l'ongle révèle instantanément l'absence de relief.",
    faqs: [
      {
        question: "Le Wings Logo peut-il s'effacer avec l'usure ?",
        answer:
          "Très peu. Étant embossé dans le cuir (pas imprimé), le Wings Logo reste lisible même sur des paires portées plusieurs années. Ce qui peut s'effacer : le noircissement à l'encre sur certains colorways (Jordan 1 Black Toe) — l'encre s'use mais le relief reste. Une Jordan 1 où le Wings Logo est complètement illisible y compris au toucher est suspecte.",
      },
      {
        question: "Pourquoi mon Wings Logo semble plus brillant qu'en photo Nike.com ?",
        answer:
          "Nike.com utilise un éclairage studio neutre qui aplatit les reflets. En main, le Wings Logo sur cuir véritable présente un léger satiné qui reflète selon l'angle. Un logo mat uniforme, sans aucun reflet sous n'importe quel angle, peut indiquer un cuir synthétique bas de gamme — signal contrefaçon.",
      },
    ],
  },
  {
    slug: "jumpman-placement",
    name: "Placement du Jumpman",
    brandSlug: "air-jordan",
    category: "sneakers",
    tagline: "Contrôler le positionnement du Jumpman sur la languette Jordan",
    intro:
      "Le Jumpman — Michael Jordan silhouetté en pleine envolée vers le panier — est l'icône de toute la ligne Air Jordan et apparaît selon le modèle sur la languette, le talon, les semelles ou les quartiers. Pour les Retros (Jordan 1, 3, 4, 11, 12), son placement est millimétré et documenté : une page produit Nike.com montre toujours le positionnement de référence. Sur une paire authentique, le Jumpman de la languette est cousu (pas collé) sur un patch de cuir ou de textile, positionné à 15-18 mm du bord supérieur de la languette selon le modèle. Ses pieds pointent vers l'avant de la chaussure, le bras gauche est étendu vers le haut, la main droite tient le basket-ball. Les contrefaçons commettent trois erreurs récurrentes : 1) le Jumpman est décalé de plus de 3 mm par rapport au bord (trop haut ou trop bas), 2) ses pieds pointent vers l'arrière ou le côté (orientation miroir), 3) le basket-ball est dans la main gauche au lieu de la droite. Ce dernier défaut est imparable : il révèle un pochoir pris à l'envers en usine de contrefaçon et suffit à condamner la paire sans autre test. Une vérification visuelle appuyée sur une photo officielle Nike.com prend vingt secondes et tranche la majorité des fakes bas et moyen de gamme.",
    steps: [
      {
        title: "Télécharger la photo de référence Nike.com",
        description:
          "Sur Nike.com, cherchez le modèle exact (ex : Air Jordan 4 Retro « White Cement »). Ouvrez la photo officielle de la languette en grand format. Notez le positionnement du Jumpman : distance au bord supérieur, orientation, côté du basket-ball.",
      },
      {
        title: "Mesurer la distance au bord",
        description:
          "Posez une règle souple sur la languette : le haut du Jumpman doit être à 15-18 mm du bord supérieur pour une Jordan 1 High, 10-12 mm pour une Jordan 4, 20-22 mm pour une Jordan 11. Un décalage supérieur à 3 mm par rapport à la référence est un signal fort.",
      },
      {
        title: "Vérifier l'orientation",
        description:
          "Les pieds du Jumpman pointent TOUJOURS vers l'avant de la chaussure (vers les orteils), jamais vers le talon. Son bras gauche est levé vers le haut, son corps légèrement penché vers l'avant. Un Jumpman retourné ou orienté latéralement est une contrefaçon.",
      },
      {
        title: "Identifier la main tenant le basket-ball",
        description:
          "Le basket-ball est dans la main DROITE du Jumpman (donc à gauche de l'image quand vous regardez la languette de face). Une inversion (ballon dans la main gauche) est un défaut d'outillage fake très courant.",
      },
      {
        title: "Contrôler la couture du patch",
        description:
          "Le Jumpman est brodé ou appliqué sur un patch en cuir/textile cousu sur la languette. La couture périphérique compte 6-8 points par cm, régulière, sans dépassement de fil. Un Jumpman collé (pas cousu), ou avec une couture irrégulière, est suspect.",
      },
    ],
    commonErrors: [
      {
        title: "Comparer avec un autre modèle Jordan",
        description:
          "Chaque modèle Jordan a son positionnement. Comparer le Jumpman d'une Jordan 1 avec celui d'une Jordan 4 ne prouve rien. Utilisez toujours la photo Nike.com du modèle EXACT que vous vérifiez.",
      },
      {
        title: "Accepter une asymétrie gauche/droite comme normale",
        description:
          "Certains croient qu'une petite asymétrie entre les deux chaussures est « normale » car fabrication artisanale. Faux : Nike industrialise ses Jordans avec une précision millimétrique. Une asymétrie visible entre gauche et droite révèle un assemblage fake.",
      },
      {
        title: "Ignorer la taille du Jumpman selon pointure",
        description:
          "Le Jumpman est légèrement plus grand sur pointures 44+ et plus petit sur pointures 36-38. Sur une paire en pointure 45 avec un Jumpman miniature taille 38, ou l'inverse, c'est un assemblage à partir d'éléments de contrefaçon incohérents.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs reproduisent le Jumpman avec une broderie dense qui imite le rendu authentique, mais les fils utilisés sont souvent des polyesters bas de gamme qui brillent excessivement sous lumière directe. Le fil Jordan authentique est un polyester mat tissé en 40 wt. Un Jumpman brillant comme du satin est un signal. Pour les fakes haut de gamme, le défaut se déplace vers les proportions : le bras levé est soit trop long de 1-2 mm, soit écarté d'un angle de 2-3° par rapport à la référence. Cette différence, invisible au premier coup d'œil, se voit en superposant mentalement la photo Nike.com sur la paire en main.",
    faqs: [
      {
        question: "Toutes les Jordans ont-elles un Jumpman sur la languette ?",
        answer:
          "Non. La Jordan 1 High classique a le Wings Logo (pas de Jumpman sur la languette — le Jumpman est sur la languette de la Jordan 1 Mid et Low). Jordan 3, 4, 5, 6, 11, 12 ont un Jumpman sur la languette. Jordan 2 originale n'avait pas de logo visible. Vérifiez la photo de référence Nike.com avant toute vérification.",
      },
      {
        question: "Le Jumpman peut-il se déformer avec l'usure ?",
        answer:
          "Légèrement. Un Jumpman brodé sur languette portée quotidiennement peut voir ses fils s'effilocher aux bords après 2-3 ans. En revanche, sa position et son orientation ne bougent jamais — la broderie est solidement cousue. Un Jumpman « mal orienté » sur une paire n'est pas le résultat de l'usure, c'est une contrefaçon.",
      },
    ],
  },
  {
    slug: "code-date",
    name: "Code date Jordan",
    brandSlug: "air-jordan",
    category: "sneakers",
    tagline: "Lire le style code et la date de fabrication Jordan",
    intro:
      "Le style code Jordan suit la même nomenclature Nike (2 lettres + 4 chiffres + tiret + 3 chiffres, ex : « DZ5485-612 ») mais porte des préfixes distinctifs permettant d'identifier rapidement la famille de produit. Les Jordan 1 Retro portent des codes commençant par « 55508 », « 55509 » ou « DO/DZ/DX » selon l'année ; les Jordan 4 Retro par « 30800 » ou « CT8527 » ; les Jordan 11 Retro par « 378037 » ou « 378038 ». Ces préfixes sont stables depuis 2015 et permettent un premier tri en 3 secondes : un Jordan 1 Chicago avec un code « DJ5678-XXX » serait immédiatement suspect, le Chicago 2022 portant officiellement « DZ5485-612 ». La date au format MM/YY doit précéder la date de drop officielle (impossible pour une paire fabriquée APRÈS le drop, sauf restock officiel) et rester cohérente avec le colorway — les restocks 2023-2024 des Jordan 4 White Cement portent des dates « 11/23 » à « 03/24 ». Les contrefacteurs falsifient souvent le code correctement (copier-coller depuis un listing StockX) mais butent sur la date : ils impriment une date aléatoire qui colle rarement avec l'historique public du colorway. Cette incohérence date ↔ drop tranche 40 % des cas douteux.",
    steps: [
      {
        title: "Extraire le style code de l'étiquette langue",
        description:
          "Le code complet (XX1234-567) est imprimé sur la tongue label. Lisez-le sans vous tromper : confusion fréquente entre O et 0, entre I et 1. Notez-le précisément, par exemple sur la galerie photo de votre vérification.",
      },
      {
        title: "Chercher le code sur Nike.com / StockX / GOAT",
        description:
          "Tapez le code exact dans la barre de recherche Nike.com, puis StockX.com, puis GOAT.com. Il doit apparaître au moins sur deux des trois. Un code introuvable partout est une alerte rouge (sauf pour des drops Friends & Family non commerciaux).",
      },
      {
        title: "Vérifier la correspondance code ↔ colorway",
        description:
          "Le colorway sur StockX doit correspondre EXACTEMENT au colorway que vous avez en main. « DZ5485-612 » = Jordan 1 Chicago Lost & Found. Si votre paire est une Jordan 1 « Bred Toe » mais le code renvoie à Chicago, c'est une contrefaçon.",
      },
      {
        title: "Lire la date MM/YY et la comparer au drop",
        description:
          "La date de fabrication (MM/YY) se trouve sous le code. Elle doit être antérieure ou égale à la date de drop officielle + 2 mois (délai logistique). Pour la Jordan 1 Lost & Found (drop 11/22), des dates « 08/22 » à « 11/22 » sont cohérentes. Une date « 06/23 » est suspecte.",
      },
      {
        title: "Vérifier la cohérence code ↔ boîte ↔ carte Sneakers Shield",
        description:
          "Le style code sur la box label, sur la tongue et sur la carte Nike SNKRS Shield (si présente) doit être identique. Un décalage d'un seul caractère révèle un remplacement d'éléments — boîte vraie + paire fake, ou inversement.",
      },
    ],
    commonErrors: [
      {
        title: "Croire qu'un code valide = paire authentique",
        description:
          "Les contrefacteurs recopient les vrais codes. Un code qui scanne sur StockX n'authentifie pas la paire — il authentifie juste que le code existe. Combinez systématiquement avec la typographie de l'étiquette, la couture et la boîte.",
      },
      {
        title: "Valider sur un seul site",
        description:
          "Certains codes sont présents sur StockX mais pas sur Nike.com (colorways F&F retirés). Croisez toujours deux sources. Un code présent uniquement sur un site tiers obscur (SneakerTalk, SneakerFix) sans présence Nike/StockX/GOAT est suspect.",
      },
      {
        title: "Ignorer la date de drop dans la cohérence",
        description:
          "Un collectionneur qui vend une Jordan 1 « deadstock 1994 » avec une date « 03/24 » explique que c'est un restock : c'est un mensonge ou une contrefaçon. Nike ne « restocke » pas les paires vintage avec une date récente — ils font des rééditions nommées Retro.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires achètent des bases de données Nike leakées contenant des milliers de codes authentiques avec leurs dates de production. Ils piochent un code + date au hasard dans cette base et l'impriment sur leurs fakes. Le défaut : ils ne vérifient pas la cohérence code ↔ colorway qu'ils imitent. Une paire qui imite la Jordan 1 Chicago avec un code de Jordan 1 Shadow (même taille d'impression, même MM/YY format) est aujourd'hui la signature la plus commune des fakes moyen de gamme. Pour détecter : recherche rapide du code sur StockX → si le colorway officiel diffère de celui en main, c'est une contrefaçon.",
    faqs: [
      {
        question: "Les Jordans vintage (90's) ont-elles un code à 9 caractères ?",
        answer:
          "Non. Jordans 1985-2000 ont des codes à 6 chiffres sans tiret (ex : « 130207 » pour Jordan 5 Retro 1999). Le format XX1234-567 à 9 caractères apparaît à partir de 2001. Chercher un code à 9 caractères sur une paire « deadstock 1996 » trahit une contrefaçon.",
      },
      {
        question: "Que faire si la date de fabrication est illisible ?",
        answer:
          "Une date complètement effacée est rare sur une paire bien conservée — l'encre imprimée sur étiquette tissée dure 10-15 ans sans dégradation majeure. Une date illisible sur une paire « neuve » (deadstock 2023) révèle soit un stockage catastrophique (humidité), soit une étiquette remplacée. Dans tous les cas, demandez des photos supplémentaires (box label, insole, Shield card) pour reconstituer la cohérence.",
      },
    ],
  },
  {
    slug: "tag-langue",
    name: "Tag langue Jordan",
    brandSlug: "air-jordan",
    category: "sneakers",
    tagline: "Authentifier la tongue tag Jordan : matière, couture, fiche technique",
    intro:
      "Sur les Jordan Retro (1, 3, 4, 11), le tag de langue (tongue tag) est plus épais et plus structuré que sur les Nike classiques. Il est souvent constitué de deux couches : une partie visible (patch en cuir, nubuck ou textile brodé avec le Wings Logo ou le Jumpman selon modèle) et une doublure interne portant le size/style code. Cette double construction est spécifique aux Jordans et introuvable sur une Nike Air Force 1 ou Dunk. Les contrefaçons trahissent systématiquement une de ces trois imperfections : 1) le tag est monocouche (patch collé sur un tissu fin sans structure), 2) la doublure imprimée apparaît au travers du patch par transparence, 3) la couture qui fixe le patch à la languette n'est pas symétrique gauche/droite. Nike produit ces tags avec une couture périphérique de 8-10 points par cm, fil mat noir ou blanc selon colorway, jamais de point croisé ni de dépassement de fil. Un tag qui présente un fil qui dépasse de plus de 2 mm au coin supérieur gauche — défaut signature des fakes asiatiques 2023-2024 — suffit à condamner la paire. Ce test visuel prend trente secondes et s'appuie sur une photo haute résolution du patch prise en lumière tangentielle pour révéler les reliefs de couture.",
    steps: [
      {
        title: "Photographier le tag en lumière tangentielle",
        description:
          "Posez la chaussure, tirez la languette vers l'avant pour déployer le tag à plat. Éclairez en lumière rasante depuis le côté (fenêtre de jour ou LED à 30° par rapport au plan du tag). Cette lumière révèle les reliefs de couture et les imperfections de collage.",
      },
      {
        title: "Vérifier la structure double couche",
        description:
          "Pincez le tag entre pouce et index : vous devez sentir deux couches distinctes (patch extérieur + doublure interne imprimée). Un tag monocouche plié en deux est une simplification fake.",
      },
      {
        title: "Examiner la broderie/impression du patch",
        description:
          "Le Wings Logo ou Jumpman est brodé (relief fil) ou embossé (relief cuir). Jamais sérigraphié plat. Passez l'ongle dessus : relief tactile obligatoire. Un logo parfaitement plat = fake bas de gamme.",
      },
      {
        title: "Contrôler la couture périphérique",
        description:
          "La couture qui fixe le tag à la languette doit être régulière, 8-10 points par cm, fil de même couleur que le patch ou contrastant selon colorway. Aucun nœud visible, aucun fil qui dépasse de plus de 1,5 mm.",
      },
      {
        title: "Lire la doublure imprimée (si visible)",
        description:
          "Certains modèles (Jordan 4) ont une doublure interne imprimée avec code/date répétés. Lisible uniquement en décollant légèrement — ne forcez pas. Si visible par transparence à travers le patch, c'est un défaut de contrefaçon (patch trop fin).",
      },
    ],
    commonErrors: [
      {
        title: "Appliquer les critères Nike sur une Jordan",
        description:
          "Le tongue tag Jordan diffère structurellement du tongue tag Nike classique (plus épais, double couche, broderie au lieu d'impression). Appliquer les critères AF1 sur une Jordan 4 est une erreur — vous allez valider à tort un tag Jordan authentique qui ne ressemble pas à une Nike.",
      },
      {
        title: "Ignorer la couleur du fil selon colorway",
        description:
          "Le fil de couture périphérique varie selon colorway : fil noir sur Jordan 1 Chicago, fil blanc sur Jordan 4 White Cement, fil rouge sur certaines Bred. Un fil blanc sur une Jordan 1 Chicago = alerte rouge.",
      },
      {
        title: "Accepter un tag très rigide comme normal",
        description:
          "Le patch Jordan authentique est ferme mais souple : il plie légèrement sous pression du doigt. Un tag rigide comme du plastique trahit un cuir synthétique bas de gamme ou un renfort collé fake.",
      },
    ],
    counterfeiterTactics:
      "Les fakes haut de gamme reproduisent la double couche avec un patch cuir correct et une doublure imprimée — mais utilisent une colle industrielle qui, après 3-6 mois de port, se décolle aux coins. Les authentiques sont assemblés par couture ET colle néoprène spéciale Nike qui ne se décolle pas avant 5-7 ans d'usage intensif. Un tag dont le coin se décolle sur une paire neuve deadstock est un signal fort. Autre tactique : les faussaires copient des tags de colorways populaires et les montent sur des paires d'autres colorways (ex : tag Chicago sur paire Black Toe). Cette incohérence se voit par cross-check code ↔ colorway.",
    faqs: [
      {
        question: "Pourquoi mon tongue tag Jordan est-il asymétrique gauche/droite ?",
        answer:
          "Une micro-asymétrie (<1 mm) est tolérée car la fabrication reste artisanale par moments. Au-delà de 2 mm, c'est un signal. Vérifiez également le positionnement par rapport au bord de la languette : les deux tags doivent être à la même distance du bord (±1 mm). Une asymétrie de positionnement révèle un montage fake.",
      },
      {
        question: "Le tag peut-il être remplacé par un vendeur malhonnête ?",
        answer:
          "Oui, c'est une pratique documentée : des vendeurs achètent un tag authentique sur Taobao (10-20 €) et le cousent sur une paire contrefaite. Le signal de détection est la couture de remplacement : les trous d'aiguille originaux restent visibles sur la languette autour de la nouvelle couture. Inspecter à la loupe x10 les bords du patch révèle cette double série de trous.",
      },
    ],
  },
  {
    slug: "boite-retro",
    name: "Boîte Retro Jordan",
    brandSlug: "air-jordan",
    category: "sneakers",
    tagline: "Vérifier la boîte d'une Jordan Retro : matière, étiquettes, finition",
    intro:
      "La boîte des Jordan Retro est un élément d'authentification souvent négligé mais parfaitement documenté. Depuis 2015, les Jordan Retro utilisent des boîtes spécifiques par ligne : Jordan 1 Retro High en boîte noire mate avec Jumpman rouge en surimpression, Jordan 3 Retro en boîte blanche à couvercle rouge cartonné épais 1,8 mm, Jordan 4 Retro en boîte blanche rectangulaire avec étiquette coloris sur le côté court, Jordan 11 Retro en boîte noire premium avec finition gommée et Jumpman embossé argenté. Chaque ligne a sa signature. Les faussaires commettent trois erreurs typiques : 1) carton trop fin (≤1,2 mm) qui s'affaisse sous le poids de la paire, 2) finition trop brillante (laquée) au lieu de mate ou gommée, 3) étiquette de côté avec colorway nominal mal formaté (« WHITE BLACK RED » au lieu de « WHITE/BLACK-VARSITY RED »). Le couvercle authentique s'ouvre avec une résistance ferme grâce à un emboîtement précis ; les boîtes fakes ont un jeu de 2-3 mm et s'ouvrent sans résistance. Tester ces points prend moins d'une minute et exclut 50 % des contrefaçons qui se trahissent avant même l'ouverture.",
    steps: [
      {
        title: "Peser la boîte vide",
        description:
          "Une boîte Jordan 1 Retro High vide pèse 340-380 g. Une boîte Jordan 4 Retro vide pèse 420-460 g. Une boîte Jordan 11 Retro vide pèse 480-520 g. Une boîte < 300 g ou > 550 g est suspecte (carton trop fin ou trop épais, colle incorrecte).",
      },
      {
        title: "Mesurer l'épaisseur du carton",
        description:
          "Avec un pied à coulisse ou une règle graduée : épaisseur du couvercle = 1,6 à 2,0 mm. Épaisseur de la base = 2,0 à 2,4 mm. Un carton fin (≤ 1,2 mm) qui se plie facilement sous la pression du doigt est une contrefaçon.",
      },
      {
        title: "Tester la finition du couvercle",
        description:
          "La finition Jordan Retro est mate (Jordan 1, 4) ou gommée (Jordan 11) — jamais brillante/laquée. Passez la main dessus : le mat absorbe la lumière, le gommé a un léger grain. Une finition qui reflète comme un plastique vernis = fake.",
      },
      {
        title: "Vérifier l'étiquette latérale",
        description:
          "L'étiquette de côté contient : modèle complet (« Air Jordan 4 Retro »), colorway nominal formaté « COLOR1/COLOR2-COLOR3 », pointure en US/UK/EU/CM, style code, code-barre EAN-13. Un formatage colorway incorrect, ou un style code absent, est une alerte.",
      },
      {
        title: "Contrôler l'emboîtement couvercle/base",
        description:
          "Fermez la boîte et secouez-la légèrement : pas de jeu perceptible entre couvercle et base. Un écart visible de 2-3 mm tout autour ou un couvercle qui glisse librement = boîte mal ajustée, probablement fake.",
      },
    ],
    commonErrors: [
      {
        title: "Valider la paire sur la seule boîte",
        description:
          "Une boîte authentique vide se revend 30-60 € sur Vinted. Des vendeurs malhonnêtes achètent une boîte vraie et y placent une paire fake. La boîte authentifie la boîte, pas la paire. Croisez systématiquement avec tongue label, Wings Logo et semelle.",
      },
      {
        title: "Rejeter une boîte abîmée comme fake",
        description:
          "Une boîte cabossée au transport, avec un coin enfoncé ou une déchirure du cellophane, ne signifie pas paire fake. C'est la qualité du carton et des étiquettes qui compte. Une boîte neuve parfaite avec des étiquettes douteuses est plus suspecte qu'une boîte abîmée avec étiquettes correctes.",
      },
      {
        title: "Confondre boîte Retro et boîte OG vintage",
        description:
          "Les boîtes OG 1985-2000 diffèrent complètement des boîtes Retro modernes (carton plus fin, graphismes différents, pas de code-barre EAN-13). Appliquer les critères Retro sur une boîte OG 1994 est une erreur — vous allez rejeter à tort une boîte authentique.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs produisent aujourd'hui des boîtes Jordan 1 et Jordan 4 quasi-indistinguables visuellement — même Jumpman, même typographie, même étiquette latérale. Le défaut principal est tactile : le carton fake utilise une colle à base d'eau qui rend la boîte légèrement hygroscopique (elle absorbe l'humidité ambiante). Exposée 24h à une pièce humide (salle de bain), elle gonfle de 0,5-1 mm. Le carton authentique Nike utilise une colle polyuréthane hydrophobe qui reste stable. Test pratique : pesez la boîte, laissez-la 48h dans une pièce à 70 % d'humidité, repesez. Une augmentation > 3 g = carton fake.",
    faqs: [
      {
        question: "La boîte doit-elle obligatoirement accompagner la paire pour authentification ?",
        answer:
          "Non, mais fortement recommandée. L'authentification se fait sur la paire elle-même (tongue label, Wings, semelle, couture). La boîte est un élément complémentaire qui renforce la cohérence globale. Une paire authentique sans boîte reste authentique. Une paire avec boîte fake est suspecte — car cela implique que le vendeur a choisi de reconstituer un emballage, possiblement pour masquer une contrefaçon.",
      },
      {
        question: "Pourquoi certaines boîtes Jordan ont-elles un sticker rouge « AF-1 » ?",
        answer:
          "Aucune boîte Jordan authentique ne porte de mention « AF-1 » (Air Force 1). Si vous voyez ce sticker sur une boîte Jordan, c'est une boîte Air Force 1 maladroitement réutilisée par un faussaire. Les boîtes Jordan portent uniquement le Jumpman et la mention « AIR JORDAN » ou « JORDAN ». Une mention « Nike Air » seule, sans Jumpman, est aussi suspecte.",
      },
    ],
  },
];
