import type { GuideSignal } from "../../guide-types";

export const adidasSignals: GuideSignal[] = [
  {
    slug: "boost-texture",
    name: "Texture de la semelle BOOST",
    brandSlug: "adidas",
    category: "sneakers",
    tagline: "Vérifier la mousse BOOST Adidas : billes, densité, couleur",
    intro:
      "La mousse BOOST d'Adidas — développée avec BASF depuis 2013 — n'est pas une mousse EVA standard mais un agrégat de billes de polyuréthane thermoplastique expansé (TPU expansé) soudées à la vapeur. Cette technologie brevetée donne un aspect granuleux unique : chaque semelle Ultraboost, Yeezy 350 ou NMD authentique révèle des milliers de petites billes translucides à blanc crème, de 0,8-1,2 mm de diamètre, soudées sans colle visible. Les contrefaçons ratent systématiquement trois points : la taille des billes (souvent uniformes à 1,5 mm au lieu d'une distribution 0,8-1,2 mm avec légère variabilité), la couleur (les fakes utilisent du polystyrène blanc pur qui jaunit en UV alors que le vrai BOOST reste blanc crème stable), et le « bounce » (compressez à la main : BOOST authentique = rebond immédiat énergique ; fake = mousse molle type EVA). Un test décisif sur Yeezy 350 : trempez la semelle dans l'eau — le vrai BOOST ne boit pas l'eau (billes hydrophobes soudées) ; un fake en polystyrène absorbe légèrement. Cette vérification permet d'éliminer 90 % des fakes Yeezy sur Vinted en moins d'une minute.",
    steps: [
      {
        title: "Photographier la tranche de la semelle en macro",
        description:
          "Utilisez le mode macro du smartphone (ou une lentille x10) pour photographier la tranche de la semelle. Les billes BOOST doivent être visibles individuellement : forme sphérique irrégulière, taille variable 0,8-1,2 mm, soudures visibles entre billes voisines.",
      },
      {
        title: "Vérifier la couleur et l'opacité",
        description:
          "BOOST authentique = blanc crème translucide avec légers reflets ivoire. Un blanc pur opaque (plastique type polystyrène) révèle un substitut. Comparez avec photos officielles adidas.com du même modèle.",
      },
      {
        title: "Tester le rebond à la main",
        description:
          "Pressez fermement la semelle du pouce sur une zone plate. BOOST authentique rebondit immédiatement et énergiquement (effet trampoline). EVA fake = compression molle, reprise lente de forme sur 2-3 secondes.",
      },
      {
        title: "Test d'hydrophobie (Yeezy et Ultraboost)",
        description:
          "Déposez une goutte d'eau sur la semelle. BOOST authentique ne l'absorbe pas (bille finit par couler sans infiltrer). Un fake en polystyrène laisse l'eau s'infiltrer entre les billes en quelques secondes, créant une trace humide visible.",
      },
      {
        title: "Contrôler la soudure entre billes",
        description:
          "Les billes BOOST authentiques sont soudées à la vapeur sans colle. Au zoom x10, vous verrez des contacts bille-à-bille nets, sans résidu de colle blanche. Un fake avec colle visible entre billes = contrefaçon de moulage basique.",
      },
    ],
    commonErrors: [
      {
        title: "Juger la semelle à travers une vitrine ou en photo vendeur",
        description:
          "Les photos vendeurs sont souvent prises de loin, impossibles à juger sur la texture BOOST. Exigez une photo macro de la tranche de semelle avec un objet de référence (pièce de 1 €) pour l'échelle. Un vendeur qui refuse = red flag.",
      },
      {
        title: "Confondre jaunissement UV et fake",
        description:
          "Une semelle BOOST authentique d'une paire > 3 ans jaunit avec l'exposition UV — ce n'est pas un signe de fake, c'est un signe d'âge. Les paires « Yeezy 350 V2 Zebra 2017 » parfaitement blanches en 2026 sont plus suspectes que celles jaunies naturellement.",
      },
      {
        title: "Oublier les Yeezy faits en Chine vs USA",
        description:
          "Les Yeezy 350 V2 produites aux USA (post-2018) ont une mousse BOOST légèrement plus dense que les chinoises (2016-2017). Ce n'est pas un signe de fake — c'est une différence d'usine documentée. Vérifiez l'étiquette intérieure.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs tentent trois approches : (1) polystyrène expansé peint en blanc cassé — trahi par le test d'hydrophobie ; (2) EVA classique moulé avec texture billes gravée en surface — trahi par l'absence de billes en profondeur (grattez légèrement la surface : EVA révèle de la mousse uniforme ; BOOST révèle d'autres billes identiques) ; (3) mélange EVA + billes TPU collées à la surface — meilleur niveau de fake, trahi par la colle visible au zoom x10 et par un rebond inégal selon la zone pressée. Les super-fakes UA (supposés sortir des mêmes usines) sont rares sur BOOST car BASF contrôle strictement la distribution de matière première.",
    faqs: [
      {
        question: "Pourquoi ma semelle BOOST jaunit-elle plus vite que celle de mon ami ?",
        answer:
          "Le jaunissement BOOST dépend de trois facteurs : exposition UV (porter les paires au soleil accélère tout), humidité (environnement humide = oxydation plus rapide), et composition chimique de la mousse (différence mineure entre lots d'usine). Le jaunissement n'est pas un défaut couvert par la garantie Adidas mais c'est un phénomène naturel — pas un signe de fake. Pour ralentir, stockez en boîte à l'abri de la lumière.",
      },
      {
        question: "Le BOOST des Yeezy est-il identique à celui des Ultraboost ?",
        answer:
          "Chimiquement identique (TPU expansé BASF), mais densité différente. Les Yeezy 350 V2 utilisent un BOOST plus dense (plus ferme) pour la silhouette lifestyle ; les Ultraboost utilisent un BOOST plus souple optimisé running. Les Yeezy 700 ont un BOOST intermédiaire. Cette différence de densité ne change rien au test visuel (billes visibles) mais explique pourquoi le rebond ressenti diffère selon le modèle.",
      },
    ],
  },
  {
    slug: "etiquette-interieure",
    name: "Étiquette intérieure et codes",
    brandSlug: "adidas",
    category: "sneakers",
    tagline: "Décoder l'étiquette langue Adidas : SKU, production, cohérence",
    intro:
      "L'étiquette cousue à l'intérieur de la langue sur une paire Adidas authentique rassemble quatre informations : la pointure (US/UK/FR/JP sur quatre lignes distinctes), le code produit à 6 caractères (ex : « FZ3189 »), la date de fabrication (MM YYYY), et le pays d'assemblage (« MADE IN VIETNAM », « MADE IN CHINA », « MADE IN INDONESIA »). La typographie est Adidas Originals Neue, une version personnalisée de Futura Bold — plus géométrique que le Helvetica de Nike. Les contrefaçons trahissent l'étiquette sur quatre axes : police (souvent Futura générique au lieu de l'AON custom), espacement des lignes (trop serré ou trop aéré), ordre des pointures (parfois inversé US ↔ UK), et couleur de l'étiquette (authentique = blanc cassé avec impression noire ; fakes = blanc pur avec impression gris anthracite). Sur les Yeezy 350 V2, l'étiquette porte aussi la mention « YEEZY SPLY-350 » en surimpression stylisée — détail quasi impossible à reproduire correctement car la police SPLY est une création personnelle de Kanye West utilisée uniquement sur cette ligne.",
    steps: [
      {
        title: "Photographier l'étiquette à plat",
        description:
          "Tirez légèrement la langue, photographiez l'étiquette à la perpendiculaire avec éclairage neutre. Évitez flash direct (sature l'étiquette) et photos en biais (déforme les lettres).",
      },
      {
        title: "Vérifier l'ordre des pointures",
        description:
          "L'ordre authentique est toujours : US en haut, puis UK, FR, JP. L'inversion UK ↔ US est un défaut fréquent sur les fakes (l'usine chinoise met UK en premier par habitude). Si UK apparaît avant US, c'est suspect.",
      },
      {
        title: "Lire le code produit et croiser sur adidas.com",
        description:
          "Le code à 6 caractères (lettres + chiffres) doit exister sur adidas.com avec la même fiche produit correspondant au colorway en main. Tapez le code dans la recherche adidas : si aucune fiche n'apparaît, croisez sur StockX ou Confirmed.",
      },
      {
        title: "Contrôler la date MM YYYY",
        description:
          "Format strict : mois sur 2 chiffres, espace, année sur 4 chiffres (ex : « 03 2024 »). Pas de tiret, pas de slash. Pas d'abbréviation année à 2 chiffres. La date doit être antérieure à la date de drop officielle (repère : release date StockX).",
      },
      {
        title: "Vérifier la mention YEEZY SPLY-350 (Yeezy uniquement)",
        description:
          "Sur Yeezy 350 V2, l'étiquette porte la police SPLY personnalisée (lettres très géométriques avec barres horizontales épaisses). Les fakes utilisent Futura Bold standard, la différence est visible au zoom x5 sur la lettre « Y » (courbe interne non angulaire authentique).",
      },
    ],
    commonErrors: [
      {
        title: "Ignorer la cohérence tongue ↔ box",
        description:
          "Le code produit sur la tongue doit matcher celui de la box label. Les contrefacteurs vendent parfois une boîte authentique avec une paire fake — écart immédiat visible entre tongue et box si on prend le temps de vérifier.",
      },
      {
        title: "Accepter une date incohérente sur les Yeezy Boost",
        description:
          "Les Yeezy 350 V2 Zebra ont droppé en février 2017. Une étiquette datée « 09 2015 » sur ce modèle est une preuve de contrefaçon — la paire n'existait pas encore à cette date. Vérifiez systématiquement date étiquette ↔ date de drop StockX.",
      },
      {
        title: "Confondre étiquette Adidas classique et Adidas Originals",
        description:
          "Les lignes Performance (running, football) et Originals (lifestyle) ont des étiquettes légèrement différentes : Performance utilise Futura Bold standard, Originals utilise Adidas Originals Neue. Vérifiez que le style d'étiquette correspond à la ligne du modèle.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs haut de gamme ont aujourd'hui accès aux bonnes polices (AON, SPLY) via des leaks internes chinois — donc le test typographique ne suffit plus sur les super-fakes. Le point faible restant : l'alignement des lignes. Les machines d'impression fake sont calibrées pour des étiquettes génériques ; les Adidas authentiques ont un spacing ligne-à-ligne de 2,8 mm strict impossible à reproduire à l'identique sans le matériel d'usine Adidas. Mesurez au pied-à-coulisse ou compte-fils : écart ≠ 2,8 mm = suspect.",
    faqs: [
      {
        question: "Pourquoi mon étiquette Adidas n'a-t-elle que US et EU, pas UK et JP ?",
        answer:
          "C'est normal pour certaines lignes Performance (running, training) vendues uniquement aux US/EU où les pointures JP sont jugées non-pertinentes. Les lignes Originals lifestyle — et toutes les Yeezy — ont systématiquement les quatre pointures (US, UK, FR, JP). Une Yeezy avec seulement US/EU sur l'étiquette = fake. Une Adidas UltraBoost running avec seulement US/EU peut être authentique.",
      },
      {
        question: "Les Yeezy Adidas ont-elles gardé le même format d'étiquette après le split 2022 ?",
        answer:
          "Les Yeezy Adidas produites avant octobre 2022 ont l'étiquette classique avec « YEEZY SPLY-350 ». Après la fin du contrat Kanye West ↔ Adidas, Adidas a continué à écouler les stocks existants (jusqu'en 2024) sans modifier les étiquettes. Il n'y a donc pas de « Yeezy Adidas post-2022 » avec étiquette différente — toutes celles en circulation conservent le design original. Toute étiquette modifiée (logo absent, mention différente) est un fake post-split.",
      },
    ],
  },
  {
    slug: "boite-authentique",
    name: "Boîte Adidas : format et signes",
    brandSlug: "adidas",
    category: "sneakers",
    tagline: "Reconnaître une boîte Adidas authentique : couleur, étiquette, finition",
    intro:
      "La boîte Adidas authentique suit des codes stricts qui diffèrent selon ligne : les Performance viennent en boîte noire avec logo blanc (running, training) ; les Originals en boîte rouge-orange (ligne lifestyle classique) ; les Yeezy en boîte orange fluo (couleur Kanye West, arrêtée en 2022) ou grise post-split ; les collabs Adidas Consortium en boîte premium avec livret inclus. Chaque boîte a un carton de qualité spécifique (400-500 gsm), une finition mate (pas brillante), et un logo Adidas imprimé par sérigraphie sur un seul côté plus une impression sur le dessus. Les contrefaçons butent sur la texture du carton (trop fin ou trop brillant), la colle du rabat intérieur (authentique = colle blanche à base d'eau ; fake = colle jaune synthétique à odeur forte), et les étiquettes (mal centrées, typographie approchante). Un signe rarement cité : les boîtes Adidas authentiques ont un « rabat Z » intérieur permettant d'ouvrir-fermer sans déchirure — les fakes ont souvent un rabat droit simple qui s'abîme à la première ouverture. Ce détail mécanique est quasi impossible à imiter sans les machines de pliage Adidas.",
    steps: [
      {
        title: "Identifier la couleur de ligne",
        description:
          "Performance (running, training) = noir logo blanc. Originals = rouge-orange logo blanc. Yeezy pre-split = orange fluo logo noir. Consortium / collabs = couleurs spécifiques avec livret. Toute couleur incohérente avec la ligne = suspect.",
      },
      {
        title: "Vérifier la texture du carton",
        description:
          "Le carton Adidas authentique est 400-500 gsm avec finition mate légèrement rugueuse au toucher. Un carton brillant qui reflète la lumière, ou un carton fin qui plie facilement, révèle une boîte de contrefaçon ou une boîte remplacée.",
      },
      {
        title: "Contrôler le rabat intérieur",
        description:
          "Ouvrez la boîte : le rabat intérieur doit avoir une forme en « Z » (double pli) qui permet une ouverture-fermeture multiple sans déchirure. Un rabat droit qui se plie directement sur le dessus est un signe fort de fake.",
      },
      {
        title: "Inspecter la box label (grande étiquette)",
        description:
          "Étiquette collée sur le petit côté, avec code produit, colorway nominal, pointure, code-barre EAN-13. Doit être parfaitement centrée, sans bulles d'air, avec adhérence ferme. Les fakes ont souvent des bulles ou un décalage de 2-5 mm.",
      },
      {
        title: "Sentir l'odeur intérieure",
        description:
          "Odeur Adidas authentique = légère odeur de carton neutre, sans solvant. Une odeur chimique forte (colle, solvant, plastique) à l'ouverture révèle un carton de contrefaçon utilisant des colles bon marché.",
      },
    ],
    commonErrors: [
      {
        title: "Se fier à la couleur orange pour authentifier une Yeezy",
        description:
          "Les Yeezy pre-2020 sont en boîte orange fluo. Mais les contrefacteurs connaissent la couleur et la reproduisent — l'orange n'est plus un signe d'authenticité à lui seul. Croisez avec texture carton, rabat Z, box label, et surtout contenu (la paire elle-même).",
      },
      {
        title: "Acheter une paire sans sa boîte d'origine",
        description:
          "Une paire Adidas vendue « sans boîte » est un red flag majeur — soit le vendeur vend un fake (peu d'efforts sur l'emballage), soit il cache une boîte défectueuse. Pour une pièce > 150 €, exigez la boîte originale avec toutes les étiquettes.",
      },
      {
        title: "Ignorer les boîtes vides sur Vinted",
        description:
          "Certains vendeurs proposent « boîte Yeezy vide » pour 30-50 €. Ces boîtes vides alimentent l'écosystème des contrefaçons — un faussaire achète une vraie boîte vide et y met sa paire fake. Ne contribuez pas à ce circuit.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs mettent aujourd'hui beaucoup d'efforts sur les boîtes car elles rassurent les acheteurs. Les fakes haut de gamme reproduisent presque parfaitement le visuel — couleur, étiquette, logo. Le point faible restant : le carton. Adidas utilise un carton certifié FSC (forêt gérée durablement) avec une composition fibre spécifique qui donne un toucher unique. Les fakes utilisent du carton recyclé chinois plus brillant et plus rigide. Test décisif : pliez un coin de la boîte vers l'intérieur — le carton Adidas plie progressivement sans fendiller ; le carton fake craque immédiatement avec un bruit sec.",
    faqs: [
      {
        question: "Les boîtes Yeezy post-split Adidas (2023-2024) sont-elles différentes ?",
        answer:
          "Oui. Les stocks Yeezy écoulés par Adidas après la fin du contrat Kanye West (drops 2023-2024) sont en boîte grise neutre sans logo Yeezy — juste le logo Adidas classique. Les étiquettes restent identiques aux pre-split (car les paires elles-mêmes sont des stocks pre-split). Toute boîte orange fluo sur un drop 2023-2024 est suspecte — soit fake, soit boîte recyclée d'un lot précédent.",
      },
      {
        question: "Puis-je acheter une boîte Adidas vide authentique pour protéger mon investissement ?",
        answer:
          "Techniquement oui, mais fortement déconseillé. Adidas ne vend pas de boîtes vides ; les boîtes vides sur Vinted/eBay proviennent soit de ventes où la paire a été gardée sans boîte, soit du circuit des contrefacteurs qui revendent leurs restes. En achetant une boîte vide, vous contribuez à l'économie des fakes (les faussaires l'utilisent pour emballer leurs paires). Préférez conserver votre boîte originale dès l'achat.",
      },
    ],
  },
  {
    slug: "serial-number",
    name: "Serial number (numéro de série)",
    brandSlug: "adidas",
    category: "sneakers",
    tagline: "Vérifier le numéro de série Adidas : emplacement, format, base Adidas",
    intro:
      "Le numéro de série Adidas — distinct du code produit SKU — est un identifiant unique à 14-16 chiffres imprimé à trois endroits : sous l'étiquette intérieure de la langue (petite étiquette cachée, nécessitant de soulever l'étiquette principale), à l'intérieur de la tige près du talon (imprimé directement sur la doublure), et parfois sur la box label (post-2020). Ce numéro sert au tracking logistique et garantie SAV. Chaque paire a un serial unique — si deux paires partagent le même serial, au moins l'une des deux est fake. Le format dépend de l'usine : usines vietnamiennes = 14 chiffres commençant par « 814 », usines chinoises = 15 chiffres commençant par « 851 », usines indonésiennes = 16 chiffres commençant par « 863 ». Les contrefaçons utilisent souvent des serials inventés aléatoirement sans respecter ce format — première lettre/chiffre inhabituelle, longueur incorrecte, ou serial dupliqué d'une paire authentique photographiée ailleurs. La vérification demande un peu d'effort (soulever l'étiquette intérieure) mais élimine les contrefaçons les plus grossières.",
    steps: [
      {
        title: "Soulever partiellement l'étiquette principale",
        description:
          "Avec précaution, soulevez le coin de l'étiquette cousue sur la langue. Une petite étiquette secondaire est cousue en dessous avec le serial number imprimé en noir. Évitez de découdre — soulever suffit.",
      },
      {
        title: "Photographier le serial en macro",
        description:
          "Prenez une photo rapprochée (mode macro) du serial. Les 14-16 chiffres doivent être nets, bien imprimés, sans bavure. Une impression floue ou partielle est suspecte.",
      },
      {
        title: "Vérifier le préfixe selon l'usine",
        description:
          "Les 3 premiers chiffres indiquent l'usine : 814 = Vietnam, 851 = China, 863 = Indonesia, 847 = Thailand. Croisez avec la ligne « MADE IN » de l'étiquette principale. Préfixe 814 mais « Made in China » sur étiquette = incohérence.",
      },
      {
        title: "Croiser avec la doublure intérieure",
        description:
          "Le même serial doit apparaître imprimé en petits caractères sur la doublure intérieure près du talon (visible en mettant la main dans la chaussure). Une divergence serial étiquette ↔ doublure = assemblage frauduleux.",
      },
      {
        title: "Rechercher le serial sur bases publiques (si doute)",
        description:
          "Des bases communautaires (sneakercheck.app, legitapp.com) compilent des serials signalés comme fakes. Un serial déjà présent dans ces bases avec photos de la paire différente = duplicate = fake.",
      },
    ],
    commonErrors: [
      {
        title: "Chercher le serial sur la box label uniquement",
        description:
          "Le serial sur box label est ajouté depuis 2020 seulement. Les paires pre-2020 n'en ont pas sur la box — ça ne signifie pas qu'elles sont fake. Cherchez toujours d'abord sur la tongue (étiquette secondaire sous l'étiquette principale), c'est l'emplacement universel.",
      },
      {
        title: "Accepter un serial dupliqué si le vendeur affirme que c'est une paire de rechange",
        description:
          "Adidas ne produit pas de paires avec serials dupliqués. Un serial identique à une autre paire documentée = au moins une des deux est fake. L'argument « c'est la paire que mon ami a revendue » ne change rien techniquement.",
      },
      {
        title: "Ignorer le serial sous prétexte que la paire est vintage",
        description:
          "Les paires pre-2010 n'avaient pas de serial systématique — absence n'est pas signe de fake. Mais pour les paires post-2015, absence de serial sous l'étiquette principale = fake quasi-certain.",
      },
    ],
    counterfeiterTactics:
      "Deux stratégies faussaires principales : (1) génération aléatoire — le serial n'existe pas en base Adidas, détectable si Adidas partage la base avec un tiers (rarement le cas public, mais possible en expertise judiciaire) ; (2) recopie d'un serial réel vu sur une paire authentique photographiée publiquement — le serial est valide, mais la paire est dupliquée, et deux paires au même serial circulent alors. La défense : demander au vendeur une photo du serial avec la date du jour écrite à côté sur papier (preuve que le serial est sur cette paire, pas recopié d'ailleurs). Un vendeur qui refuse = red flag.",
    faqs: [
      {
        question: "Puis-je vérifier un serial Adidas directement auprès du SAV Adidas ?",
        answer:
          "Pas officiellement. Adidas ne propose pas de service d'authentification public pour les acheteurs tiers. Le SAV vérifie les serials uniquement dans le cadre d'un retour garantie pour une paire achetée sur adidas.com ou en boutique officielle. Pour une paire seconde main, Adidas ne répondra pas. Utilisez les services d'authentification tiers (StockX, GOAT, CheckCheck) qui ont développé des bases internes.",
      },
      {
        question: "Les Yeezy ont-elles un format de serial différent ?",
        answer:
          "Oui, partiellement. Les Yeezy 350 V2 produites aux USA (Missouri) ont un préfixe « 009 » (format spécifique Yeezy USA, 14 chiffres). Les Yeezy 350 V2 chinoises ont le préfixe standard « 851 ». Les Yeezy 500 produites au Vietnam ont « 814 ». Le préfixe doit matcher le pays sur l'étiquette — une Yeezy « Made in USA » avec préfixe « 851 » = fake.",
      },
    ],
  },
  {
    slug: "qr-code",
    name: "QR code CONFIRMED et scan adidas",
    brandSlug: "adidas",
    category: "sneakers",
    tagline: "Scanner le QR code Adidas CONFIRMED : destination et cohérence",
    intro:
      "Depuis 2019, Adidas a ajouté un QR code sur la box label de certains drops hypés — Yeezy, collabs Consortium, releases CONFIRMED app. Le scan du QR renvoie vers une page confirmed.adidas.com ou adidas.com/yeezy avec la fiche du produit exact. C'est un ajout fort car le QR est généré par Adidas et ne peut pas être recopié sur un autre domaine : scanner un QR qui renvoie vers un domaine tiers (aliexpress.com, dhgate.com, domaine obscur) = fake. Les contrefaçons tentent trois approches : (1) pas de QR du tout (paire avec box label basique ne matchant pas le drop CONFIRMED) — détectable ; (2) QR menant vers une fausse page adidas clone — détectable en vérifiant le certificat HTTPS ; (3) QR inerte renvoyant une erreur 404 — détectable au scan. Attention : tous les drops Adidas n'ont pas de QR — son absence n'est pas en soi une preuve de fake. Mais sur un drop CONFIRMED-documenté avec QR, l'absence = red flag. Vérifiez sur stockx ou sneakernews les photos officielles pour confirmer si le QR doit être présent.",
    steps: [
      {
        title: "Localiser le QR code sur la box label",
        description:
          "Le QR code (carré noir avec pixels, 2-3 cm de côté) se trouve sur la box label, généralement en bas à droite ou juste sous le code-barre. Si la paire est un drop CONFIRMED documenté avec QR, absence du QR = suspect.",
      },
      {
        title: "Scanner avec l'appareil photo (iOS) ou Google Lens",
        description:
          "Utilisez l'appareil photo iPhone (détection QR auto) ou Google Lens sur Android. Évitez les apps QR tierces qui peuvent injecter des pubs. Le QR doit se scanner proprement en moins de 2 secondes.",
      },
      {
        title: "Vérifier le domaine de destination",
        description:
          "Le QR authentique redirige vers confirmed.adidas.com, adidas.com/yeezy ou adidas.com/launch. Toute redirection vers un autre domaine (notamment en .cn, .ru, ou des subdomains inconnus) est une preuve de fake.",
      },
      {
        title: "Contrôler la fiche produit affichée",
        description:
          "La page Adidas doit afficher la fiche exacte de la paire en main (même colorway, même nom, même référence). Si la page affiche un autre produit, ou une erreur 404, c'est suspect.",
      },
      {
        title: "Vérifier le certificat HTTPS",
        description:
          "Cliquez sur le cadenas dans la barre d'adresse : le certificat doit indiquer « adidas AG » ou « adidas International B.V. ». Un certificat émis pour un autre nom d'entreprise = site frauduleux clonant l'interface Adidas.",
      },
    ],
    commonErrors: [
      {
        title: "Scanner avec une app QR tierce suspecte",
        description:
          "Certaines apps QR gratuites injectent des redirections publicitaires qui peuvent masquer le vrai domaine cible. Utilisez uniquement l'appareil photo natif iOS ou Google Lens — pas d'app QR tierce.",
      },
      {
        title: "Accepter un QR qui mène à un site Adidas en langue chinoise",
        description:
          "Adidas a un site adidas.com.cn pour la Chine — légitime. Mais un QR sur une paire vendue en Europe qui mène vers adidas.com.cn est suspect (paire grise importée depuis Chine, possiblement revendue sans garantie EU). Pas forcément fake mais circuit non-officiel.",
      },
      {
        title: "Conclure fake sur absence de QR",
        description:
          "Beaucoup de drops Adidas Performance (running, football) n'ont pas de QR — c'est réservé aux CONFIRMED et Yeezy. Croisez avec le modèle : une Ultraboost running sans QR = normal ; une Yeezy 350 V2 drop 2021 sans QR = suspect.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires génèrent parfois leurs propres QR codes imprimés sur les box labels fake, menant à des sites miroir d'adidas.com hébergés sur domaines chinois ou russes. Ces sites clonent visuellement l'interface Adidas et affichent une fausse fiche produit « confirmant » l'authenticité. Test décisif : tapez le domaine du QR dans whois.com — un domaine enregistré depuis moins de 6 mois, avec protection WHOIS, est typiquement un site frauduleux. Adidas.com est enregistré depuis 1995 avec données d'entreprise publiques.",
    faqs: [
      {
        question: "Les Yeezy avant 2019 avaient-elles un QR code sur la box ?",
        answer:
          "Non. Les premiers QR codes sur box Adidas datent de fin 2019 — uniquement sur les drops CONFIRMED app. Les Yeezy 2016-2019 (Turtle Dove, Zebra, Beluga, Cream White) n'ont pas de QR : leur absence est normale et ne doit pas être considérée comme un fake. Pour ces modèles, croisez serial number + étiquette intérieure + BOOST texture.",
      },
      {
        question: "Le QR code peut-il être sur la paire elle-même, pas juste sur la box ?",
        answer:
          "Sur les Adidas Originals lifestyle, le QR est uniquement sur la box label. Sur certaines collabs (Parley for the Oceans, Consortium), un QR secondaire est intégré à un hang tag ou à une carte fournie avec la paire. Sur la paire elle-même (tige, semelle), il n'y a jamais de QR — un QR imprimé sur la chaussure est un signe de fake systématique.",
      },
    ],
  },
];
