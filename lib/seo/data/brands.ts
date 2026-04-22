import type { Brand } from "../types";

export const brands: Brand[] = [
  {
    slug: "nike",
    name: "Nike",
    category: "sneakers",
    logo: "/images/brands/nike.jpg",
    tagline: "La marque sneakers la plus contrefaite au monde",
    description:
      "Nike, fondée à Beaverton en 1964, domine le marché mondial du sneaker avec plus de 51 milliards de dollars de chiffre d'affaires annuel. Ses lignes iconiques — Air Force 1, Dunk, Blazer, Cortez — et ses collaborations hyped (Travis Scott, Off-White, sacai) en font la cible privilégiée des contrefacteurs. Selon les principales plateformes d'authentification, près d'une paire Nike sur cinq en circulation sur le marché secondaire européen est une contrefaçon. Les super-fakes produits en Chine du Sud sont aujourd'hui visuellement très convaincants, exigeant une expertise pointue sur le swoosh, les étiquettes intérieures et la géométrie de la semelle.",
    priceRange: "80-300 € selon modèle",
    productType: "paire de sneakers",
    productPossessive: "une paire de",
    popularModels: ["air-force-1", "dunk-low", "dunk-high", "blazer-mid-77", "cortez", "pegasus", "sb-dunk"],
    signals: [
      {
        title: "Forme et pointe du Swoosh",
        description:
          "Le Swoosh Nike authentique présente une pointe fine et aiguë, avec une courbure progressive et asymétrique. Sur les contrefaçons, le Swoosh est souvent plus bulbeux à l'extrémité, trop épais au centre, ou parfaitement symétrique — ce qui trahit un pochoir industriel low-cost. Comparez systématiquement avec les photos officielles Nike.com du modèle exact.",
        difficulty: 1,
      },
      {
        title: "Étiquette taille intérieure (size tag)",
        description:
          "L'étiquette intérieure Nike authentique a une police nette, sans gras excessif, avec un espacement parfaitement régulier entre les caractères. Les informations obligatoires sont : la pointure US/EU/UK/CM, le Style Code à 9 caractères (format XX1234-567), la date de fabrication et le pays (« Made in Vietnam », « Made in Indonesia »). Une police floue, trop grasse ou des informations manquantes = contrefaçon.",
        difficulty: 1,
      },
      {
        title: "Box label (étiquette boîte)",
        description:
          "La box label Nike authentique comporte Style Code, pointure, colorway nominal (ex. « WHITE/BLACK-UNIVERSITY RED »), code barre et parfois un QR code. La typographie est précise, les espacements rigoureux, et l'étiquette est collée droite sans bulles d'air. Un décalage d'alignement de plus de 2 mm, une police épaisse ou un code qui ne correspond pas au modèle sont des alertes fortes.",
        difficulty: 2,
      },
      {
        title: "Finition et texture de la semelle",
        description:
          "La semelle Nike authentique, particulièrement sur les modèles Air Force 1 et Dunk, présente un pattern d'étoile perlée unique, avec des contrastes de texture entre les zones de traction et les zones lisses. Les contrefaçons uniformisent souvent cette texture, la rendant trop régulière ou trop brute. L'odeur de la colle au niveau de la jointure cupsole doit être discrète — une odeur chimique forte trahit une colle de contrefaçon.",
        difficulty: 2,
      },
      {
        title: "Qualité du cuir et des coutures",
        description:
          "Nike utilise un cuir souple au grain resserré, qui marque légèrement à la pression puis reprend sa forme. Les coutures sont régulières, 7 à 9 points par pouce selon le modèle, sans fils apparents ni nœuds. Sur une contrefaçon, le cuir est plus rigide, le grain plus artificiel, et les coutures présentent des irrégularités visibles même à l'œil nu — bosses, points manquants, fils dépassant.",
        difficulty: 3,
      },
    ],
    faqs: [
      {
        question: "Quels modèles Nike sont les plus contrefaits en 2026 ?",
        answer:
          "Par ordre décroissant : les Air Force 1 Low blanches (volume #1), les Dunk Low Panda, les Jordan 1 Chicago (via marque Jordan), les Travis Scott Jordan, et les collaborations Off-White x Nike. Ces cinq catégories représentent environ 65 % des contrefaçons Nike circulant sur le marché secondaire européen.",
      },
      {
        question: "Comment vérifier le Style Code Nike ?",
        answer:
          "Le Style Code est au format XX1234-567 (2 lettres, 4 chiffres, tiret, 3 chiffres). Recherchez-le sur Nike.com ou StockX — il doit exister et correspondre au modèle + colorway exact présenté. Un Style Code inexistant, attribué à un autre modèle ou un autre colorway est une preuve quasi-définitive de contrefaçon.",
      },
      {
        question: "Les Nike « Made in China » sont-elles toutes fausses ?",
        answer:
          "Non. Nike produit légitimement en Chine, Vietnam, Indonésie et Thaïlande. « Made in China » n'est pas en soi un signe de contrefaçon. En revanche, vérifiez la cohérence entre le pays imprimé sur l'étiquette intérieure et le pays imprimé sur la box label : une incohérence est un signal d'alerte majeur.",
      },
      {
        question: "Que vaut l'application Nike SNKRS pour authentifier ?",
        answer:
          "L'app Nike SNKRS ne fournit pas de service d'authentification post-achat — elle est dédiée aux drops officiels Nike. Pour l'authentification, il faut passer par un service spécialisé type LegitVision (analyse IA 3,99 €) ou par des authentificateurs humains (GOAT, CheckCheck, Entrupy, 10-40 €).",
      },
    ],
  },
  {
    slug: "air-jordan",
    name: "Air Jordan",
    category: "sneakers",
    logo: "/images/brands/jordan.jpg",
    tagline: "Le Saint-Graal des sneakerheads — et des contrefacteurs",
    description:
      "Air Jordan, marque fondée en 1984 autour de Michael Jordan et opérée par Nike, représente à elle seule plus de 6 milliards de dollars de chiffre d'affaires annuel. Les modèles Jordan 1, Jordan 4 et Jordan 11 sont parmi les produits textiles les plus contrefaits au monde toutes catégories confondues. Les Jordan 1 Retro High Chicago, Bred Toe et Travis Scott Mocha comptent respectivement plus de 50 000, 30 000 et 45 000 paires contrefaites identifiées en circulation. La sophistication croissante des super-fakes (cuir premium, box label quasi parfaite) rend la vérification particulièrement complexe en 2026.",
    priceRange: "180-2 500 € selon collaboration",
    productType: "paire de Jordan",
    productPossessive: "une paire de",
    popularModels: ["jordan-1-high", "jordan-1-low", "jordan-4", "jordan-11", "jordan-3", "jordan-travis-scott"],
    signals: [
      {
        title: "Wings logo (Jordan 1) : épaisseur et pointes",
        description:
          "Le Wings logo gaufré sur la tige des Jordan 1 authentiques a des ailes aux pointes arrondies mais nettes, avec une profondeur d'embossage régulière. Sur les contrefaçons, les pointes sont soit trop pointues (agressives), soit totalement arrondies (molles), et l'embossage est souvent trop profond ou trop superficiel. Comparez au millimètre avec des photos de référence.",
        difficulty: 2,
      },
      {
        title: "Jumpman (Jordan 3, 4, 11+) : proportions du personnage",
        description:
          "Le logo Jumpman authentique présente un ballon parfaitement rond, une jambe tendue à un angle spécifique, et un bras levé avec des doigts fins. Sur les contrefaçons, le ballon est souvent ovale, la jambe trop courte ou mal positionnée, et les doigts empâtés. Les Jumpman brodés (boxers, Jordan 11) doivent avoir des points de broderie réguliers de 0,5 mm exactement.",
        difficulty: 2,
      },
      {
        title: "Box label Jordan : typographie et alignement",
        description:
          "La box label Jordan authentique (blanche avec bande colorée selon le modèle) affiche une typographie Helvetica Neue sans aucune bavure, un alignement Style Code / pointure / colorway au pixel près, et un code-barres parfaitement lisible. Les contrefaçons présentent souvent une police trop grasse, des écarts d'alignement de 1-3 mm, et un code-barres de mauvaise définition ou mal positionné.",
        difficulty: 1,
      },
      {
        title: "Coutures nose-side (1, 3, 4, 11)",
        description:
          "Les coutures latérales des Jordan authentiques respectent un nombre précis de points par modèle (ex. 13 points sur le bord latéral de la Jordan 1 High entre l'avant et l'arrière). Les contrefaçons présentent souvent 1-2 points en plus ou en moins, des écarts de tension, ou des fils de couleur légèrement différente. Ce signal demande de compter précisément avec une photo de référence du modèle.",
        difficulty: 3,
      },
      {
        title: "Insole (semelle intérieure) : densité et marquage",
        description:
          "La semelle intérieure Jordan authentique est en mousse dense qui garde brièvement l'empreinte du doigt puis rebondit. Le marquage Jumpman imprimé est précis avec des bords nets. Les contrefaçons ont une semelle en mousse trop molle (qui s'écrase sans rebond) ou trop rigide (sans empreinte), et le marquage est souvent flou ou décentré. Odeur chimique excessive = alerte.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Les Air Jordan sont-elles des Nike ou une marque séparée ?",
        answer:
          "Air Jordan est une sub-brand de Nike Inc., créée en 1984 et opérée comme une division autonome depuis 1997 (« Jordan Brand »). Les boîtes, étiquettes et productions sont cependant partagées avec Nike, et le Style Code a le même format. Air Jordan a ses propres codes visuels (Wings logo, Jumpman) distincts du Swoosh Nike.",
      },
      {
        question: "Pourquoi les Jordan 1 Chicago sont-elles si contrefaites ?",
        answer:
          "Les Jordan 1 Chicago (coloris rouge/blanc/noir original de 1985) combinent trois facteurs : une popularité culturelle ininterrompue, un prix retail à 180 € mais une valeur marché de 800-1 500 € selon la génération, et un design graphique simple qui se copie facilement. Leur ratio profit/complexité de copie en fait la cible #1 des contrefacteurs chinois.",
      },
      {
        question: "Existe-t-il des super-fakes Jordan vraiment indétectables ?",
        answer:
          "Les super-fakes « UA » (Unauthorized Authentic) atteignent aujourd'hui un niveau tel que 15-20 % des authentificateurs humains se trompent sur des paires non portées. Les différences résident sur des détails millimétriques (épaisseur des coutures, rendu exact de la mousse) que seule une analyse comparative fine peut révéler. C'est précisément là que l'IA vision de LegitVision apporte une précision constante.",
      },
      {
        question: "Que vaut le service Nike Jordan Authentication ?",
        answer:
          "Nike ne propose aucun service d'authentification post-achat pour les Jordan. Les seules solutions fiables sont : GOAT (services « Clean » inclus à l'achat), StockX (authentification systématique), CheckCheck (payant 15-40 €) ou LegitVision (3,99 € par IA). Aucune autorité officielle Jordan Brand n'émet de certificat pour les paires d'occasion.",
      },
    ],
  },
  {
    slug: "adidas",
    name: "adidas",
    category: "sneakers",
    logo: "/images/brands/adidas.png",
    tagline: "Le géant allemand entre heritage et lifestyle",
    description:
      "adidas, fondée à Herzogenaurach en 1949, pèse 22 milliards d'euros de chiffre d'affaires en 2025 et reste la deuxième marque sneakers mondiale. Ses lignes Originals (Samba, Gazelle, Stan Smith, Campus) ont connu une renaissance massive depuis 2023, avec une explosion de la demande et, mécaniquement, des contrefaçons. La rupture avec Kanye West en 2022 a également relancé le marché secondaire Yeezy à des niveaux records, attirant une nouvelle vague de super-fakes. Les signaux d'authentification adidas diffèrent substantiellement de Nike, notamment sur les trois bandes, la structure du talon et le marquage des languettes.",
    priceRange: "90-400 € selon modèle",
    productType: "paire de sneakers adidas",
    productPossessive: "une paire de",
    popularModels: ["samba", "gazelle", "stan-smith", "campus", "yeezy-350", "yeezy-500", "superstar"],
    signals: [
      {
        title: "Les 3 bandes : parallélisme et profondeur",
        description:
          "Les 3 bandes latérales adidas authentiques sont rigoureusement parallèles, avec un espacement constant sur toute leur longueur, et une profondeur d'embossage (sur cuir) ou d'impression (sur textile) uniforme. Les contrefaçons présentent souvent une légère convergence des bandes (écart qui se resserre vers l'avant), des finitions de bord imparfaites, ou une densité d'impression hétérogène.",
        difficulty: 1,
      },
      {
        title: "Étiquette intérieure : typographie Trefoil",
        description:
          "Le logo Trefoil (feuille de trèfle à 3 lobes) présent sur l'étiquette intérieure adidas Originals a des proportions exactes : les 3 lobes sont de taille identique, parfaitement symétriques, avec 3 barres horizontales de largeur égale. Les contrefaçons montrent souvent des lobes légèrement asymétriques ou des barres de largeurs différentes. L'étiquette mentionne aussi le code Article Number (6 chiffres) à vérifier sur adidas.com.",
        difficulty: 2,
      },
      {
        title: "Talon (heel) : structure et padding",
        description:
          "Le talon adidas authentique a une structure ferme avec un padding intérieur dense, résistant à la pression du pouce (ne s'écrase pas). Les modèles rétro (Samba, Gazelle) présentent un talonnette T-shaped ou trèfle gravée/brodée avec des dimensions précises. Les contrefaçons ont souvent un padding mou, un logo talon mal aligné ou de mauvaise dimension.",
        difficulty: 2,
      },
      {
        title: "Box label adidas : format et QR code",
        description:
          "La box label adidas authentique est collée droite avec une tolérance < 2 mm, et mentionne : Article Number (6 chiffres), pointure multi-système, colorway nominal, date de fabrication au format MM/AAAA, et QR code fonctionnel qui redirige vers adidas.com/[product]. Une box avec QR qui ne fonctionne pas, ou un Article Number inexistant sur le site officiel, est presque toujours une contrefaçon.",
        difficulty: 1,
      },
      {
        title: "Semelle Boost ou EVA : densité et pattern",
        description:
          "Les semelles Boost (Yeezy, Ultraboost, NMD) authentiques ont des capsules TPU régulières, parfaitement collées sans résidu de colle visible, et avec une élasticité caractéristique (rebond 60-70 % à la pression). Les semelles EVA classiques (Samba, Gazelle) ont un pattern de traction net sans bavures. Les contrefaçons utilisent un Boost simulé (mousse EVA moulée en pseudo-capsules) qui ne rebondit pas et finit par s'effriter en 3-6 mois.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Les Yeezy sont-elles toujours produites par adidas en 2026 ?",
        answer:
          "Non, adidas a mis fin à son partenariat avec Kanye West en octobre 2022. Les stocks existants ont été écoulés progressivement jusqu'en 2024 via des drops Yeezy Day sur adidas.com. Toute nouvelle paire Yeezy mise en vente après 2024 est soit un stock existant, soit une contrefaçon — il n'y a plus de production officielle.",
      },
      {
        question: "Comment vérifier l'Article Number adidas ?",
        answer:
          "L'Article Number est au format 6 chiffres (ex. IE1000) ou plus récemment alphanumérique. Cherchez-le sur adidas.com/article-[numéro] ou sur StockX. Il doit exister et correspondre au modèle + colorway exact. Un numéro inexistant ou attribué à un autre modèle est une preuve de contrefaçon presque définitive.",
      },
      {
        question: "Les Samba et Gazelle sont-elles massivement contrefaites ?",
        answer:
          "Oui, depuis 2023-2024. La viralité TikTok et Instagram des Samba OG et Gazelle Indoor a multiplié par 8 les contrefaçons en circulation. Les super-fakes les plus récentes reproduisent parfaitement le gum sole, le cuir pull-up et les 3 bandes, avec des écarts détectables uniquement sur la typographie de l'étiquette intérieure et le marquage gravé.",
      },
      {
        question: "adidas propose-t-il un service d'authentification officiel ?",
        answer:
          "Non, adidas n'a aucun programme officiel d'authentification pour les paires d'occasion. Les seules solutions fiables sont les authentificateurs tiers : StockX (systematic check), GOAT, CheckCheck, ou les services IA comme LegitVision (3,99 € avec résultat en 60 secondes).",
      },
    ],
  },
  {
    slug: "new-balance",
    name: "New Balance",
    category: "sneakers",
    logo: "/images/brands/new-balance.png",
    tagline: "Le retour en grâce du Made in USA/UK",
    description:
      "New Balance, fondée à Boston en 1906, était historiquement cantonnée au segment running et lifestyle discret jusqu'à son explosion culturelle en 2022-2024 via les collaborations Aimé Leon Dore, Joe Freshgoods et Salehe Bembury. Les modèles 990v5, 990v6, 550 et 2002R sont aujourd'hui les sneakers les plus recherchées du marché premium, avec des prix secondaires dépassant régulièrement les 500 €. Cette demande explosive a attiré une vague massive de contrefaçons depuis 2023, concentrée sur les modèles Made in USA (990v5 Grey, 993) et Made in UK (991, 1500) dont les signaux d'authentification sont spécifiques et mal connus du grand public.",
    priceRange: "130-600 € selon modèle",
    productType: "paire de New Balance",
    productPossessive: "une paire de",
    popularModels: ["990v5", "990v6", "550", "2002r", "993", "1906r", "992"],
    signals: [
      {
        title: "N logo : finition et adhérence",
        description:
          "Le grand « N » latéral New Balance authentique est en cuir suédé ou synthétique haute densité, cousu avec un pourtour régulier de 1 mm et aucun décalage entre les deux jambages du N. Sur les contrefaçons, le N est souvent légèrement asymétrique, avec des coutures irrégulières visibles au toucher, et un décollement fréquent dès les premiers mois d'usage.",
        difficulty: 1,
      },
      {
        title: "Made in USA / Made in UK : authentification officielle",
        description:
          "Les modèles 990v5, 990v6, 993 et 998 portent le marquage « Made in USA » sur la languette et/ou l'étiquette intérieure, et les séries 991, 1500, 670 portent « Made in UK ». Ce marquage est une revendication officielle New Balance, encadrée par la FTC (États-Unis) et le Trade Mark Office (Royaume-Uni). Une contrefaçon portant ce marquage est juridiquement une fraude aux indications géographiques.",
        difficulty: 2,
      },
      {
        title: "Box label : format et provenance cohérente",
        description:
          "La box New Balance authentique mentionne : modèle (ex. M990GL5), pointure, colorway, date de fabrication, et lieu de production (Flimby UK, Lawrence MA USA, Vietnam, Indonésie). Vérifiez la cohérence entre le pays de la box et celui imprimé sur l'étiquette intérieure — une incohérence est presque toujours une contrefaçon. La typographie NB est spécifique, toujours en Helvetica, sans empâtements.",
        difficulty: 2,
      },
      {
        title: "Midsole EVA/Polyurethane : couches et finition",
        description:
          "Les New Balance premium (990 series) utilisent une midsole multi-couches avec ABZORB et/ou ENCAP bien visibles sur le flanc : les couches sont nettement distinctes, sans bavures de colle, et la jointure avec l'outsole est régulière. Les contrefaçons simulent souvent les couches par impression 2D ou avec des matériaux monolithiques, trahissant une texture différente au toucher et une dégradation prématurée.",
        difficulty: 3,
      },
      {
        title: "Languette (tongue) : padding et broderie",
        description:
          "La languette New Balance authentique a un padding dense (ne s'écrase pas sous la pression), une broderie du logo ou du nom du modèle avec des points réguliers de 0,5 mm, et un marquage intérieur détaillant le modèle + pays de fabrication. Les contrefaçons ont souvent une languette trop fine, une broderie irrégulière avec des fils dépassant, ou un marquage intérieur absent ou mal imprimé.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Pourquoi les New Balance 990v5 et 2002R explosent-elles en valeur ?",
        answer:
          "Le phénomène remonte à 2020-2022 avec la collaboration Aimé Leon Dore qui a recontextualisé New Balance en marque lifestyle premium. Le 990v5 Grey Day et le 2002R « Protection Pack » Salehe Bembury sont devenus des must-have, avec des prix marché dépassant 400-600 € en 2026 contre un retail de 210 €. Cette inflation rapide a attiré les contrefacteurs.",
      },
      {
        question: "Le Made in USA / UK est-il vraiment un gage de qualité ?",
        answer:
          "Oui. La production Flimby (UK) et Lawrence/Skowhegan (USA) applique des standards de contrôle qualité supérieurs à la production asiatique, avec des cuirs premium (Horween Leather pour certaines collabs) et un assemblage main pour certaines étapes. Les modèles Made in USA coûtent 40-60 % plus cher que les équivalents Made in Asia, ce qui justifie les prix élevés.",
      },
      {
        question: "Comment vérifier l'authenticité sans expérience New Balance ?",
        answer:
          "Si vous achetez vos premières New Balance en seconde main, concentrez-vous sur trois signaux rapides : box label cohérente avec l'étiquette intérieure, pays de fabrication cohérent entre les deux, et sensation de qualité du N latéral au toucher (cuir/suède authentique vs synthétique low-cost). En cas de doute, une analyse IA LegitVision à 3,99 € règle la question.",
      },
      {
        question: "Les New Balance 550 sont-elles moins contrefaites que les 990 ?",
        answer:
          "Proportionnellement oui, car leur prix retail (130-150 €) et leur prix marché (150-250 €) offrent une marge de contrefaçon plus faible. Les contrefacteurs concentrent leurs efforts sur les modèles à forte plus-value : 990v5/v6, 2002R, et les collabs Aimé Leon Dore ou Joe Freshgoods qui dépassent souvent 400-500 € au marché.",
      },
    ],
  },
  {
    slug: "louis-vuitton",
    name: "Louis Vuitton",
    category: "bags",
    logo: "/images/brands/louis-vuitton.png",
    tagline: "La maison française la plus contrefaite de l'histoire",
    description:
      "Louis Vuitton, maison fondée en 1854 et pilier du groupe LVMH, génère plus de 23 milliards d'euros de chiffre d'affaires annuel, dont plus de 60 % sur la maroquinerie. Les modèles Neverfull, Speedy, Alma et Keepall figurent dans le top 5 des articles les plus contrefaits au monde, avec une production clandestine estimée à 30 millions de pièces par an — soit près de 10 fois la production officielle. La sophistication des super-fakes LV a atteint en 2024-2026 un niveau critique : cuir Vachetta convaincant, monogramme imprimé quasi parfait, et quincaillerie dorée correctement lourde. Seuls les micro-détails (code date, alignement monogramme, police du heat-stamp) permettent la distinction.",
    priceRange: "800-25 000 € selon modèle",
    productType: "sac Louis Vuitton",
    productPossessive: "un sac",
    popularModels: ["neverfull", "speedy", "alma", "keepall", "onthego", "capucines", "pochette-metis"],
    signals: [
      {
        title: "Alignement du monogramme sur les coutures",
        description:
          "Sur un Louis Vuitton authentique, le monogramme canvas est coupé de façon à ce que les motifs LV/fleurs soient symétriques sur les deux faces du sac, avec alignement rigoureux aux coutures latérales. Les super-fakes récents réussissent ce test sur la face principale mais échouent souvent sur les côtés ou sur la poche intérieure. Vérifiez aussi l'orientation des motifs sur les anses et les rabats.",
        difficulty: 2,
      },
      {
        title: "Heat-stamp : « LOUIS VUITTON Paris made in France »",
        description:
          "Le heat-stamp intérieur Louis Vuitton authentique présente une typographie spécifique avec le L et le V de « LOUIS VUITTON » en majuscules parfaitement formées, un tiret précis dans « LOUIS VUITTON », et un espacement calibré. La profondeur de gravure est uniforme. Les contrefaçons montrent souvent un L trop courbé, un V asymétrique, ou une profondeur irrégulière. Sur les modèles récents (> 2021), la mention exact du pays varie (France, Espagne, Italie, États-Unis, Suisse).",
        difficulty: 2,
      },
      {
        title: "Code date (date code) — jusqu'en 2021",
        description:
          "Les Louis Vuitton produits avant mars 2021 portent un code date de 4 caractères (2 lettres + 4 chiffres) gravé sur un cuir intérieur. Les 2 lettres indiquent le lieu de production (SD = France, CA = Espagne, FL = USA, etc.) et les 4 chiffres la semaine + année au format SSAA. Exemple : MB1189 = fabriqué en France en semaine 18 de 2019. Un code incohérent (lettre inconnue, date impossible, semaine 53+) est une preuve de contrefaçon.",
        difficulty: 2,
      },
      {
        title: "Puce RFID — depuis 2021",
        description:
          "Depuis mars 2021, Louis Vuitton a remplacé le code date par une puce RFID cachée dans la doublure. Cette puce contient les informations de production et de traçabilité. Les vendeurs authentiques peuvent obtenir la validation en boutique LV avec un simple scan. En l'absence de puce détectable (après 2021) ou d'un code date manifestement incorrect (avant 2021), la contrefaçon est probable à 95 %.",
        difficulty: 3,
      },
      {
        title: "Cuir Vachetta : vieillissement et odeur",
        description:
          "Le cuir Vachetta (anses, bordures sur les modèles monogramme) est laissé non traité par Louis Vuitton, ce qui lui donne un patina miel progressif avec le temps et les UV. Un cuir Vachetta trop foncé d'emblée (teint artificiellement), trop clair mais rigide (cuir synthétique), ou avec une odeur chimique forte est une contrefaçon. Le cuir authentique sent légèrement le cuir neuf, jamais le plastique ni la colle forte.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Louis Vuitton propose-t-il un service d'authentification officiel ?",
        answer:
          "Partiellement. Les boutiques Louis Vuitton peuvent confirmer ou infirmer l'authenticité d'un sac en visuel, mais ne délivrent aucun certificat écrit officiel. Cette pratique est informelle et dépend du vendeur en boutique. Les seules authentifications écrites reconnues proviennent d'experts tiers : Entrupy, Real Authentication, LegitGrails, ou LegitVision (IA).",
      },
      {
        question: "Que signifie « code date » Louis Vuitton ?",
        answer:
          "Le code date est un marquage à 4 caractères (2 lettres + 4 chiffres) gravé à l'intérieur des sacs Louis Vuitton produits avant mars 2021. Les lettres codent le lieu de fabrication, les chiffres la semaine et l'année. Depuis 2021, LV a remplacé ce système par une puce RFID. Un sac récent (2022+) sans puce RFID ni code date est nécessairement une contrefaçon.",
      },
      {
        question: "Les Neverfull sont-elles les plus contrefaites ?",
        answer:
          "Oui, de loin. Le Neverfull MM (taille moyenne) en Monogram est le modèle LV le plus contrefait au monde, avec plus de 8 millions de contrefaçons produites chaque année selon les douanes européennes. Sa popularité, son prix retail autour de 1 800-2 500 € et son design relativement simple à copier en font la cible prioritaire absolue des contrefacteurs.",
      },
      {
        question: "Un Louis Vuitton sans dust bag est-il forcément faux ?",
        answer:
          "Non. L'absence de dust bag peut simplement signifier que le propriétaire original l'a perdu ou jeté. En revanche, un dust bag présent mais mal imprimé (logo LV flou, couleur marron incorrect, typographie approximative) est un signal plus fort de contrefaçon que l'absence totale de dust bag.",
      },
    ],
  },
  {
    slug: "chanel",
    name: "Chanel",
    category: "bags",
    logo: "/images/brands/chanel.png",
    tagline: "L'exclusivité française au cœur du super-fake",
    description:
      "Chanel, maison parisienne fondée par Gabrielle Chanel en 1910, reste l'une des deux icônes absolues du luxe mondial avec Hermès. Ses sacs Classic Flap, 2.55, Boy et 19 constituent un marché d'investissement à part entière, avec des hausses annuelles de prix retail de 8-12 % depuis 2019. Cette rareté orchestrée (quotas d'achat, listes d'attente) a alimenté un marché secondaire estimé à 3,2 milliards d'euros par an, où 25-35 % des sacs en circulation seraient des contrefaçons selon les douanes françaises. Les super-fakes Chanel produits depuis 2023 atteignent un réalisme tel que même les experts visuels se trompent sur des photos — seul l'examen physique du cuir, du matelassage et de la puce permet la distinction finale.",
    priceRange: "3 500-30 000 € selon modèle",
    productType: "sac Chanel",
    productPossessive: "un sac",
    popularModels: ["classic-flap", "2-55", "boy", "19", "gabrielle", "coco-handle", "wallet-on-chain"],
    signals: [
      {
        title: "Hologramme d'authenticité : grille et sérialisation",
        description:
          "Les sacs Chanel produits depuis 1986 portent un sticker hologramme rond avec un numéro de série à 7-8 chiffres (selon l'année). L'hologramme authentique présente une grille de sécurité précise, un fond doré nuancé, et la police du numéro est spécifique — les 0 ont une forme ovale légèrement allongée, les 7 une barre oblique. Les contrefaçons montrent souvent une police trop générique, un hologramme trop brillant uniformément, ou une absence de grille de sécurité visible à 45°.",
        difficulty: 2,
      },
      {
        title: "Carte d'authenticité : matière, coins et texte",
        description:
          "La carte d'authenticité Chanel authentique est en carton noir mat avec le numéro de série en embossage (relief tactile, pas imprimé) et des coins parfaitement coupés à 90°. Elle correspond systématiquement au numéro de l'hologramme dans le sac. Les contrefaçons produisent des cartes avec numéros imprimés à plat, du carton brillant, ou des coins légèrement arrondis. Une absence totale de carte sur un sac récent (< 10 ans) est également un signal d'alerte.",
        difficulty: 1,
      },
      {
        title: "Matelassage (quilting) : régularité et points par diamant",
        description:
          "Le matelassage Chanel authentique suit un pattern géométrique strict, avec un nombre précis de points par diamant qui varie selon le modèle (ex. 12 points par diamant sur le Classic Flap Medium). Les diamants sont parfaitement alignés sur toute la surface, y compris sur les côtés et au dos. Les contrefaçons présentent souvent 1 point en plus ou en moins, ou des irrégularités d'alignement visibles sur les angles.",
        difficulty: 3,
      },
      {
        title: "CC logo : verrou et quincaillerie",
        description:
          "Le CC logo doré du Classic Flap authentique a des proportions précises : les deux C ont exactement la même épaisseur, s'entrecroisent à un angle spécifique (le C droit par-dessus le C gauche en haut), et la quincaillerie pèse un poids caractéristique (60-80 g selon la taille). Les CC de contrefaçon ont souvent des épaisseurs inégales, un angle d'entrecroisement inversé, ou une quincaillerie trop légère (< 40 g) en plastique doré plutôt qu'en métal.",
        difficulty: 2,
      },
      {
        title: "Cuir : grain, souplesse et odeur",
        description:
          "Chanel utilise trois cuirs principaux : caviar (grain granuleux résistant), lambskin (agneau ultra-doux), et chèvre (grain fin et souple). Chaque cuir a une signature tactile et olfactive spécifique. Le caviar authentique présente un grain irrégulier avec des micro-reliefs visibles à la loupe ; le lambskin est d'une douceur extrême avec un marquage facile à la pression. Les contrefaçons utilisent souvent un cuir tanné artificiellement trop uniforme, avec une odeur chimique de traitement forte.",
        difficulty: 3,
      },
    ],
    faqs: [
      {
        question: "Chanel authentifie-t-il ses sacs d'occasion ?",
        answer:
          "Non, strictement jamais. Chanel a pour politique officielle de ne jamais authentifier ni réparer un sac acheté en seconde main, même présenté en boutique. Seuls les sacs achetés directement chez Chanel ou en revendeur officiel sont pris en charge pour SAV. Pour l'occasion, il faut passer par des experts tiers ou un service IA comme LegitVision.",
      },
      {
        question: "Que signifie le numéro de série Chanel ?",
        answer:
          "Le numéro de série à 7-8 chiffres sur l'hologramme intérieur permet de dater approximativement la production du sac. Chaque plage de numéros correspond à une année (ex. 22xxxxxx = 2016-2017, 25xxxxxx = 2018-2019, 29xxxxxx = 2020-2021, 31xxxxxx = 2022-2024). Un numéro incohérent avec le design du sac (style ancien + numéro récent) est une preuve de contrefaçon.",
      },
      {
        question: "Les super-fakes Chanel sont-ils détectables ?",
        answer:
          "Oui, mais c'est de plus en plus difficile sur photo. Les super-fakes 2024-2026 reproduisent correctement l'hologramme, le matelassage visible et le CC logo principal. Les différences résident sur des micro-détails : grain exact du cuir, poids précis de la quincaillerie, régularité du matelassage sur les angles cachés, et micro-gravures sur les fermoirs. Une analyse IA multi-zones est devenue la méthode la plus fiable.",
      },
      {
        question: "Pourquoi les prix Chanel augmentent-ils chaque année ?",
        answer:
          "Chanel applique une stratégie délibérée d'augmentation retail annuelle (8-12 % par an depuis 2019) pour positionner ses sacs comme actifs d'investissement et justifier la rareté. Un Classic Flap Medium en caviar vendu 5 100 € en 2019 coûte aujourd'hui 10 800 € chez Chanel. Cette inflation a alimenté le marché secondaire et, mécaniquement, les contrefaçons.",
      },
    ],
  },
  {
    slug: "gucci",
    name: "Gucci",
    category: "bags",
    logo: "/images/brands/gucci.png",
    tagline: "L'italien baroque aux mille déclinaisons",
    description:
      "Gucci, maison fondée à Florence en 1921 et pilier du groupe Kering, reste dans le top 3 mondial du luxe avec 10,5 milliards d'euros de chiffre d'affaires en 2025. Sa diversification massive (maroquinerie, prêt-à-porter, chaussures, accessoires, beauté, horlogerie) et ses multiples monogrammes (GG Supreme, Double G, Horsebit, Web Stripe) en font l'une des marques les plus contrefaites au monde, avec des volumes comparables à Louis Vuitton. Les modèles Dionysus, Marmont, Jackie et Ophidia concentrent plus de 70 % des faux en circulation. La variabilité des codes d'authentification selon les collections (Tom Ford, Frida Giannini, Alessandro Michele, Sabato De Sarno) complexifie la vérification pour les non-initiés.",
    priceRange: "900-15 000 € selon modèle",
    productType: "article Gucci",
    productPossessive: "un",
    popularModels: ["marmont", "dionysus", "jackie", "ophidia", "horsebit-1955", "bamboo", "soho"],
    signals: [
      {
        title: "Double G logo : forme et embossage",
        description:
          "Le Double G logo Gucci authentique (sur les boucles et quincaillerie) présente deux G entrelacés avec une épaisseur de trait uniforme, des courbes parfaitement rondes, et une symétrie miroir parfaite entre les deux G. La quincaillerie est lourde (laiton plaqué or, 40-90 g selon la taille), sans résidu de moulage apparent. Les contrefaçons ont souvent des G asymétriques, une épaisseur de trait irrégulière, et une quincaillerie légère en alliage zinc.",
        difficulty: 2,
      },
      {
        title: "Heat-stamp intérieur : « Gucci Made in Italy »",
        description:
          "Le heat-stamp intérieur Gucci authentique est gravé à la chaleur sur un cuir intérieur avec une profondeur uniforme, une typographie spécifique (le G majuscule a une terminaison courte, le C a une ouverture précise), et mentionne toujours le pays de fabrication. La gravure laisse une marque tactile nette au doigt. Les contrefaçons présentent souvent une police trop générique, une profondeur inégale, ou un cuir intérieur de mauvaise qualité qui ne retient pas le marquage.",
        difficulty: 2,
      },
      {
        title: "Numéro de série et code produit",
        description:
          "Chaque sac Gucci authentique comporte un numéro de série à 10-12 chiffres gravé sur un petit cuir intérieur, au format « XXXXXX • XXXX » (6 chiffres + bullet point + 4 chiffres). Le premier groupe identifie le modèle, le second le colorway et le lot de fabrication. Ce numéro existe dans la base Gucci et peut être vérifié en boutique sur présentation de l'article. Un numéro sans bullet point, mal formaté, ou inexistant dans la base Gucci = contrefaçon.",
        difficulty: 2,
      },
      {
        title: "Canvas GG Supreme : densité et couleurs",
        description:
          "Le canvas GG Supreme (toile monogrammée beige/marron) a une densité de 320 g/m² exactement, avec une teinte beige spécifique qui ne jaunit pas au soleil. Les motifs GG sont imprimés en marron légèrement plus sombre que le fond, avec un contraste précis. Les contrefaçons utilisent un canvas plus léger (qui se déforme), avec des motifs soit trop foncés (marron café), soit trop clairs (taupe), et une tenue matière inférieure.",
        difficulty: 2,
      },
      {
        title: "Web Stripe vert-rouge-vert : largeur et saturation",
        description:
          "La célèbre Web Stripe Gucci (vert-rouge-vert) a des proportions exactes : bande rouge au centre de 10 mm avec deux bandes vertes de 8 mm de chaque côté. Les couleurs sont saturées mais pas fluo : vert foncé profond (Pantone 357), rouge vif (Pantone 202). Les contrefaçons montrent souvent des bandes trop claires, trop fluo, ou avec des proportions déséquilibrées (rouge trop fin, vert trop large).",
        difficulty: 1,
      },
    ],
    faqs: [
      {
        question: "Gucci offre-t-il un service d'authentification en boutique ?",
        answer:
          "Officiellement non, mais certaines boutiques Gucci acceptent de vérifier visuellement l'authenticité d'un sac si le client est poli et insistant. Aucun certificat écrit n'est délivré. Pour une authentification reconnue, passez par Entrupy (200-500 € selon article), Real Authentication (30-50 €), ou un service IA comme LegitVision (3,99 €).",
      },
      {
        question: "Pourquoi les Marmont Gucci sont-elles autant contrefaites ?",
        answer:
          "Le GG Marmont Matelassé (sortie 2016, ère Alessandro Michele) est devenu en une décennie l'un des sacs Gucci les plus vendus au monde. Son design relativement simple (chevron quilting, Double G), son prix retail accessible (1 200-2 500 €) et sa très forte notoriété en font une cible prioritaire des contrefacteurs. On estime que 40 % des GG Marmont en circulation en seconde main sont des contrefaçons.",
      },
      {
        question: "Comment distinguer Gucci d'époque Tom Ford d'Alessandro Michele ?",
        answer:
          "Les Gucci Tom Ford (1994-2004) ont un design minimaliste, des monogrammes discrets, et des quincailleries argentées ou chromées principalement. Les Gucci Alessandro Michele (2015-2022) sont baroques, multicolores, avec symbolismes animaux (tigres, serpents, abeilles) et quincaillerie dorée. Les codes d'authentification (typographie heat-stamp, formatage du numéro de série) varient entre les deux époques.",
      },
      {
        question: "Un Gucci sans carte d'authenticité est-il forcément faux ?",
        answer:
          "Non. Gucci fournit une carte « Controllato » sur certains modèles, mais pas systématiquement. La présence ou absence de cette carte n'est pas un signal d'authentification fiable — concentrez-vous plutôt sur le heat-stamp, le numéro de série intérieur et la qualité de la quincaillerie Double G pour l'authentification.",
      },
    ],
  },
  {
    slug: "hermes",
    name: "Hermès",
    category: "bags",
    logo: "/images/brands/hermes.png",
    tagline: "L'artisanat français le plus copié — et le plus dur à reproduire",
    description:
      "Hermès, maison parisienne fondée en 1837, incarne le sommet absolu de la maroquinerie mondiale avec ses modèles Birkin, Kelly et Constance vendus 7 000 à 250 000 € en boutique — et souvent 2 à 5 fois leur prix retail en seconde main. Sa production exclusivement artisanale (1 sac = 1 artisan = 15-25 heures de travail) et sa politique d'allocation stricte (pas de vente libre, listes d'attente) créent une rareté orchestrée qui a généré un marché noir massif. Les contrefaçons Hermès se divisent en deux catégories : les super-fakes « UA » produites à partir de cuirs premium par d'anciens artisans, et les fakes industrielles plus grossières. L'authentification Hermès est la plus technique du luxe, nécessitant expertise sur le cuir, les selliers-tâcherons, et les codes de production changeants chaque année.",
    priceRange: "7 000-250 000 € selon modèle et cuir",
    productType: "sac Hermès",
    productPossessive: "un sac",
    popularModels: ["birkin-25", "birkin-30", "birkin-35", "kelly-25", "kelly-28", "constance-18", "constance-24"],
    signals: [
      {
        title: "Heat-stamp « HERMÈS PARIS MADE IN FRANCE »",
        description:
          "Le heat-stamp Hermès authentique est gravé à chaud sous le rabat ou à l'intérieur du sac, en majuscules parfaites. L'accent grave sur le È est précis (pas une apostrophe), les espacements sont calibrés, et la profondeur de gravure est uniforme à 0,3-0,5 mm. Le « MADE IN FRANCE » n'est jamais absent ni remplacé par un autre pays — Hermès ne produit qu'en France. Une contrefaçon avec « Made in Italy » ou police approximative est détectable immédiatement.",
        difficulty: 1,
      },
      {
        title: "Blind stamp (cachet année + artisan)",
        description:
          "À côté du heat-stamp principal, Hermès marque discrètement chaque sac avec un blind stamp (gravure sans encre) indiquant l'année de fabrication (lettre ronde, carrée ou autre selon l'année) et le numéro/symbole de l'artisan-sellier (sur un petit carré). Ce double marquage est une signature impossible à répliquer correctement sans base de données Hermès. Les contrefaçons omettent souvent le blind stamp ou le placent de manière incorrecte.",
        difficulty: 3,
      },
      {
        title: "Couture sellier : 3-5 points par centimètre, fil lin ciré",
        description:
          "Hermès utilise exclusivement la couture sellier (point sellier) manuelle, avec 3 à 5 points par centimètre selon le modèle, en fil de lin ciré. Chaque point est noué individuellement et résiste à la traction. Les contrefaçons utilisent des machines à coudre industrielles (points trop réguliers, fils polyester) ou simulent le point sellier mais avec des écarts de tension visibles. La couture Hermès est légèrement irrégulière — c'est normal, car faite main.",
        difficulty: 3,
      },
      {
        title: "Cuir : Togo, Epsom, Swift, Clémence, Box — odeur et grain",
        description:
          "Hermès travaille plus de 40 types de cuir différents, chacun avec un grain, une souplesse et une odeur spécifiques. Le Togo (grain robuste mais souple), l'Epsom (grain texturé uniforme), le Swift (grain fin soyeux), le Clémence (grain décontracté) et le Box calf (lisse miroir) sont les principaux. Les contrefaçons utilisent souvent du cuir générique tanné en Chine ou en Turquie, reconnaissable à une odeur chimique forte et à un grain imprimé (pas structurel).",
        difficulty: 3,
      },
      {
        title: "Quincaillerie palladium/or : poids, finition, marquage",
        description:
          "La quincaillerie Hermès authentique (cadenas, clés, tournants) est en palladium massif ou en or 18 carats sur les pièces premium. Le poids est caractéristique : un cadenas Birkin pèse 35-40 g en palladium. Chaque pièce est marquée « HERMÈS » gravé finement à l'intérieur, avec police spécifique. Les contrefaçons utilisent du laiton plaqué argenté/doré, 2-3 fois plus léger, avec une gravure absente ou mal formée.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Peut-on acheter un Birkin directement chez Hermès ?",
        answer:
          "En théorie oui, en pratique presque jamais. Hermès applique une politique d'allocation stricte : les Birkin et Kelly ne sont proposés qu'aux clientes ayant un historique d'achats significatif (prêt-à-porter, bijoux, accessoires) sur plusieurs années. Un achat direct en boutique pour une nouvelle cliente est quasi impossible, ce qui alimente le marché secondaire et les contrefaçons.",
      },
      {
        question: "Que signifie le blind stamp Hermès ?",
        answer:
          "Le blind stamp est une gravure sans encre, souvent cachée sous le rabat ou près du heat-stamp principal, qui indique l'année de production (symbole variant chaque année) et l'identifiant de l'artisan qui a fabriqué le sac (numéro ou symbole dans un carré). Cette double signature est intraçable publiquement mais vérifiée par Hermès sur demande pour ses clients.",
      },
      {
        question: "Pourquoi les super-fakes Hermès existent-ils ?",
        answer:
          "Le prix des Birkin et Kelly en seconde main (30 000-250 000 €) crée une marge qui justifie une production haut de gamme de contrefaçons. Certaines super-fakes « UA » sont produites par d'anciens artisans tanneurs ou maroquiniers qui ont quitté des maisons européennes, utilisant des cuirs premium achetés en Italie. Ces pièces peuvent tromper l'œil même d'experts, et seule l'analyse combinée du blind stamp + cuir + quincaillerie + couture permet la détection.",
      },
      {
        question: "Vaut-il mieux acheter Hermès chez Vestiaire Collective ?",
        answer:
          "Oui, Vestiaire Collective est la plateforme la plus sûre pour acheter du Hermès d'occasion grâce à leur équipe d'authentification dédiée au luxe. Cependant, même Vestiaire peut laisser passer des super-fakes très récentes. Pour un sac > 10 000 €, un double contrôle via Entrupy ou LegitVision reste fortement recommandé avant d'accepter la livraison.",
      },
    ],
  },
  {
    slug: "prada",
    name: "Prada",
    category: "bags",
    logo: "/images/brands/prada.png",
    tagline: "Le renouveau italien porté par Re-Edition",
    description:
      "Prada, maison milanaise fondée en 1913, vit depuis 2020 une renaissance culturelle majeure portée par la collection Re-Edition 2000 (nylon Saffiano), la collaboration Prada x adidas, et la renaissance du minimalisme italien. Les modèles Re-Edition Nylon Mini, Cleo, Galleria et Saffiano Bag concentrent l'essentiel de la demande en seconde main en 2025-2026, avec des prix marché dépassant régulièrement 30-50 % le retail en boutique. Cette inflation a attiré une vague de contrefaçons concentrée sur le nylon Saffiano (triangle logo) et la quincaillerie Prada, avec des super-fakes atteignant un niveau visuel convaincant sur photo. Les codes d'authentification Prada (triangle logo, carte authenticité, code produit) sont relativement précis et permettent une détection fiable au toucher physique.",
    priceRange: "1 200-8 000 € selon modèle",
    productType: "article Prada",
    productPossessive: "un",
    popularModels: ["re-edition-2000", "re-edition-2005", "cleo", "galleria", "saffiano-lux", "sidonie"],
    signals: [
      {
        title: "Triangle logo : forme, gravure et matière",
        description:
          "Le triangle logo Prada authentique est un triangle isocèle parfait avec « PRADA » gravé en relief sur la face, et « MILANO DAL 1913 » ou « DAL 1913 » gravé en plus petit en dessous selon le modèle. La base du triangle est toujours parfaitement horizontale par rapport au cuir. Sur les contrefaçons, le triangle peut être légèrement biais (2-5° d'inclinaison), la gravure « PRADA » trop profonde ou trop superficielle, et le « DAL 1913 » mal aligné ou absent.",
        difficulty: 1,
      },
      {
        title: "Carte d'authenticité Prada : format et sérialisation",
        description:
          "Les sacs Prada sont livrés avec une carte d'authenticité blanche avec le logo triangle et un numéro série à 13 chiffres + 1 lettre de contrôle. Ce code existe dans la base Prada et peut être vérifié en boutique (sans certificat écrit). La carte est imprimée sur papier épais légèrement texturé. Les contrefaçons fournissent souvent une carte sur papier trop lisse, avec un numéro aléatoire qui n'existe pas dans la base Prada.",
        difficulty: 2,
      },
      {
        title: "Nylon Saffiano : grain spécifique et texture",
        description:
          "Le nylon Saffiano (Re-Edition 2000, Re-Edition 2005) a une texture ripstop spécifique avec un quadrillage fin visible de près, une résistance particulière à l'eau, et un toucher satiné sans être brillant. Les contrefaçons utilisent souvent un nylon générique trop lisse, trop brillant (effet plastique), ou avec un quadrillage mal imprimé. Le poids au mètre carré est également différent (280 g/m² authentique vs 180-220 g/m² contrefaçon).",
        difficulty: 2,
      },
      {
        title: "Quincaillerie : poids, marquage « PRADA »",
        description:
          "La quincaillerie Prada authentique (boucles, fermoirs, zip pulls) est en métal plaqué or ou argent, gravée « PRADA » finement sur une face ou sur la base. Le poids est caractéristique : une boucle de ceinture Prada pèse 85-110 g selon la taille. Les contrefaçons utilisent un zinc plaqué doré/argenté 2-3 fois plus léger, avec une gravure souvent incomplète ou mal placée.",
        difficulty: 2,
      },
      {
        title: "Intérieur : jacquard « PRADA MILANO » et finition",
        description:
          "L'intérieur des sacs Prada en jacquard ou satin porte le motif répété « PRADA MILANO » avec une typographie spécifique et un espacement régulier. La doublure est toujours de haute qualité, avec des coutures intérieures parfaitement finies. Les contrefaçons présentent souvent une doublure en satin de mauvaise qualité, un motif « PRADA MILANO » mal imprimé avec des bavures, ou des coutures intérieures apparentes et irrégulières.",
        difficulty: 2,
      },
    ],
    faqs: [
      {
        question: "Comment vérifier le numéro de série Prada ?",
        answer:
          "Le numéro série Prada (13 chiffres + 1 lettre) peut être vérifié uniquement en boutique Prada sur présentation du sac. Prada ne fournit aucun outil de vérification en ligne. Aucun certificat écrit n'est délivré — la confirmation est purement visuelle/orale. Pour une authentification formelle, passez par Entrupy, Real Authentication ou LegitVision (IA 3,99 €).",
      },
      {
        question: "Pourquoi la Re-Edition 2000 explose-t-elle en seconde main ?",
        answer:
          "Sortie initialement en 2000 puis réintroduite en 2019-2020, la Re-Edition 2000 Nylon Mini est devenue l'icône Y2K par excellence, portée par Bella Hadid, Kim Kardashian et des figures majeures du revival des années 2000. Son prix retail de 1 650 € atteint 2 200-2 800 € en seconde main, et les colorways limités (rose, baby blue, burgundy) dépassent 3 500 €. Cette spéculation attire massivement les contrefacteurs.",
      },
      {
        question: "Nylon Prada vs nylon générique : comment faire la différence ?",
        answer:
          "Le nylon Saffiano Prada authentique a un grain ripstop visible de près (quadrillage fin), une résistance à l'eau supérieure (test de la goutte d'eau qui perle), un toucher satiné mais non plastifié, et un poids plus dense au mètre carré. Le nylon générique est souvent plus lisse, plus brillant, moins hydrofuge, et plus léger. L'étiquette intérieure Prada précise « 100 % nylon tecno » ou « nylon tessuto ».",
      },
      {
        question: "Les sacs Prada vintage sont-ils moins contrefaits ?",
        answer:
          "Oui, proportionnellement. Les modèles Prada des années 90-2010 (Saffiano originelle, Galleria d'origine) ont un marché secondaire moins liquide que la Re-Edition, donc moins de contrefaçons. En revanche, la vague vintage Y2K de 2023-2025 a relancé la production de fakes sur certains modèles historiques (Prada Tessuto 2005, Boston Bag d'époque).",
      },
    ],
  },
  {
    slug: "dior",
    name: "Dior",
    category: "bags",
    logo: "/images/brands/dior.png",
    tagline: "La couture française au cœur de la revente spéculative",
    description:
      "Christian Dior, maison parisienne fondée en 1946 et pilier du groupe LVMH, a connu depuis 2016 (arrivée de Maria Grazia Chiuri) une transformation massive de sa maroquinerie avec le lancement du Saddle Bag 2018 (réédition), du Book Tote, du Lady Dior updates, et de la Bobby Bag. Ces lancements, couplés à des drops limités, ont créé un marché secondaire estimé à 1,8 milliards d'euros en 2025, particulièrement tendu sur le Saddle Bag (prix retail 3 500 €, marché 4 500-5 500 €) et le Book Tote XL. Cette spéculation a attiré une vague massive de super-fakes produits dès 2021, atteignant un niveau de détail croissant sur le Oblique canvas, le Cannage quilting et la quincaillerie D charms. Les signaux d'authentification Dior (typographie spécifique, placement exact des tags, qualité du canvas) permettent néanmoins une détection fiable pour un œil entraîné.",
    priceRange: "1 800-12 000 € selon modèle",
    productType: "sac Dior",
    productPossessive: "un sac",
    popularModels: ["saddle-bag", "book-tote", "lady-dior", "bobby", "caro", "30-montaigne", "j-adior"],
    signals: [
      {
        title: "Typographie « CHRISTIAN DIOR » : espacement et sérif",
        description:
          "La typographie « CHRISTIAN DIOR » utilisée sur les tags intérieurs, charms et quincailleries est une serif spécifique avec des empattements courts et nets. L'espacement entre « CHRISTIAN » et « DIOR » est précis (environ 1,5 x la hauteur d'une lettre majuscule). Les contrefaçons utilisent souvent une serif générique (type Times New Roman) avec des empattements trop longs, ou un espacement visiblement différent. Le « PARIS » ajouté en dessous doit être aligné centralement.",
        difficulty: 2,
      },
      {
        title: "Canvas Oblique : densité et orientation des D",
        description:
          "Le canvas Oblique Dior (monogramme beige et noir avec les D entrelacés) a une densité matière de 400 g/m² environ, avec un pattern géométrique précis : les D sont inclinés à 30° exactement, en alternance de 2 tons (beige clair + beige foncé), avec une répétition motif toutes les 4-5 cm. Les contrefaçons montrent souvent des D avec inclinaison variable (25-35°), des tons trop contrastés (presque marron vs beige), ou un canvas plus léger qui se déforme.",
        difficulty: 2,
      },
      {
        title: "Tag intérieur en cuir : format, gravure et blind stamp",
        description:
          "Chaque sac Dior authentique porte un tag intérieur en cuir (souvent agneau ou veau) avec « CHRISTIAN DIOR » et « MADE IN ITALY » (ou France pour certains modèles) gravés à chaud, plus un blind stamp alphanumérique sur le revers indiquant le code de production (modèle + année + trimestre). Le tag est toujours cousu sur 4 côtés avec couture régulière. Les contrefaçons ont souvent un tag mal cousu sur 2-3 côtés seulement, ou un blind stamp au dos absent ou illisible.",
        difficulty: 3,
      },
      {
        title: "Charms D.I.O.R : épaisseur, poids et gravure",
        description:
          "Les charms D.I.O.R (4 lettres en pendentif sur l'anse du Saddle Bag, Book Tote, Lady Dior) sont en métal plaqué or ou argent, chacune avec une gravure précise. Le poids total des 4 charms est de 35-45 g selon le modèle. Les lettres ont des empattements spécifiques et une épaisseur uniforme. Les contrefaçons utilisent du zinc plaqué légèrement doré/argenté, 2-3 fois plus léger, avec des lettres parfois mal gravées ou légèrement asymétriques.",
        difficulty: 2,
      },
      {
        title: "Cannage quilting (Lady Dior) : régularité et profondeur",
        description:
          "Le cannage Lady Dior authentique est un quilting en losange parfaitement régulier, avec des lignes de matelassage identiques sur toute la surface du sac, y compris sur les côtés et le fond. La profondeur du quilting est uniforme, donnant un relief net. Les contrefaçons présentent souvent un cannage irrégulier (losanges de tailles variables, particulièrement visibles sur les angles), ou une profondeur hétérogène (certains losanges trop plats).",
        difficulty: 3,
      },
    ],
    faqs: [
      {
        question: "Dior propose-t-il une authentification officielle ?",
        answer:
          "Non. Comme Chanel et Louis Vuitton, Dior refuse d'authentifier les sacs d'occasion, même présentés en boutique. Certains vendeurs en boutique peuvent faire un avis visuel informel, mais aucun certificat écrit n'est délivré. Pour une authentification reconnue, il faut passer par Entrupy, Real Authentication, LegitGrails ou un service IA comme LegitVision.",
      },
      {
        question: "Que signifie le code intérieur Dior ?",
        answer:
          "Chaque sac Dior authentique porte un blind stamp alphanumérique au dos du tag cuir intérieur, au format 2 lettres + 4 chiffres (ex. BO0178). Les 2 lettres indiquent le modèle et l'usine de production, les 4 chiffres la date de fabrication au format trimestre/année ou semaine/année selon les collections. Ce code n'est pas publiquement vérifiable mais son format doit être cohérent.",
      },
      {
        question: "Pourquoi les Saddle Bag sont-elles si contrefaites ?",
        answer:
          "La Saddle Bag originale (John Galliano 2000, re-éditée en 2018 par Maria Grazia Chiuri) est devenue un must-have millenial/Gen Z avec plus de 2 millions de pièces vendues depuis sa réédition. Son prix retail à 3 500 € et son marché secondaire à 4 500-5 500 € (jusqu'à 8 000 € pour les colorways limités) offrent une marge de contrefaçon exceptionnelle. Plus de 35 % des Saddle Bags en circulation en seconde main sont des contrefaçons selon les estimations.",
      },
      {
        question: "Les collaborations Dior Jordan sont-elles contrefaites aussi ?",
        answer:
          "Oui, massivement. Les Dior Jordan 1 High (sortie 2020, 13 000 paires produites, retail 2 200 €, marché 8 000-15 000 €) sont parmi les sneakers les plus contrefaites au monde malgré leur rareté. Les contrefaçons circulent avec des boîtes Dior/Jordan dupliquées et des charms D-pendentifs reproduits. Une authentification professionnelle est indispensable pour ce modèle spécifique.",
      },
    ],
  },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
